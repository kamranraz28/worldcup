<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApproveRegistrationRequest;
use App\Http\Requests\BulkImportRegistrationRequest;
use App\Http\Requests\RejectRegistrationRequest;
use App\Http\Requests\StoreRegistrationRequest;
use App\Models\Event;
use App\Models\Ticket;
use App\Services\RegistrationExportService;
use App\Services\RegistrationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegistrationController extends Controller
{
    private $registrationService;
    private $exportService;

    public function __construct(RegistrationService $registrationService, RegistrationExportService $exportService)
    {
        $this->registrationService = $registrationService;
        $this->exportService = $exportService;
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'ticket_type', 'event_id', 'date_from', 'date_to']);

        return Inertia::render('Registrations/Index', [
            'registrations' => $this->registrationService->paginate($filters, $request->integer('per_page', 15)),
            'filters' => $filters,
            'stats' => $this->registrationService->getStats(),
            'events' => \App\Models\Event::select('id', 'title', 'start_date')->published()->latest('start_date')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Registrations/Create', [
            'events' => \App\Models\Event::select('id', 'uuid', 'title', 'start_date', 'max_capacity', 'ticket_price', 'requires_verification')
                ->published()
                ->latest('start_date')
                ->get(),
            'customers' => \App\Models\Customer::select('id', 'uuid', 'first_name', 'last_name', 'email', 'phone')
                ->orderBy('first_name')
                ->get(),
        ]);
    }

    public function store(StoreRegistrationRequest $request): RedirectResponse
    {
        $event = Event::findOrFail($request->input('event_id'));

        try {
            $ticket = $this->registrationService->register($event, $request->validated());
            return redirect()
                ->route('registrations.show', $ticket)
                ->with('flash', ['success' => 'Registration created successfully.']);
        } catch (\RuntimeException $e) {
            return back()
                ->withInput()
                ->with('flash', ['error' => $e->getMessage()]);
        }
    }

    public function show(string $uuid): Response
    {
        $ticket = $this->registrationService->find($uuid);

        if (!$ticket) {
            abort(404);
        }

        $ticket->loadMissing([
            'event:id,title,start_date,end_date,venue_name,max_capacity,ticket_price,status',
            'customer',
            'session',
            'approver:id,name',
            'rejecter:id,name',
        ]);

        $actions = $this->registrationService->getActions($ticket);
        $waitingList = $ticket->event ? $this->registrationService->getWaitingList($ticket->event) : collect();

        return Inertia::render('Registrations/Show', [
            'registration' => $ticket,
            'actions' => $actions,
            'waitingList' => $waitingList,
        ]);
    }

    public function approve(ApproveRegistrationRequest $request, string $uuid): RedirectResponse
    {
        $ticket = $this->registrationService->find($uuid);

        if (!$ticket) {
            abort(404);
        }

        try {
            $this->registrationService->approve($ticket, $request->input('notes'));
            return back()->with('flash', ['success' => 'Registration approved.']);
        } catch (\RuntimeException $e) {
            return back()->with('flash', ['error' => $e->getMessage()]);
        }
    }

    public function reject(RejectRegistrationRequest $request, string $uuid): RedirectResponse
    {
        $ticket = $this->registrationService->find($uuid);

        if (!$ticket) {
            abort(404);
        }

        try {
            $this->registrationService->reject($ticket, $request->input('reason'), $request->input('notes'));
            return back()->with('flash', ['success' => 'Registration rejected.']);
        } catch (\RuntimeException $e) {
            return back()->with('flash', ['error' => $e->getMessage()]);
        }
    }

    public function cancel(Request $request, string $uuid): RedirectResponse
    {
        $ticket = $this->registrationService->find($uuid);

        if (!$ticket) {
            abort(404);
        }

        $request->validate(['reason' => ['nullable', 'string', 'max:500']]);

        $this->registrationService->cancel($ticket, $request->input('reason'));

        return back()->with('flash', ['success' => 'Registration cancelled.']);
    }

    public function waitingList(string $eventUuid): Response
    {
        $event = Event::where('uuid', $eventUuid)->firstOrFail();
        $waitingList = $this->registrationService->getWaitingList($event);

        return Inertia::render('Registrations/WaitingList', [
            'event' => $event->loadCount(['tickets as confirmed_count' => fn ($q) => $q->where('status', 'confirmed')]),
            'waitingList' => $waitingList,
        ]);
    }

    public function notifyWaitingList(Request $request, string $eventUuid): RedirectResponse
    {
        $event = Event::where('uuid', $eventUuid)->firstOrFail();

        $request->validate(['count' => ['required', 'integer', 'min:1', 'max:100']]);

        $notified = $this->registrationService->notifyFromWaitingList($event, $request->integer('count'));

        return back()->with('flash', ['success' => $notified->count() . ' waiting list entries notified.']);
    }

    public function import(BulkImportRegistrationRequest $request): RedirectResponse
    {
        $event = Event::findOrFail($request->input('event_id'));
        $file = $request->file('import_file');

        $registrations = $this->parseImportFile($file);

        try {
            $tickets = $this->registrationService->bulkImport($event, $registrations);
            return redirect()
                ->route('registrations.index')
                ->with('flash', ['success' => $tickets->count() . ' registrations imported successfully.']);
        } catch (\RuntimeException $e) {
            return back()->with('flash', ['error' => $e->getMessage()]);
        }
    }

    public function exportCsv(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $filters = $request->only(['event_id', 'status', 'date_from', 'date_to']);
        $csv = $this->exportService->toCsv($filters);

        return response()->streamDownload(function () use ($csv) {
            echo $csv;
        }, 'registrations-' . now()->format('Y-m-d') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function importPage(): Response
    {
        return Inertia::render('Registrations/Import', [
            'events' => \App\Models\Event::select('id', 'uuid', 'title', 'start_date')
                ->published()
                ->latest('start_date')
                ->get(),
        ]);
    }

    private function parseImportFile($file): array
    {
        $path = $file->getRealPath();
        $rows = array_map('str_getcsv', file($path));
        $header = array_shift($rows);
        $header = array_map('trim', $header);

        $registrations = [];
        foreach ($rows as $row) {
            if (count($row) !== count($header)) {
                continue;
            }
            $registrations[] = array_combine($header, $row);
        }

        return $registrations;
    }
}
