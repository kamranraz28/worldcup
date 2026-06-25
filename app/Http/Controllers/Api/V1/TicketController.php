<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Event;
use App\Models\Ticket;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class TicketController extends Controller
{
    private $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    public function index(Request $request)
    {
        $query = Ticket::with(['event:id,title,start_date', 'customer:id,first_name,last_name']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->filled('customer_uuid')) {
            $query->whereHas('customer', function ($q) use ($request) {
                $q->where('uuid', $request->customer_uuid);
            });
        }

        $perPage = min((int) $request->input('per_page', 15), 100);
        $tickets = $query->paginate($perPage);

        return response()->json([
            'data' => $tickets->items(),
            'meta' => [
                'current_page' => $tickets->currentPage(),
                'last_page' => $tickets->lastPage(),
                'per_page' => $tickets->perPage(),
                'total' => $tickets->total(),
            ],
        ]);
    }

    public function show(string $uuid)
    {
        $ticket = Ticket::with([
            'event',
            'customer',
            'session',
            'checkIn',
        ])->where('uuid', $uuid)->first();

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found.'], 404);
        }

        return response()->json(['data' => $ticket]);
    }

    public function download(string $uuid)
    {
        $ticket = Ticket::where('uuid', $uuid)->firstOrFail();

        return $this->ticketService->downloadPdf($ticket);
    }

    public function validateTicket(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
            'event_uuid' => 'required|string|exists:events,uuid',
        ]);

        $event = Event::where('uuid', $request->event_uuid)->first();

        $ticket = Ticket::where('qr_code', $request->qr_code)
            ->where('event_id', $event->id)
            ->with(['customer:id,first_name,last_name,email', 'event:id,title'])
            ->first();

        if (!$ticket) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid ticket or ticket not found for this event.',
            ], 404);
        }

        if ($ticket->status !== 'confirmed' && $ticket->status !== 'redeemed') {
            return response()->json([
                'valid' => false,
                'message' => 'Ticket status is: ' . $ticket->status,
                'ticket' => $ticket,
            ], 422);
        }

        return response()->json([
            'valid' => true,
            'message' => 'Ticket is valid.',
            'ticket' => [
                'uuid' => $ticket->uuid,
                'ticket_type' => $ticket->ticket_type,
                'status' => $ticket->status,
                'customer_name' => $ticket->customer->first_name . ' ' . $ticket->customer->last_name,
                'customer_email' => $ticket->customer->email,
                'event_title' => $ticket->event->title,
            ],
        ]);
    }
}
