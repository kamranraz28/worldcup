<?php

namespace App\Observers;

use App\Models\Ticket;
use Illuminate\Support\Facades\Cache;

class TicketObserver
{
    public function created(Ticket $ticket): void
    {
        Cache::tags(['tickets', "event:{$ticket->event_id}"])->flush();
    }

    public function updated(Ticket $ticket): void
    {
        Cache::tags(['tickets', "event:{$ticket->event_id}"])->flush();
    }

    public function deleted(Ticket $ticket): void
    {
        Cache::tags(['tickets', "event:{$ticket->event_id}"])->flush();
    }

    public function forceDeleted(Ticket $ticket): void
    {
        Cache::tags(['tickets', "event:{$ticket->event_id}"])->flush();
    }
}
