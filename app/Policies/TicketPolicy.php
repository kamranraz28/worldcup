<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('tickets.view');
    }

    public function view(User $user, Ticket $ticket): bool
    {
        if ($user->hasPermission('tickets.view')) {
            return true;
        }

        return $user->customer?->id === $ticket->customer_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('tickets.create');
    }

    public function update(User $user, Ticket $ticket): bool
    {
        return $user->hasPermission('tickets.edit');
    }

    public function delete(User $user, Ticket $ticket): bool
    {
        return $user->hasPermission('tickets.delete');
    }

    public function redeem(User $user, Ticket $ticket): bool
    {
        return $user->hasPermission('tickets.redeem');
    }

    public function transfer(User $user, Ticket $ticket): bool
    {
        return $user->hasPermission('tickets.transfer');
    }
}
