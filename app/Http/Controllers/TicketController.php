<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Services\PdfTicketService;
use App\Services\QrCodeService;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    private $ticketService;
    private $pdfTicketService;
    private $qrCodeService;

    public function __construct(
        TicketService $ticketService,
        PdfTicketService $pdfTicketService,
        QrCodeService $qrCodeService
    ) {
        $this->ticketService = $ticketService;
        $this->pdfTicketService = $pdfTicketService;
        $this->qrCodeService = $qrCodeService;
    }

    public function index(Request $request)
    {
        $query = Ticket::with([
            'event:id,title,start_date,end_date,venue_name,event_type',
            'customer:id,first_name,last_name,email',
            'session:id,title',
        ]);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('ticket_type', 'like', "%{$search}%")
                  ->orWhere('qr_code', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($type = $request->input('type')) {
            $query->where('ticket_type', $type);
        }

        if ($eventId = $request->input('event_id')) {
            $query->where('event_id', $eventId);
        }

        $sortField = $request->input('sort', 'created_at');
        $sortDir = $request->input('dir', 'desc');
        $allowedSorts = ['created_at', 'ticket_type', 'status', 'price'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $tickets = $query->paginate($request->input('per_page', 15))
            ->withQueryString()
            ->through(function ($ticket) {
                return [
                    'uuid' => $ticket->uuid,
                    'ticket_type' => $ticket->ticket_type,
                    'price' => $ticket->price,
                    'currency' => $ticket->currency,
                    'status' => $ticket->status,
                    'qr_code' => $ticket->qr_code,
                    'qr_code_path' => $ticket->qr_code_path,
                    'registered_at' => $ticket->registered_at,
                    'event' => $ticket->event ? [
                        'uuid' => $ticket->event->uuid,
                        'title' => $ticket->event->title,
                        'start_date' => $ticket->event->start_date,
                        'venue_name' => $ticket->event->venue_name,
                    ] : null,
                    'customer' => $ticket->customer ? [
                        'uuid' => $ticket->customer->uuid,
                        'first_name' => $ticket->customer->first_name,
                        'last_name' => $ticket->customer->last_name,
                        'email' => $ticket->customer->email,
                    ] : null,
                    'session' => $ticket->session ? [
                        'uuid' => $ticket->session->uuid,
                        'title' => $ticket->session->title,
                    ] : null,
                ];
            });

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['search', 'status', 'type', 'event_id', 'sort', 'dir']),
            'stats' => $this->getStats(),
        ]);
    }

    public function show(string $uuid)
    {
        $ticket = $this->ticketService->find($uuid);

        if (!$ticket) {
            abort(404, 'Ticket not found.');
        }

        $history = $this->ticketService->getHistory($ticket);
        $qrSvg = $this->qrCodeService->generate($ticket);
        $pdfExists = $this->ticketService->getTicketPdfPath($ticket) !== null;

        $ticketData = [
            'uuid' => $ticket->uuid,
            'ticket_type' => $ticket->ticket_type,
            'price' => $ticket->price,
            'currency' => $ticket->currency,
            'status' => $ticket->status,
            'qr_code' => $ticket->qr_code,
            'checked_in_at' => $ticket->checked_in_at,
            'registered_at' => $ticket->registered_at,
            'approved_at' => $ticket->approved_at,
            'rejected_at' => $ticket->rejected_at,
            'rejection_reason' => $ticket->rejection_reason,
            'reserved_until' => $ticket->reserved_until,
            'metadata' => $ticket->metadata,
            'event' => $ticket->event ? [
                'uuid' => $ticket->event->uuid,
                'title' => $ticket->event->title,
                'start_date' => $ticket->event->start_date,
                'end_date' => $ticket->event->end_date,
                'venue_name' => $ticket->event->venue_name,
                'venue_address' => $ticket->event->venue_address,
                'event_type' => $ticket->event->event_type,
                'banner_image' => $ticket->event->banner_image,
            ] : null,
            'customer' => $ticket->customer ? [
                'uuid' => $ticket->customer->uuid,
                'first_name' => $ticket->customer->first_name,
                'last_name' => $ticket->customer->last_name,
                'email' => $ticket->customer->email,
                'phone' => $ticket->customer->phone,
                'nationality' => $ticket->customer->nationality,
            ] : null,
            'session' => $ticket->session ? [
                'uuid' => $ticket->session->uuid,
                'title' => $ticket->session->title,
                'start_time' => $ticket->session->start_time,
                'end_time' => $ticket->session->end_time,
                'location' => $ticket->session->location,
            ] : null,
            'approver' => $ticket->approver ? [
                'id' => $ticket->approver->id,
                'name' => $ticket->approver->name,
            ] : null,
            'rejecter' => $ticket->rejecter ? [
                'id' => $ticket->rejecter->id,
                'name' => $ticket->rejecter->name,
            ] : null,
        ];

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticketData,
            'history' => $history->map(function ($action) {
                return [
                    'id' => $action->id,
                    'action' => $action->action,
                    'notes' => $action->notes,
                    'created_at' => $action->created_at,
                    'actor' => $action->actor ? $action->actor->name : 'System',
                ];
            }),
            'qrSvg' => $qrSvg,
            'pdfExists' => $pdfExists,
        ]);
    }

    public function myTickets(Request $request)
    {
        $user = $request->user();
        $customerId = $user->customer?->id;
        $customerIds = $customerId ? [$customerId] : [];

        $query = Ticket::with([
            'event:id,title,start_date,end_date,venue_name,event_type,banner_image',
            'customer:id,first_name,last_name,email,phone',
            'session:id,title,location',
        ])->where(function ($q) use ($user, $customerIds) {
            $q->where('user_id', $user->id);
            if (!empty($customerIds)) {
                $q->orWhereIn('customer_id', $customerIds);
            }
        })->latest('registered_at');

        $tickets = $query->paginate(15)->through(function ($ticket) {
            return [
                'uuid' => $ticket->uuid,
                'ticket_type' => $ticket->ticket_type,
                'price' => $ticket->price,
                'currency' => $ticket->currency,
                'status' => $ticket->status,
                'qr_code' => $ticket->qr_code,
                'checked_in_at' => $ticket->checked_in_at,
                'registered_at' => $ticket->registered_at,
                'approved_at' => $ticket->approved_at,
                'event' => $ticket->event ? [
                    'uuid' => $ticket->event->uuid,
                    'title' => $ticket->event->title,
                    'start_date' => $ticket->event->start_date,
                    'end_date' => $ticket->event->end_date,
                    'venue_name' => $ticket->event->venue_name,
                    'event_type' => $ticket->event->event_type,
                    'banner_image' => $ticket->event->banner_image,
                ] : null,
                'session' => $ticket->session ? [
                    'title' => $ticket->session->title,
                    'location' => $ticket->session->location,
                ] : null,
            ];
        });

        $baseQuery = Ticket::where(function ($q) use ($user, $customerIds) {
            $q->where('user_id', $user->id);
            if (!empty($customerIds)) {
                $q->orWhereIn('customer_id', $customerIds);
            }
        });

        return Inertia::render('Tickets/MyTickets', [
            'tickets' => $tickets,
            'stats' => [
                'total' => (clone $baseQuery)->count(),
                'confirmed' => (clone $baseQuery)->where('status', 'confirmed')->count(),
                'redeemed' => (clone $baseQuery)->where('status', 'redeemed')->count(),
            ],
        ]);
    }

    public function downloadPdf(string $uuid)
    {
        $ticket = Ticket::where('uuid', $uuid)->firstOrFail();

        return $this->ticketService->downloadPdf($ticket);
    }

    public function printTicket(string $uuid)
    {
        $ticket = Ticket::with([
            'event',
            'customer',
            'session',
        ])->where('uuid', $uuid)->firstOrFail();

        $qrSvg = $this->qrCodeService->generate($ticket);

        return Inertia::render('Tickets/PrintTicket', [
            'ticket' => [
                'uuid' => $ticket->uuid,
                'ticket_type' => $ticket->ticket_type,
                'price' => $ticket->price,
                'currency' => $ticket->currency,
                'status' => $ticket->status,
                'qr_code' => $ticket->qr_code,
                'registered_at' => $ticket->registered_at,
                'approved_at' => $ticket->approved_at,
                'event' => $ticket->event ? [
                    'title' => $ticket->event->title,
                    'start_date' => $ticket->event->start_date,
                    'end_date' => $ticket->event->end_date,
                    'venue_name' => $ticket->event->venue_name,
                    'venue_address' => $ticket->event->venue_address,
                ] : null,
                'customer' => $ticket->customer ? [
                    'first_name' => $ticket->customer->first_name,
                    'last_name' => $ticket->customer->last_name,
                    'email' => $ticket->customer->email,
                    'phone' => $ticket->customer->phone,
                ] : null,
                'session' => $ticket->session ? [
                    'title' => $ticket->session->title,
                    'location' => $ticket->session->location,
                ] : null,
            ],
            'qrSvg' => $qrSvg,
        ]);
    }

    public function sendEmail(string $uuid)
    {
        $ticket = Ticket::with(['event', 'customer'])->where('uuid', $uuid)->firstOrFail();

        try {
            $this->ticketService->sendEmail($ticket);

            actionLog('ticket_email_sent', "Ticket {$ticket->uuid} email sent to {$ticket->customer->email}");

            return redirect()->back()->with('success', 'Ticket sent via email successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to send email: ' . $e->getMessage());
        }
    }

    public function sendSms(string $uuid)
    {
        $ticket = Ticket::with(['event', 'customer'])->where('uuid', $uuid)->firstOrFail();

        try {
            $this->ticketService->sendSms($ticket);

            actionLog('ticket_sms_sent', "Ticket {$ticket->uuid} SMS sent to {$ticket->customer->phone}");

            return redirect()->back()->with('success', 'Ticket sent via SMS successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to send SMS: ' . $e->getMessage());
        }
    }

    public function history(string $uuid)
    {
        $ticket = Ticket::where('uuid', $uuid)->firstOrFail();
        $history = $this->ticketService->getHistory($ticket);

        return response()->json([
            'data' => $history->map(function ($action) {
                return [
                    'id' => $action->id,
                    'action' => $action->action,
                    'notes' => $action->notes,
                    'ip_address' => $action->ip_address,
                    'created_at' => $action->created_at,
                    'actor' => $action->actor ? $action->actor->name : 'System',
                ];
            }),
        ]);
    }

    private function getStats(): array
    {
        return [
            'total' => Ticket::count(),
            'confirmed' => Ticket::where('status', 'confirmed')->count(),
            'pending_approval' => Ticket::where('status', 'pending_approval')->count(),
            'reserved' => Ticket::where('status', 'reserved')->count(),
            'redeemed' => Ticket::where('status', 'redeemed')->count(),
            'cancelled' => Ticket::where('status', 'cancelled')->count(),
            'rejected' => Ticket::where('status', 'rejected')->count(),
            'total_revenue' => Ticket::whereIn('status', ['confirmed', 'redeemed'])->sum('price'),
        ];
    }
}
