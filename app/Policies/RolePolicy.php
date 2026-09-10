<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;

class RolePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role?->name === 'super-admin';
    }

    public function view(User $user, Role $role): bool
    {
        return $user->role?->name === 'super-admin';
    }

    public function create(User $user): bool
    {
        return $user->role?->name === 'super-admin';
    }

    public function update(User $user, Role $role): bool
    {
        return $user->role?->name === 'super-admin';
    }

    public function delete(User $user, Role $role): bool
    {
        if ($role->is_system) {
            return false;
        }

        if ($role->users()->count() > 0) {
            return false;
        }

        return $user->role?->name === 'super-admin';
    }
}
