<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function events(Request $request)
    {
        $events = Event::published()
            ->withCount(['tickets as confirmed_count' => fn ($q) => $q->whereIn('status', ['confirmed', 'reserved'])])
            ->when($request->search, fn ($q, $s) => $q->search($s))
            ->when($request->event_type, fn ($q, $t) => $q->byType($t))
            ->when($request->date_from, fn ($q, $d) => $q->byDateRange($d, $request->date_to))
            ->latest('start_date')
            ->paginate(12);

        return Inertia::render('Public/Events', [
            'events' => $events,
            'filters' => $request->only(['search', 'event_type', 'date_from', 'date_to']),
            'eventTypes' => Event::published()->select('event_type')->distinct()->pluck('event_type'),
        ]);
    }

    public function eventDetail(string $uuid)
    {
        $event = Event::published()
            ->with([
                'sessions',
                'gallery',
                'creator:id,name',
            ])
            ->withCount(['tickets as confirmed_count' => fn ($q) => $q->whereIn('status', ['confirmed', 'reserved'])])
            ->where('uuid', $uuid)
            ->firstOrFail();

        return Inertia::render('Public/EventDetail', [
            'event' => $event,
            'isFull' => $event->isFull(),
            'availableSpots' => $event->availableSpots(),
            'userRegistered' => auth()->check() && auth()->user()->tickets()
                ->where('event_id', $event->id)
                ->whereNotIn('status', ['cancelled', 'rejected'])
                ->exists(),
        ]);
    }
}
