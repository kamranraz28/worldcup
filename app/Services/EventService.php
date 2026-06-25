<?php

namespace App\Services;

use App\Models\Event;
use App\Models\EventGallery;
use App\Repositories\Contracts\EventRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EventService
{
    private $eventRepository;
    private $storageService;

    public function __construct(EventRepositoryInterface $eventRepository, FileStorageService $storageService)
    {
        $this->eventRepository = $eventRepository;
        $this->storageService = $storageService;
    }

    public function find(string $uuid): ?Event
    {
        return $this->eventRepository->find($uuid);
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->eventRepository->paginate($filters, $perPage);
    }

    public function create(array $data, ?UploadedFile $banner = null): Event
    {
        return DB::transaction(function () use ($data, $banner) {
            if ($banner) {
                $data['banner_image'] = $this->storageService->upload(
                    $banner,
                    'events/banners',
                    'event-banner'
                );
            }

            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);
            $data['created_by'] = $data['created_by'] ?? auth()->id();

            return $this->eventRepository->create($data);
        });
    }

    public function update(Event $event, array $data, ?UploadedFile $banner = null): Event
    {
        return DB::transaction(function () use ($event, $data, $banner) {
            if ($banner) {
                if ($event->banner_image) {
                    $this->storageService->delete($event->banner_image);
                }

                $data['banner_image'] = $this->storageService->upload(
                    $banner,
                    'events/banners',
                    'event-banner'
                );
            }

            if (isset($data['title']) && $data['title'] !== $event->title) {
                $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);
            }

            return $this->eventRepository->update($event, $data);
        });
    }

    public function delete(Event $event): bool
    {
        return DB::transaction(function () use ($event) {
            if ($event->banner_image) {
                $this->storageService->delete($event->banner_image);
            }

            foreach ($event->gallery as $image) {
                $this->storageService->delete($image->image_path);
                $image->delete();
            }

            return $this->eventRepository->delete($event);
        });
    }

    public function publish(Event $event): Event
    {
        if (!$event->canBePublished()) {
            throw new \RuntimeException('Event cannot be published in its current state.');
        }

        return $this->eventRepository->update($event, ['status' => 'published']);
    }

    public function cancel(Event $event): Event
    {
        if (!$event->canBeCancelled()) {
            throw new \RuntimeException('Event cannot be cancelled in its current state.');
        }

        return $this->eventRepository->update($event, ['status' => 'cancelled']);
    }

    public function addToGallery(Event $event, UploadedFile $file, ?string $caption = null): EventGallery
    {
        $path = $this->storageService->upload($file, 'events/gallery', 'event-gallery');

        $maxOrder = $event->gallery()->max('order') ?? 0;

        return $event->gallery()->create([
            'image_path' => $path,
            'caption' => $caption,
            'order' => $maxOrder + 1,
        ]);
    }

    public function removeFromGallery(Event $event, int $galleryId): void
    {
        DB::transaction(function () use ($event, $galleryId) {
            $image = $event->gallery()->findOrFail($galleryId);
            $this->storageService->delete($image->image_path);
            $image->delete();
        });
    }

    public function reorderGallery(Event $event, array $order): void
    {
        foreach ($order as $position => $id) {
            EventGallery::where('id', $id)
                ->where('event_id', $event->id)
                ->update(['order' => $position]);
        }
    }

    public function getUpcomingEvents(int $limit = 10): Collection
    {
        return $this->eventRepository->findUpcoming($limit);
    }

    public function getCapacityStats(): array
    {
        return $this->eventRepository->getCapacityStats();
    }

    public function duplicate(Event $event): Event
    {
        return DB::transaction(function () use ($event) {
            $data = $event->toArray();
            unset($data['uuid'], $data['slug'], $data['banner_image'], $data['status']);
            $data['title'] = $event->title . ' (Copy)';
            $data['status'] = 'draft';

            return $this->eventRepository->create($data);
        });
    }
}
