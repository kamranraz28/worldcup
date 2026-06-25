<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('users.view');
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasPermission('users.view') || $user->id === $model->id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('users.create');
    }

    public function update(User $user, User $model): bool
    {
        if ($user->hasPermission('users.edit')) {
            return true;
        }

        return $user->id === $model->id;
    }

    public function delete(User $user, User $model): bool
    {
        if ($user->id === $model->id) {
            return false;
        }

        if ($model->role?->is_system && ! $user->hasPermission('users.impersonate')) {
            return false;
        }

        return $user->hasPermission('users.delete');
    }

    public function impersonate(User $user): bool
    {
        return $user->hasPermission('users.impersonate');
    }
}
