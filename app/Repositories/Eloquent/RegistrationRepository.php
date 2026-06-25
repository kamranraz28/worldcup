<?php

namespace App\Repositories\Eloquent;

use App\Models\Ticket;
use App\Repositories\Contracts\RegistrationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RegistrationRepository implements RegistrationRepositoryInterface
{
    public function find(string $uuid): ?Ticket
    {
        return Ticket::with(['event', 'customer', 'session', 'approver', 'rejecter'])->where('uuid', $uuid)->first();
    }

    public function findById(int $id): ?Ticket
    {
        return Ticket::with(['event', 'customer'])->find($id);
    }

    public function findByQr(string $qr): ?Ticket
    {
        return Ticket::with(['event', 'customer'])->where('qr_code', $qr)->first();
    }

    public function paginate(array $criteria = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Ticket::with(['event:id,title,start_date', 'customer:id,first_name,last_name,email,phone']);

        if (!empty($criteria['search'])) {
            $query->search($criteria['search']);
        }

        if (!empty($criteria['status'])) {
            $query->byStatus($criteria['status']);
        }

        if (!empty($criteria['ticket_type'])) {
            $query->byType($criteria['ticket_type']);
        }

        if (!empty($criteria['event_id'])) {
            $query->byEvent((int) $criteria['event_id']);
        }

        if (!empty($criteria['date_from'])) {
            $query->byDateRange($criteria['date_from'], $criteria['date_to'] ?? null);
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function create(array $data): Ticket
    {
        return Ticket::create($data);
    }

    public function update(Ticket $ticket, array $data): Ticket
    {
        $ticket->update($data);
        return $ticket->fresh();
    }

    public function delete(Ticket $ticket): bool
    {
        return $ticket->delete();
    }

    public function findByEvent(int $eventId): Collection
    {
        return Ticket::with(['customer', 'session'])->byEvent($eventId)->latest()->get();
    }

    public function findByCustomer(int $customerId): Collection
    {
        return Ticket::with(['event'])->where('customer_id', $customerId)->latest()->get();
    }

    public function findPendingApproval(int $limit = 20): Collection
    {
        return Ticket::with(['event:id,title', 'customer:id,first_name,last_name,email'])
            ->pendingApproval()
            ->latest()
            ->take($limit)
            ->get();
    }

    public function countByStatus(): array
    {
        return Ticket::selectRaw("status, COUNT(*) as count")
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function countByEvent(int $eventId): array
    {
        return Ticket::selectRaw("status, COUNT(*) as count")
            ->byEvent($eventId)
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function getDailyStats(int $days = 30): Collection
    {
        return Ticket::selectRaw(
            "DATE(created_at) as date, 
             COUNT(*) as total,
             SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
             SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled"
        )
            ->where('created_at', '>=', now()->subDays($days))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }
}
