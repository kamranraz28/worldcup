<?php

namespace App\Http\Controllers;

use App\Http\Requests\GalleryUploadRequest;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use App\Services\EventService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    private $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'event_type', 'date_from', 'date_to']);

        $events = $this->eventService->paginate($filters, $request->integer('per_page', 15));

        return Inertia::render('Events/Index', [
            'events' => $events,
            'filters' => $filters,
            'stats' => [
                'total' => \App\Models\Event::count(),
                'published' => \App\Models\Event::where('status', 'published')->count(),
                'draft' => \App\Models\Event::where('status', 'draft')->count(),
                'upcoming' => \App\Models\Event::upcoming()->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Events/Create');
    }

    public function store(StoreEventRequest $request): RedirectResponse
    {
        $event = $this->eventService->create(
            $request->validated(),
            $request->file('banner_image'),
        );

        return redirect()
            ->route('events.show', $event)
            ->with('flash', ['success' => 'Event created successfully.']);
    }

    public function show(string $uuid): Response
    {
        $event = $this->eventService->find($uuid);

        if (!$event) {
            abort(404);
        }

        return Inertia::render('Events/Show', [
            'event' => $event->loadMissing([
                'creator:id,name,email',
                'sessions',
                'gallery',
            ])
                ->loadCount(['tickets as confirmed_tickets' => fn ($q) => $q->where('status', 'confirmed')])
                ->loadCount(['tickets as checked_in_count' => fn ($q) => $q->where('status', 'redeemed')]),
        ]);
    }

    public function edit(string $uuid): Response
    {
        $event = $this->eventService->find($uuid);

        if (!$event) {
            abort(404);
        }

        $this->authorize('update', $event);

        return Inertia::render('Events/Edit', [
            'event' => $event->loadMissing(['sessions', 'gallery']),
        ]);
    }

    public function update(UpdateEventRequest $request, string $uuid): RedirectResponse
    {
        $event = $this->eventService->find($uuid);

        if (!$event) {
            abort(404);
        }

        $this->eventService->update($event, $request->validated(), $request->file('banner_image'));

        return redirect()
            ->route('events.show', $event)
            ->with('flash', ['success' => 'Event updated successfully.']);
    }

    public function destroy(string $uuid): RedirectResponse
    {
        $event = $this->eventService->find($uuid);

        if (!$event) {
            abort(404);
        }

        $this->authorize('delete', $event);

        $this->eventService->delete($event);

        return redirect()
            ->route('events.index')
            ->with('flash', ['success' => 'Event deleted successfully.']);
    }

    public function publish(string $uuid): RedirectResponse
    {
        $event = $this->eventService->find($uuid);

        if (!$event) {
            abort(404);
        }

        $this->authorize('publish', $event);

        try {
            $this->eventService->publish($event);
            return back()->with('flash', ['success' => 'Event published successfully.']);
        } catch (\RuntimeException $e) {
            return back()->with('flash', ['error' => $e->getMessage()]);
        }
    }

    public function cancel(string $uuid): RedirectResponse
    {
        $event = $this->eventService->find($uuid);

        if (!$event) {
            abort(404);
        }

        $this->authorize('cancel', $event);

        try {
            $this->eventService->cancel($event);
            return back()->with('flash', ['success' => 'Event cancelled successfully.']);
        } catch (\RuntimeException $e) {
            return back()->with('flash', ['error' => $e->getMessage()]);
        }
    }

    public function duplicate(string $uuid): RedirectResponse
    {
        $event = $this->eventService->find($uuid);

        if (!$event) {
            abort(404);
        }

        $this->authorize('create', Event::class);

        $duplicate = $this->eventService->duplicate($event);

        return redirect()
            ->route('events.edit', $duplicate)
            ->with('flash', ['success' => 'Event duplicated successfully.']);
    }

    public function uploadGallery(GalleryUploadRequest $request, string $uuid): RedirectResponse
    {
        $event = $this->eventService->find($uuid);

        if (!$event) {
            abort(404);
        }

        $this->eventService->addToGallery($event, $request->file('image'), $request->input('caption'));

        return back()->with('flash', ['success' => 'Image added to gallery.']);
    }

    public function deleteGalleryImage(string $uuid, int $galleryId): RedirectResponse
    {
        $event = $this->eventService->find($uuid);

        if (!$event) {
            abort(404);
        }

        $this->authorize('update', $event);

        $this->eventService->removeFromGallery($event, $galleryId);

        return back()->with('flash', ['success' => 'Image removed from gallery.']);
    }

    public function reorderGallery(Request $request, string $uuid): RedirectResponse
    {
        $event = $this->eventService->find($uuid);

        if (!$event) {
            abort(404);
        }

        $this->authorize('update', $event);

        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['required', 'integer', 'exists:event_galleries,id'],
        ]);

        $this->eventService->reorderGallery($event, $request->input('order'));

        return back()->with('flash', ['success' => 'Gallery reordered.']);
    }
}
