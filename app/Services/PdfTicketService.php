<?php

namespace App\Services;

use App\Models\Ticket;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfTicketService
{
    public function generate(Ticket $ticket): string
    {
        $ticket->loadMissing([
            'event:id,title,start_date,end_date,venue_name,venue_address,event_type,banner_image',
            'customer:id,first_name,last_name,email,phone,nationality',
            'session:id,title,start_time,end_time,location',
        ]);

        $qrSvg = app(QrCodeService::class)->generate($ticket);

        $pdf = Pdf::loadView('pdf.ticket', [
            'ticket' => $ticket,
            'qrSvg' => $qrSvg,
        ]);

        $pdf->setPaper('a4', 'portrait');
        $pdf->setOptions([
            'defaultFont' => 'Inter',
            'isRemoteEnabled' => true,
            'isHtml5ParserEnabled' => true,
        ]);

        return $pdf->output();
    }

    public function saveToFile(Ticket $ticket): string
    {
        $pdfContent = $this->generate($ticket);
        $filename = 'tickets/' . $ticket->uuid . '.pdf';
        $path = storage_path('app/public/' . $filename);

        $dir = dirname($path);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents($path, $pdfContent);

        app(QrCodeService::class)->saveToFile($ticket);

        return $filename;
    }

    public function getFilename(Ticket $ticket): string
    {
        $eventName = str_replace(' ', '-', $ticket->event->title ?? 'Event');
        $customerName = str_replace(' ', '-', ($ticket->customer->first_name ?? '') . '-' . ($ticket->customer->last_name ?? ''));
        return "Ticket-{$eventName}-{$customerName}.pdf";
    }
}
