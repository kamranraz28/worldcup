<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\TicketAction;
use App\Notifications\TicketConfirmation;
use App\Notifications\TicketReceipt;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

class TicketService
{
    private $qrCodeService;
    private $pdfTicketService;

    public function __construct(QrCodeService $qrCodeService, PdfTicketService $pdfTicketService)
    {
        $this->qrCodeService = $qrCodeService;
        $this->pdfTicketService = $pdfTicketService;
    }

    public function find(string $uuid): ?Ticket
    {
        return Ticket::with([
            'event:id,title,start_date,end_date,venue_name,venue_address,event_type,banner_image',
            'customer',
            'session',
            'approver:id,name',
            'rejecter:id,name',
        ])->where('uuid', $uuid)->first();
    }

    public function getHistory(Ticket $ticket): Collection
    {
        return TicketAction::where('ticket_id', $ticket->id)
            ->with(['actor:id,name'])
            ->latest()
            ->get();
    }

    public function generateQrCode(Ticket $ticket): string
    {
        $path = $this->qrCodeService->saveToFile($ticket);

        $ticket->update(['qr_code_path' => $path]);

        return $path;
    }

    public function getQrCodeSvg(Ticket $ticket): string
    {
        return $this->qrCodeService->generate($ticket);
    }

    public function generatePdf(Ticket $ticket): string
    {
        return $this->pdfTicketService->generate($ticket);
    }

    public function generateAndSavePdf(Ticket $ticket): string
    {
        $path = $this->pdfTicketService->saveToFile($ticket);
        $ticket->update(['qr_code_path' => $this->qrCodeService->saveToFile($ticket)]);
        return $path;
    }

    public function downloadPdf(Ticket $ticket)
    {
        $pdfContent = $this->pdfTicketService->generate($ticket);
        $filename = $this->pdfTicketService->getFilename($ticket);

        return response()->streamDownload(function () use ($pdfContent) {
            echo $pdfContent;
        }, $filename, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function sendEmail(Ticket $ticket): void
    {
        $customer = $ticket->customer;
        if (!$customer || !$customer->email) {
            throw new \RuntimeException('Customer email not available.');
        }

        $pdfPath = $this->generateAndSavePdf($ticket);

        Notification::route('mail', $customer->email)
            ->notify(new TicketConfirmation($ticket, $pdfPath));
    }

    public function sendSms(Ticket $ticket): void
    {
        $customer = $ticket->customer;
        if (!$customer || !$customer->phone) {
            throw new \RuntimeException('Customer phone not available.');
        }

        $message = "Your ticket for {$ticket->event->title} is confirmed! ";
        $message .= "Ticket: {$ticket->ticket_type} | ";
        $message .= "Date: " . $ticket->event->start_date->format('M d, Y') . " | ";
        $message .= "QR: " . url('/tickets/' . $ticket->uuid);

        Notification::route('nexmo', $customer->phone)
            ->notify(new \App\Notifications\TicketSms($message));
    }

    public function getTicketPdfPath(Ticket $ticket): ?string
    {
        $path = 'tickets/' . $ticket->uuid . '.pdf';
        if (Storage::disk('public')->exists($path)) {
            return $path;
        }
        return null;
    }

    private function logAction(Ticket $ticket, string $action, $notes = null): void
    {
        TicketAction::create([
            'ticket_id' => $ticket->id,
            'event_id' => $ticket->event_id,
            'customer_id' => $ticket->customer_id,
            'action' => $action,
            'actor_id' => auth()->id(),
            'notes' => $notes,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
