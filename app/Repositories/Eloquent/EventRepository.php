<?php

namespace App\Repositories\Eloquent;

use App\Models\Event;
use App\Repositories\Contracts\EventRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class EventRepository implements EventRepositoryInterface
{
    public function find(string $uuid): ?Event
    {
        return Event::with(['creator', 'gallery'])->where('uuid', $uuid)->first();
    }

    public function findById(int $id): ?Event
    {
        return Event::with(['creator', 'gallery'])->find($id);
    }

    public function findBySlug(string $slug): ?Event
    {
        return Event::with(['creator', 'gallery'])->where('slug', $slug)->first();
    }

    public function all(array $criteria = []): Collection
    {
        return $this->applyCriteria(Event::query(), $criteria)->latest()->get();
    }

    public function paginate(array $criteria = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->applyCriteria(Event::query(), $criteria)
            ->with(['creator:id,name'])
            ->withCount(['tickets as confirmed_count' => fn ($q) => $q->where('status', 'confirmed')])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): Event
    {
        $data['uuid'] = $data['uuid'] ?? (string) Str::uuid();
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']) . '-' . Str::random(6);

        return Event::create($data);
    }

    public function update(Event $event, array $data): Event
    {
        $event->update($data);
        return $event->fresh();
    }

    public function delete(Event $event): bool
    {
        return $event->delete();
    }

    public function findUpcoming(int $limit = 10): Collection
    {
        return Event::published()
            ->upcoming()
            ->withCount(['tickets as confirmed_count' => fn ($q) => $q->where('status', 'confirmed')])
            ->latest('start_date')
            ->take($limit)
            ->get();
    }

    public function findPublished(): Collection
    {
        return Event::published()->latest('start_date')->get();
    }

    public function countByStatus(string $status): int
    {
        return Event::where('status', $status)->count();
    }

    public function getCapacityStats(): array
    {
        return [
            'total_capacity' => Event::published()->sum('max_capacity'),
            'total_filled' => Event::published()
                ->get()
                ->sum(fn ($e) => $e->tickets()->whereIn('status', ['confirmed', 'redeemed'])->count()),
            'average_fill' => Event::published()
                ->where('max_capacity', '>', 0)
                ->get()
                ->avg(fn ($e) => ($e->tickets()->whereIn('status', ['confirmed', 'redeemed'])->count() / $e->max_capacity) * 100),
        ];
    }

    private function applyCriteria($query, array $criteria)
    {
        if (!empty($criteria['search'])) {
            $query->search($criteria['search']);
        }

        if (!empty($criteria['status'])) {
            $query->byStatus($criteria['status']);
        }

        if (!empty($criteria['event_type'])) {
            $query->byType($criteria['event_type']);
        }

        if (!empty($criteria['date_from'])) {
            $query->byDateRange($criteria['date_from'], $criteria['date_to'] ?? null);
        }

        if (!empty($criteria['upcoming'])) {
            $query->upcoming();
        }

        if (!empty($criteria['past'])) {
            $query->past();
        }

        if (!empty($criteria['created_by'])) {
            $query->where('created_by', $criteria['created_by']);
        }

        return $query;
    }
}
