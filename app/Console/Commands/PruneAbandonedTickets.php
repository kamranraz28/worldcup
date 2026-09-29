<?php

namespace App\Console\Commands;

use App\Services\GuestRegistrationService;
use Illuminate\Console\Command;

class PruneAbandonedTickets extends Command
{
    protected $signature = 'tickets:prune-abandoned';

    protected $description = 'Delete reservations whose payment window (2h) has lapsed — complete or nothing.';

    public function handle(GuestRegistrationService $guests): int
    {
        $count = $guests->pruneExpiredReservations();

        $this->info("Pruned {$count} abandoned reservation(s).");

        return self::SUCCESS;
    }
}