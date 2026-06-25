<?php

namespace App\Observers;

use App\Models\Event;
use Illuminate\Support\Facades\Cache;

class EventObserver
{
    public function created(Event $event): void
    {
        Cache::tags(['events'])->flush();
    }

    public function updated(Event $event): void
    {
        Cache::tags(['events'])->flush();
    }

    public function deleted(Event $event): void
    {
        Cache::tags(['events'])->flush();
    }

    public function restored(Event $event): void
    {
        Cache::tags(['events'])->flush();
    }

    public function forceDeleted(Event $event): void
    {
        Cache::tags(['events'])->flush();
    }
}
