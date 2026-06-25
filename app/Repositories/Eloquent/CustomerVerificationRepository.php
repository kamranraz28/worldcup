<?php

namespace App\Repositories\Eloquent;

use App\Models\CustomerVerification;
use App\Repositories\Contracts\CustomerVerificationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CustomerVerificationRepository implements CustomerVerificationRepositoryInterface
{
    public function find(string $uuid): ?CustomerVerification
    {
        return CustomerVerification::where('uuid', $uuid)
            ->with(['customer', 'reviewer', 'logs.actor'])
            ->first();
    }

    public function findById(int $id): ?CustomerVerification
    {
        return CustomerVerification::with(['customer', 'reviewer'])->find($id);
    }

    public function findByCustomer(int $customerId): Collection
    {
        return CustomerVerification::where('customer_id', $customerId)
            ->with(['reviewer'])
            ->latest()
            ->get();
    }

    public function paginate(array $criteria = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = CustomerVerification::with(['customer', 'reviewer']);

        if (!empty($criteria['status'])) {
            $query->byStatus($criteria['status']);
        }

        if (!empty($criteria['type'])) {
            $query->byType($criteria['type']);
        }

        if (!empty($criteria['search'])) {
            $query->whereHas('customer', function ($q) use ($criteria) {
                $q->search($criteria['search']);
            });
        }

        if (!empty($criteria['date_from'])) {
            $query->where('created_at', '>=', $criteria['date_from']);
        }

        if (!empty($criteria['date_to'])) {
            $query->where('created_at', '<=', $criteria['date_to']);
        }

        if (!empty($criteria['pending_review'])) {
            $query->pendingReview();
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function create(array $data): CustomerVerification
    {
        return CustomerVerification::create($data);
    }

    public function update(CustomerVerification $verification, array $data): CustomerVerification
    {
        $verification->update($data);
        return $verification->fresh();
    }

    public function delete(CustomerVerification $verification): bool
    {
        return $verification->delete();
    }

    public function findPending(int $limit = 20): Collection
    {
        return CustomerVerification::pending()
            ->with(['customer'])
            ->latest()
            ->take($limit)
            ->get();
    }

    public function findPendingByType(string $type, int $limit = 20): Collection
    {
        return CustomerVerification::pending()
            ->byType($type)
            ->with(['customer'])
            ->latest()
            ->take($limit)
            ->get();
    }

    public function findRequiringAttention(): Collection
    {
        return CustomerVerification::requiringAttention()
            ->with(['customer'])
            ->latest()
            ->get();
    }

    public function countByStatus(): array
    {
        return CustomerVerification::selectRaw("status, COUNT(*) as count")
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function getDailyStats(int $days = 30): Collection
    {
        return CustomerVerification::selectRaw(
            "DATE(created_at) as date, 
             COUNT(*) as total, 
             SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as approved,
             SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected"
        )
            ->where('created_at', '>=', now()->subDays($days))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }
}
