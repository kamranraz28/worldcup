<?php

namespace App\Repositories\Contracts;

use App\Models\CustomerVerification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CustomerVerificationRepositoryInterface
{
    public function find(string $uuid): ?CustomerVerification;
    public function findById(int $id): ?CustomerVerification;
    public function findByCustomer(int $customerId): Collection;
    public function paginate(array $criteria = [], int $perPage = 15): LengthAwarePaginator;
    public function create(array $data): CustomerVerification;
    public function update(CustomerVerification $verification, array $data): CustomerVerification;
    public function delete(CustomerVerification $verification): bool;
    public function findPending(int $limit = 20): Collection;
    public function findPendingByType(string $type, int $limit = 20): Collection;
    public function findRequiringAttention(): Collection;
    public function countByStatus(): array;
    public function getDailyStats(int $days = 30): Collection;
}
