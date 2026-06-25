<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\CheckInService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckInController extends Controller
{
    private $checkInService;

    public function __construct(CheckInService $checkInService)
    {
        $this->checkInService = $checkInService;
    }

    public function scanner(Request $request)
    {
        $events = $this->checkInService->getEventsForDropdown();
        $stats = $this->checkInService->getDailyStats();
        $pendingSync = $this->checkInService->getPendingSyncCount();

        $activeEventId = $request->input('event_id');
        if ($activeEventId) {
            $event = Event::find($activeEventId);
            $attendance = $event ? $this->checkInService->getEventAttendance($event->id) : null;
        } else {
            $attendance = null;
        }

        return Inertia::render('CheckIn/Scanner', [
            'events' => $events,
            'stats' => $stats,
            'pendingSync' => $pendingSync,
            'activeEvent' => $activeEventId,
            'attendance' => $attendance,
        ]);
    }

    public function scan(Request $request)
    {
        $validated = $request->validate([
            'qr_code' => 'required|string|max:255',
            'event_id' => 'required|integer|exists:events,id',
            'scan_method' => 'nullable|string|in:qr,manual,nfc',
            'device_id' => 'nullable|string|max:100',
            'offline_queue_id' => 'nullable|string|max:100',
            'location' => 'nullable|array',
            'location.lat' => 'nullable|numeric',
            'location.lng' => 'nullable|numeric',
        ]);

        $result = $this->checkInService->scan(
            $validated['qr_code'],
            $validated['event_id'],
            [
                'scan_method' => $validated['scan_method'] ?? 'qr',
                'device_id' => $validated['device_id'] ?? null,
                'offline_queue_id' => $validated['offline_queue_id'] ?? null,
                'location' => $validated['location'] ?? null,
            ]
        );

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json($result, $result['success'] ? 200 : ($result['code'] === 'DUPLICATE_SCAN' ? 409 : 422));
        }

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    public function validateQr(Request $request)
    {
        $validated = $request->validate([
            'qr_code' => 'required|string|max:255',
            'event_id' => 'required|integer|exists:events,id',
        ]);

        $result = $this->checkInService->validateQrCode($validated['qr_code'], $validated['event_id']);

        return response()->json($result);
    }

    public function history(Request $request)
    {
        $perPage = (int) $request->input('per_page', 25);
        $filters = $request->only(['event_id', 'date_from', 'date_to', 'is_valid', 'scan_method', 'search', 'customer_id']);

        $query = \App\Models\CheckIn::with([
            'ticket:id,uuid,qr_code,ticket_type,status',
            'event:id,uuid,title',
            'customer:id,uuid,first_name,last_name,email,phone',
            'scanner:id,name',
        ])->latest('scanned_at');

        if (!empty($filters['event_id'])) {
            $query->where('event_id', $filters['event_id']);
        }
        if (!empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }
        if (!empty($filters['date_from'])) {
            $query->where('scanned_at', '>=', \Carbon\Carbon::parse($filters['date_from'])->startOfDay());
        }
        if (!empty($filters['date_to'])) {
            $query->where('scanned_at', '<=', \Carbon\Carbon::parse($filters['date_to'])->endOfDay());
        }
        if (!empty($filters['is_valid'])) {
            $query->where('is_valid', filter_var($filters['is_valid'], FILTER_VALIDATE_BOOLEAN));
        }
        if (!empty($filters['scan_method'])) {
            $query->where('scan_method', $filters['scan_method']);
        }
        if (!empty($filters['search'])) {
            $term = $filters['search'];
            $query->where(function ($q) use ($term) {
                $q->whereHas('customer', function ($c) use ($term) {
                    $c->where('first_name', 'like', "%{$term}%")
                      ->orWhere('last_name', 'like', "%{$term}%")
                      ->orWhere('email', 'like', "%{$term}%")
                      ->orWhere('phone', 'like', "%{$term}%");
                })->orWhereHas('ticket', function ($t) use ($term) {
                    $t->where('qr_code', 'like', "%{$term}%");
                });
            });
        }

        $checkIns = $query->paginate($perPage)->withQueryString()
            ->through(function ($c) {
                return [
                    'id' => $c->id,
                    'ticket' => $c->ticket ? [
                        'uuid' => $c->ticket->uuid,
                        'qr_code' => $c->ticket->qr_code,
                        'ticket_type' => $c->ticket->ticket_type,
                        'status' => $c->ticket->status,
                    ] : null,
                    'event' => $c->event ? [
                        'uuid' => $c->event->uuid,
                        'title' => $c->event->title,
                    ] : null,
                    'customer' => $c->customer ? [
                        'uuid' => $c->customer->uuid,
                        'first_name' => $c->customer->first_name,
                        'last_name' => $c->customer->last_name,
                        'email' => $c->customer->email,
                        'phone' => $c->customer->phone,
                    ] : null,
                    'scanner' => $c->scanner ? $c->scanner->name : 'System',
                    'scan_method' => $c->scan_method,
                    'device_id' => $c->device_id,
                    'is_valid' => $c->is_valid,
                    'validation_message' => $c->validation_message,
                    'scanned_at' => $c->scanned_at,
                    'synced_at' => $c->synced_at,
                    'offline_queue_id' => $c->offline_queue_id,
                ];
            });

        $events = $this->checkInService->getEventsForDropdown();
        $stats = $this->checkInService->getDailyStats();

        if ($request->wantsJson()) {
            return response()->json($checkIns);
        }

        return Inertia::render('CheckIn/History', [
            'checkIns' => $checkIns,
            'filters' => $filters,
            'events' => $events,
            'stats' => $stats,
        ]);
    }

    public function eventAttendance(int $eventId)
    {
        $attendance = $this->checkInService->getEventAttendance($eventId);
        $history = $this->checkInService->getHistory(['event_id' => $eventId]);

        return response()->json([
            'attendance' => $attendance,
            'recent_scans' => $history->take(20)->values(),
        ]);
    }

    public function stats()
    {
        return response()->json($this->checkInService->getDailyStats());
    }

    public function batchSync(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.qr_code' => 'required|string',
            'items.*.event_id' => 'required|integer|exists:events,id',
            'items.*.scan_method' => 'nullable|string|in:qr,manual,nfc',
            'items.*.device_id' => 'nullable|string|max:100',
            'items.*.offline_queue_id' => 'required|string|max:100',
            'items.*.location' => 'nullable|array',
            'items.*.scanned_at' => 'nullable|date',
        ]);

        $results = $this->checkInService->processOfflineQueue($validated['items']);

        return response()->json([
            'synced' => count(array_filter($results, fn ($r) => $r['success'])),
            'failed' => count(array_filter($results, fn ($r) => !$r['success'])),
            'total' => count($results),
            'results' => $results,
        ]);
    }
}
