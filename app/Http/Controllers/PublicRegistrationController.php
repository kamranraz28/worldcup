<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\GuestRegistrationService;
use App\Services\TicketService;
use App\Support\PhoneNumber;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicRegistrationController extends Controller
{
    public function __construct(
        protected GuestRegistrationService $guests,
        protected TicketService $ticketService,
    ) {
    }

    public function create(string $uuid)
    {
        $event = Event::published()
            ->with('sessions')
            ->where('uuid', $uuid)
            ->firstOrFail();

        if (! $event->isBookingOpen()) {
            return back()->with('flash', ['error' => 'Booking for this event has closed.']);
        }

        return Inertia::render('Public/Register', [
            'event' => [
                'uuid' => $event->uuid,
                'title' => $event->title,
                'start_date' => $event->start_date,
                'end_date' => $event->end_date,
                'venue_name' => $event->venue_name,
                'venue_address' => $event->venue_address,
                'ticket_price' => $event->currentPrice(),
                'regular_price' => (float) ($event->ticket_price ?? 0),
                'early_booking_price' => $event->early_booking_price !== null ? (float) $event->early_booking_price : null,
                'early_booking_deadline' => $event->early_booking_deadline,
                'is_early_booking' => $event->isEarlyBookingActive(),
                'is_booking_open' => $event->isBookingOpen(),
                'registration_deadline' => $event->registration_deadline,
                'max_capacity' => $event->max_capacity,
                'event_type' => $event->event_type,
                'banner_image' => $event->banner_image,
                'sessions' => $event->sessions,
                'isFull' => $event->isFull(),
            ],
        ]);
    }

    public function store(Request $request, string $uuid)
    {
        $event = Event::published()->where('uuid', $uuid)->firstOrFail();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['required', 'string', 'max:20'],
            'event_session_id' => ['nullable', 'exists:event_sessions,id'],
            'voucher_code' => ['nullable', 'string', 'max:50'],
        ]);

        // Guests no longer pick a ticket tier; book the standard entry.
        $validated['ticket_type'] ??= 'general';

        if (! PhoneNumber::isValid($validated['phone'])) {
            return back()->withErrors(['phone' => 'Please enter a valid Bangladeshi mobile number.'])
                ->withInput();
        }

        try {
            $ticket = $this->guests->register($event, $validated);
        } catch (\RuntimeException $e) {
            return back()->with('flash', ['error' => $e->getMessage()])->withInput();
        }

        if ($ticket->status === 'confirmed') {
            $this->sendTicketEmail($ticket);

            return redirect()->route('tickets.public.success', ['uuid' => $ticket->uuid])
                ->with('flash', ['success' => 'Your ticket is ready!']);
        }

        return redirect()->route('payment.initiate', ['uuid' => $ticket->uuid])
            ->with('flash', ['success' => 'Redirecting to the secure payment gateway…']);
    }

    private function sendTicketEmail($ticket): void
    {
        try {
            $this->ticketService->sendEmail($ticket->fresh());
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send ticket email', [
                'ticket_uuid' => $ticket->uuid,
                'error' => $e->getMessage(),
            ]);
        }
    }
}