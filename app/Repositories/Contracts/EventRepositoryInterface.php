<?php

namespace App\Repositories\Contracts;

use App\Models\Event;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface EventRepositoryInterface
{
    public function find(string $uuid): ?Event;

    public function findById(int $id): ?Event;

    public function findBySlug(string $slug): ?Event;

    public function all(array $criteria = []): Collection;

    public function paginate(array $criteria = [], int $perPage = 15): LengthAwarePaginator;

    public function create(array $data): Event;

    public function update(Event $event, array $data): Event;

    public function delete(Event $event): bool;

    public function findUpcoming(int $limit = 10): Collection;

    public function findPublished(): Collection;

    public function countByStatus(string $status): int;

    public function getCapacityStats(): array;
}
