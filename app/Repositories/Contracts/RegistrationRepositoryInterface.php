<?php

namespace App\Repositories\Contracts;

use App\Models\Ticket;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface RegistrationRepositoryInterface
{
    public function find(string $uuid): ?Ticket;
    public function findById(int $id): ?Ticket;
    public function findByQr(string $qr): ?Ticket;
    public function paginate(array $criteria = [], int $perPage = 15): LengthAwarePaginator;
    public function create(array $data): Ticket;
    public function update(Ticket $ticket, array $data): Ticket;
    public function delete(Ticket $ticket): bool;
    public function findByEvent(int $eventId): Collection;
    public function findByCustomer(int $customerId): Collection;
    public function findPendingApproval(int $limit = 20): Collection;
    public function countByStatus(): array;
    public function countByEvent(int $eventId): array;
    public function getDailyStats(int $days = 30): Collection;
}
