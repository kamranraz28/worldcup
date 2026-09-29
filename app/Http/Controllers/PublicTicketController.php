<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Services\QrCodeService;
use App\Services\TicketService;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

/**
 * Public, account-free ticket views: payment success / failure pages and
 * signed download links issued from those pages or the tracking search.
 */
class PublicTicketController extends Controller
{
    public function __construct(
        protected TicketService $ticketService,
        protected QrCodeService $qrCodeService,
    ) {
    }

    public function success(string $uuid)
    {
        $ticket = Ticket::with([
            'event:id,title,start_date,end_date,venue_name,venue_address,event_type,banner_image',
            'customer:id,first_name,last_name,email,phone',
            'session:id,title,location,start_time,end_time',
        ])->where('uuid', $uuid)->firstOrFail();

        if ($ticket->status !== 'confirmed') {
            abort(404, 'Ticket not found.');
        }

        $data = $this->ticketPayload($ticket);

        return Inertia::render('Public/TicketSuccess', [
            'ticket' => $data,
            'paid' => data_get($ticket->metadata, 'payment.verified', false) === true,
            'downloadUrl' => URL::temporarySignedRoute('tickets.public.download', now()->addHours(24), [
                'uuid' => $ticket->uuid,
            ]),
            'qrSvg' => $this->qrCodeService->generate($ticket),
        ]);
    }

    public function failed()
    {
        return Inertia::render('Public/PaymentFailed');
    }

    public function download(string $uuid)
    {
        $ticket = Ticket::where('uuid', $uuid)->where('status', 'confirmed')->firstOrFail();

        return $this->ticketService->downloadPdf($ticket);
    }

    public function downloadAll()
    {
        $uuids = collect(explode(',', request()->query('uuids', '')))
            ->filter(fn ($u) => preg_match('/^[a-f0-9-]{36}$/i', trim($u)) === 1)
            ->map(fn ($u) => trim($u));

        if ($uuids->isEmpty()) {
            abort(404);
        }

        $tickets = Ticket::with(['event', 'customer'])->whereIn('uuid', $uuids)->get();

        if ($tickets->isEmpty()) {
            abort(404);
        }

        $content = app(\App\Services\PdfTicketService::class)->generateCombined($tickets);

        return response()->streamDownload(function () use ($content) {
            echo $content;
        }, 'tickets-' . now()->format('Y-m-d') . '.pdf', [
            'Content-Type' => 'application/pdf',
        ]);
    }

    protected function ticketPayload(Ticket $ticket): array
    {
        return [
            'uuid' => $ticket->uuid,
            'ticket_type' => $ticket->ticket_type,
            'price' => $ticket->price,
            'discount_amount' => $ticket->discount_amount,
            'currency' => $ticket->currency,
            'status' => $ticket->status,
            'qr_code' => $ticket->qr_code,
            'registered_at' => $ticket->registered_at,
            'approved_at' => $ticket->approved_at,
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
                'name' => $ticket->customer->full_name,
                'email' => $ticket->customer->email,
                'phone' => $ticket->customer->phone,
            ] : null,
            'session' => $ticket->session ? [
                'title' => $ticket->session->title,
                'location' => $ticket->session->location,
                'start_time' => $ticket->session->start_time,
                'end_time' => $ticket->session->end_time,
            ] : null,
        ];
    }
}