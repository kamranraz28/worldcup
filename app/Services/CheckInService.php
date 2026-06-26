<?php

namespace App\Services;

use App\Models\CheckIn;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketAction;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckInService
{
    public function scan(string $qrCode, int $eventId): array
    {
        $qrCode = trim($qrCode);

        Log::channel('stack')->info('SCAN_REQUEST', [
            'qr_code_raw' => $qrCode,
            'qr_code_bytes' => unpack('H*', $qrCode)[1] ?? '',
            'qr_code_len' => strlen($qrCode),
            'event_id' => $eventId,
        ]);

        $ticket = Ticket::where('qr_code', $qrCode)
            ->where('event_id', $eventId)
            ->with(['customer'])
            ->first();

        if (!$ticket) {
            Log::channel('stack')->warning('SCAN_NOT_FOUND_EXACT', [
                'qr_code' => $qrCode,
                'event_id' => $eventId,
            ]);

            // try case-insensitive fallback (some scanners return uppercase)
            $ticket = Ticket::whereRaw('LOWER(qr_code) = ?', [strtolower($qrCode)])
                ->where('event_id', $eventId)
                ->with(['customer'])
                ->first();

            if ($ticket) {
                Log::channel('stack')->info('SCAN_FOUND_CASE_INSENSITIVE', [
                    'qr_code' => $qrCode,
                    'db_qr_code' => $ticket->qr_code,
                ]);
            }
        }

        if (!$ticket) {
            Log::channel('stack')->error('SCAN_FAILED', [
                'qr_code' => $qrCode,
                'event_id' => $eventId,
            ]);

            return [
                'success' => false,
                'message' => 'Ticket not found for this event.',
                'code' => 'TICKET_NOT_FOUND',
            ];
        }

        Log::channel('stack')->info('SCAN_TICKET_FOUND', [
            'ticket_uuid' => $ticket->uuid,
            'ticket_qr_code' => $ticket->qr_code,
            'status' => $ticket->status,
        ]);

        if ($ticket->status === 'redeemed') {
            Log::channel('stack')->warning('SCAN_ALREADY_REDEEMED', ['ticket_uuid' => $ticket->uuid]);
            return [
                'success' => false,
                'message' => 'This ticket has already been redeemed.',
                'code' => 'ALREADY_REDEEMED',
                'data' => ['ticket' => $this->formatTicketData($ticket)],
            ];
        }

        if ($ticket->status !== 'confirmed') {
            Log::channel('stack')->warning('SCAN_INVALID_STATUS', ['ticket_uuid' => $ticket->uuid, 'status' => $ticket->status]);
            return [
                'success' => false,
                'message' => 'Ticket status is "' . $ticket->status . '". Cannot check in.',
                'code' => 'INVALID_STATUS',
                'data' => ['ticket' => $this->formatTicketData($ticket)],
            ];
        }

        try {
            DB::beginTransaction();
            $now = now();

            $checkIn = CheckIn::create([
                'ticket_id' => $ticket->id,
                'event_id' => $eventId,
                'customer_id' => $ticket->customer_id,
                'scanned_by' => auth()->id(),
                'scan_method' => 'qr',
                'is_valid' => true,
                'scanned_at' => $now,
            ]);

            $ticket->status = 'redeemed';
            $ticket->checked_in_at = $now;
            $ticket->checked_in_by = auth()->id();
            $ticket->saveQuietly();

            TicketAction::create([
                'ticket_id' => $ticket->id,
                'event_id' => $eventId,
                'customer_id' => $ticket->customer_id,
                'action' => 'checked_in',
                'actor_id' => auth()->id(),
                'notes' => 'QR check-in via scanner',
            ]);

            DB::commit();

            Log::channel('stack')->info('SCAN_SUCCESS', ['ticket_uuid' => $ticket->uuid]);

            return [
                'success' => true,
                'message' => 'Check-in successful! Welcome ' . ($ticket->customer->first_name ?? '') . '.',
                'code' => 'CHECKED_IN',
                'data' => ['ticket' => $this->formatTicketData($ticket)],
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            Log::channel('stack')->error('SCAN_EXCEPTION', ['error' => $e->getMessage()]);

            return [
                'success' => false,
                'message' => 'Check-in failed: ' . $e->getMessage(),
                'code' => 'ERROR',
            ];
        }
    }

    public function validateQrCode(string $qrCode, int $eventId): array
    {
        $ticket = Ticket::where('qr_code', $qrCode)
            ->where('event_id', $eventId)
            ->with(['customer:id,first_name,last_name,email,phone', 'checkIn'])
            ->first();

        if (!$ticket) {
            return [
                'valid' => false,
                'message' => 'Ticket not found.',
                'code' => 'NOT_FOUND',
            ];
        }

        return [
            'valid' => true,
            'code' => 'VALID',
            'message' => 'Ticket is valid.',
            'data' => [
                'ticket' => $this->formatTicketData($ticket),
                'has_checkin' => $ticket->checkIn !== null,
                'can_checkin' => $ticket->canBeCheckedIn(),
            ],
        ];
    }

    public function processOfflineQueue(array $queueItems): array
    {
        $results = [];
        foreach ($queueItems as $item) {
            $result = $this->scan($item['qr_code'], $item['event_id'], [
                'scan_method' => $item['scan_method'] ?? 'qr',
                'device_id' => $item['device_id'] ?? null,
                'offline_queue_id' => $item['offline_queue_id'] ?? null,
                'location' => $item['location'] ?? null,
            ]);
            $results[] = array_merge($result, ['offline_queue_id' => $item['offline_queue_id'] ?? null]);
        }
        return $results;
    }

    public function getEventAttendance(int $eventId, array $filters = []): array
    {
        $query = Event::where('id', $eventId)->withCount([
            'tickets as total_tickets' => function ($q) {
                $q->whereIn('status', ['confirmed', 'redeemed']);
            },
            'tickets as confirmed_tickets' => function ($q) {
                $q->where('status', 'confirmed');
            },
            'tickets as redeemed_tickets' => function ($q) {
                $q->where('status', 'redeemed');
            },
            'checkIns as valid_checkins' => function ($q) {
                $q->where('is_valid', true);
            },
            'checkIns as duplicate_checkins' => function ($q) {
                $q->where('is_valid', false);
            },
        ]);

        $event = $query->first();

        if (!$event) {
            return [];
        }

        $attendanceRate = $event->confirmed_tickets > 0
            ? round(($event->valid_checkins / $event->confirmed_tickets) * 100, 1)
            : 0;

        return [
            'event_id' => $event->id,
            'event_uuid' => $event->uuid,
            'event_title' => $event->title,
            'total_tickets' => (int) $event->total_tickets,
            'confirmed_tickets' => (int) $event->confirmed_tickets,
            'redeemed_tickets' => (int) $event->redeemed_tickets,
            'valid_checkins' => (int) $event->valid_checkins,
            'duplicate_checkins' => (int) $event->duplicate_checkins,
            'attendance_rate' => $attendanceRate,
            'remaining' => max(0, $event->confirmed_tickets - $event->valid_checkins),
        ];
    }

    public function getHistory(array $filters = []): Collection
    {
        $query = CheckIn::with([
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
            $query->where('scanned_at', '>=', Carbon::parse($filters['date_from'])->startOfDay());
        }

        if (!empty($filters['date_to'])) {
            $query->where('scanned_at', '<=', Carbon::parse($filters['date_to'])->endOfDay());
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

        return $query->get()->map(function ($checkIn) {
            return [
                'id' => $checkIn->id,
                'ticket' => $checkIn->ticket ? [
                    'uuid' => $checkIn->ticket->uuid,
                    'qr_code' => $checkIn->ticket->qr_code,
                    'ticket_type' => $checkIn->ticket->ticket_type,
                    'status' => $checkIn->ticket->status,
                ] : null,
                'event' => $checkIn->event ? [
                    'uuid' => $checkIn->event->uuid,
                    'title' => $checkIn->event->title,
                ] : null,
                'customer' => $checkIn->customer ? [
                    'uuid' => $checkIn->customer->uuid,
                    'first_name' => $checkIn->customer->first_name,
                    'last_name' => $checkIn->customer->last_name,
                    'email' => $checkIn->customer->email,
                    'phone' => $checkIn->customer->phone,
                ] : null,
                'scanner' => $checkIn->scanner ? $checkIn->scanner->name : 'System',
                'scan_method' => $checkIn->scan_method,
                'device_id' => $checkIn->device_id,
                'is_valid' => $checkIn->is_valid,
                'validation_message' => $checkIn->validation_message,
                'scanned_at' => $checkIn->scanned_at,
                'synced_at' => $checkIn->synced_at,
                'offline_queue_id' => $checkIn->offline_queue_id,
            ];
        });
    }

    public function getDailyStats(): array
    {
        $today = now()->startOfDay();
        $yesterday = now()->subDay()->startOfDay();

        $todayCount = CheckIn::where('scanned_at', '>=', $today)->count();
        $yesterdayCount = CheckIn::whereBetween('scanned_at', [$yesterday, $today])->count();

        return [
            'today' => $todayCount,
            'yesterday' => $yesterdayCount,
            'change' => $yesterdayCount > 0
                ? round((($todayCount - $yesterdayCount) / $yesterdayCount) * 100, 1)
                : ($todayCount > 0 ? 100 : 0),
            'valid_today' => CheckIn::where('scanned_at', '>=', $today)->where('is_valid', true)->count(),
            'invalid_today' => CheckIn::where('scanned_at', '>=', $today)->where('is_valid', false)->count(),
            'unique_customers_today' => CheckIn::where('scanned_at', '>=', $today)
                ->distinct('customer_id')->count('customer_id'),
            'by_method' => CheckIn::where('scanned_at', '>=', $today)
                ->selectRaw('scan_method, COUNT(*) as count')
                ->groupBy('scan_method')
                ->pluck('count', 'scan_method')
                ->toArray(),
            'hourly_breakdown' => CheckIn::where('scanned_at', '>=', $today)
                ->selectRaw('HOUR(scanned_at) as hour, COUNT(*) as count')
                ->groupBy('hour')
                ->orderBy('hour')
                ->pluck('count', 'hour')
                ->toArray(),
        ];
    }

    public function getPendingSyncCount(): int
    {
        return CheckIn::whereNull('synced_at')
            ->whereNotNull('offline_queue_id')
            ->count();
    }

    public function getEventsForDropdown(): Collection
    {
        return Event::where('status', 'published')
            ->where(function ($q) {
                $q->where('end_date', '>=', now()->subDay())
                  ->orWhereNull('end_date');
            })
            ->orderBy('start_date')
            ->get(['id', 'uuid', 'title', 'start_date', 'venue_name']);
    }

    private function formatTicketData(Ticket $ticket): array
    {
        return [
            'uuid' => $ticket->uuid,
            'ticket_type' => $ticket->ticket_type,
            'price' => $ticket->price,
            'currency' => $ticket->currency,
            'status' => $ticket->status,
            'qr_code' => $ticket->qr_code,
            'checked_in_at' => $ticket->checked_in_at,
            'registered_at' => $ticket->registered_at,
            'customer' => $ticket->customer ? [
                'uuid' => $ticket->customer->uuid,
                'first_name' => $ticket->customer->first_name,
                'last_name' => $ticket->customer->last_name,
                'email' => $ticket->customer->email,
                'phone' => $ticket->customer->phone,
                'nationality' => $ticket->customer->nationality,
                'initials' => ($ticket->customer->first_name ? $ticket->customer->first_name[0] : '') . ($ticket->customer->last_name ? $ticket->customer->last_name[0] : ''),
            ] : null,
        ];
    }
}
