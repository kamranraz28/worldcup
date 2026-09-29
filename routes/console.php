<?php

use Illuminate\Support\Facades\Schedule;

// Reservations that never reached the payment gateway are removed on a short
// cycle so seats do not stay blocked by abandoned checkouts.
Schedule::command('tickets:prune-abandoned')->everyFiveMinutes();