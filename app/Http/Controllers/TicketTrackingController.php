<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Support\PhoneNumber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

/**
 * Public ticket tracking — find every ticket bought with a phone number and
 * download any (or all) of them. Lookups are throttled and downloads are
 * issued as short-lived signed URLs so a bare ticket id is never enough.
 */
class TicketTrackingController extends Controller
{
    public function create()
    {
        return Inertia::render('Public/TrackTickets');
    }

    public function search(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'max:20'],
        ]);

        if (! PhoneNumber::isValidLookup($validated['phone'])) {
            return back()->withErrors(['phone' => 'Please enter a valid phone number.'])
                ->withInput();
        }

        $normalized = PhoneNumber::normalize($validated['phone']);

        $tickets = Ticket::query()
            ->whereIn('status', ['confirmed', 'redeemed'])
            ->whereHas('customer', fn ($q) => $q->where('phone_normalized', $normalized))
            ->with([
                'event:id,uuid,title,start_date,end_date,venue_name,venue_address,event_type,banner_image',
                'session:id,title,location,start_time,end_time',
            ])
            ->latest('registered_at')
            ->get()
            ->map(function (Ticket $ticket) {
                return [
                    'uuid' => $ticket->uuid,
                    'ticket_type' => $ticket->ticket_type,
                    'status' => $ticket->status,
                    'registered_at' => $ticket->registered_at,
                    'checked_in_at' => $ticket->checked_in_at,
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
                    'session' => $ticket->session ? [
                        'title' => $ticket->session->title,
                        'location' => $ticket->session->location,
                        'start_time' => $ticket->session->start_time,
                    ] : null,
                    'download_url' => URL::temporarySignedRoute('tickets.public.download', now()->addMinutes(30), [
                        'uuid' => $ticket->uuid,
                    ]),
                ];
            });

        $downloadAllUrl = $tickets->count() > 1
            ? URL::temporarySignedRoute('tickets.public.download-all', now()->addMinutes(30), [
                'uuids' => $tickets->pluck('uuid')->implode(','),
            ])
            : null;

        return Inertia::render('Public/TrackTickets', [
            'searchedPhone' => $validated['phone'],
            'tickets' => $tickets->values(),
            'downloadAllUrl' => $downloadAllUrl,
        ]);
    }
}