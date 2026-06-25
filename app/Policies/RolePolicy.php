<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;

class RolePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('roles.view');
    }

    public function view(User $user, Role $role): bool
    {
        return $user->hasPermission('roles.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('roles.create');
    }

    public function update(User $user, Role $role): bool
    {
        if ($role->is_system) {
            return $user->hasPermission('roles.edit') && $user->role?->name === 'super-admin';
        }

        return $user->hasPermission('roles.edit');
    }

    public function delete(User $user, Role $role): bool
    {
        if ($role->is_system) {
            return false;
        }

        if ($role->users()->count() > 0) {
            return false;
        }

        return $user->hasPermission('roles.delete');
    }
}
