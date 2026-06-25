<?php

namespace App\Services;

use App\Models\Ticket;
use Illuminate\Support\Collection;

class RegistrationExportService
{
    public function toCsv(array $filters = []): string
    {
        $tickets = $this->getExportData($filters);

        $output = fopen('php://temp', 'r+');

        fputcsv($output, [
            'UUID', 'Event', 'Customer Name', 'Email', 'Phone', 'Nationality',
            'Ticket Type', 'Price', 'Currency', 'Status', 'Registered At',
            'Approved At', 'Checked In At', 'QR Code',
        ]);

        foreach ($tickets as $ticket) {
            fputcsv($output, [
                $ticket->uuid,
                $ticket->event->title ?? 'N/A',
                $ticket->customer ? $ticket->customer->first_name . ' ' . $ticket->customer->last_name : 'N/A',
                $ticket->customer->email ?? 'N/A',
                $ticket->customer->phone ?? 'N/A',
                $ticket->customer->nationality ?? 'N/A',
                $ticket->ticket_type,
                $ticket->price,
                $ticket->currency,
                $ticket->status,
                $ticket->registered_at ? $ticket->registered_at->toIso8601String() : '',
                $ticket->approved_at ? $ticket->approved_at->toIso8601String() : '',
                $ticket->checked_in_at ? $ticket->checked_in_at->toIso8601String() : '',
                $ticket->qr_code,
            ]);
        }

        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);

        return $csv;
    }

    public function toArray(array $filters = []): array
    {
        $tickets = $this->getExportData($filters);

        return $tickets->map(function ($ticket) {
            return [
                'uuid' => $ticket->uuid,
                'event' => $ticket->event->title ?? 'N/A',
                'customer_name' => $ticket->customer ? $ticket->customer->first_name . ' ' . $ticket->customer->last_name : 'N/A',
                'email' => $ticket->customer->email ?? 'N/A',
                'phone' => $ticket->customer->phone ?? 'N/A',
                'nationality' => $ticket->customer->nationality ?? 'N/A',
                'ticket_type' => $ticket->ticket_type,
                'price' => $ticket->price,
                'currency' => $ticket->currency,
                'status' => $ticket->status,
                'registered_at' => $ticket->registered_at ? $ticket->registered_at->toIso8601String() : null,
                'approved_at' => $ticket->approved_at ? $ticket->approved_at->toIso8601String() : null,
                'checked_in_at' => $ticket->checked_in_at ? $ticket->checked_in_at->toIso8601String() : null,
            ];
        })->toArray();
    }

    private function getExportData(array $filters): Collection
    {
        $query = Ticket::with(['event:id,title', 'customer:id,first_name,last_name,email,phone,nationality']);

        if (!empty($filters['event_id'])) {
            $query->where('event_id', (int) $filters['event_id']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        return $query->latest()->get();
    }
}
