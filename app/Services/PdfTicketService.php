<?php

namespace App\Services;

use App\Models\Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\Fpdi;

class PdfTicketService
{
    public function generate(Ticket $ticket): string
    {
        $ticket->loadMissing([
            'event:id,title,start_date,end_date,venue_name,venue_address,event_type,banner_image,ticket_template_path,qr_x,qr_y,qr_size',
            'customer:id,first_name,last_name,email,phone,nationality',
            'session:id,title,start_time,end_time,location',
        ]);

        if ($ticket->event->ticket_template_path) {
            try {
                return $this->generateFromTemplate($ticket);
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return $this->generateDefault($ticket);
    }

    public function generateDefault(Ticket $ticket): string
    {
        $ticket->loadMissing([
            'event:id,title,start_date,end_date,venue_name,venue_address,event_type,banner_image',
            'customer:id,first_name,last_name,email,phone,nationality',
            'session:id,title,start_time,end_time,location',
        ]);

        $qrTable = app(QrCodeService::class)->generateHtmlTable($ticket);

        $pdf = Pdf::loadView('pdf.ticket', [
            'ticket' => $ticket,
            'qrTable' => $qrTable,
        ]);

        $pdf->setPaper('a4', 'portrait');
        $pdf->setOptions([
            'defaultFont' => 'Inter',
            'isRemoteEnabled' => true,
            'isHtml5ParserEnabled' => true,
        ]);

        return $pdf->output();
    }

    public function generateFromTemplate(Ticket $ticket): string
    {
        $event = $ticket->event;
        $templatePath = storage_path('app/public/' . $event->ticket_template_path);

        if (!is_file($templatePath)) {
            throw new \RuntimeException('Ticket template file not found.');
        }

        $pdf = new Fpdi('P', 'mm', 'A4');
        $pageCount = $pdf->setSourceFile($templatePath);
        $templateId = $pdf->importPage(1);
        $size = $pdf->getTemplateSize($templateId);

        $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
        $pdf->useTemplate($templateId, 0, 0, $size['width'], $size['height']);

        // Stamp QR code into the reserved area
        $sizeMm = (float) ($event->qr_size ?: 40);

        $pageWidthMm = $size['orientation'] === 'P' ? $size['width'] : $size['height'];
        $pageHeightMm = $size['orientation'] === 'P' ? $size['height'] : $size['width'];

        // Default placement: top-right if coordinates not provided
        $x = $event->qr_x !== null ? (float) $event->qr_x : max(5, min($pageWidthMm - $sizeMm - 5, 25));
        $y = $event->qr_y !== null ? (float) $event->qr_y : max(5, min($pageHeightMm - $sizeMm - 5, 25));

        $pngBinary = app(QrCodeService::class)->generatePngBinary($ticket);
        $tmpFile = tempnam(sys_get_temp_dir(), 'qr') . '.png';
        file_put_contents($tmpFile, $pngBinary);

        $pdf->Image($tmpFile, $x, $y, $sizeMm, $sizeMm, 'PNG');

        @unlink($tmpFile);

        return $pdf->Output('S');
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
