<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

class CustomerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('customers.view');
    }

    public function view(User $user, Customer $customer): bool
    {
        if ($user->hasPermission('customers.view')) {
            return true;
        }

        return $user->customer?->id === $customer->id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('customers.create');
    }

    public function update(User $user, Customer $customer): bool
    {
        if ($user->hasPermission('customers.edit')) {
            return true;
        }

        return $user->customer?->id === $customer->id;
    }

    public function delete(User $user, Customer $customer): bool
    {
        return $user->hasPermission('customers.delete');
    }

    public function export(User $user): bool
    {
        return $user->hasPermission('customers.export');
    }

    public function import(User $user): bool
    {
        return $user->hasPermission('customers.import');
    }
}
