<?php

namespace App\Policies;

use App\Models\Permission;
use App\Models\User;

class PermissionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('roles.view');
    }

    public function view(User $user, Permission $permission): bool
    {
        return $user->hasPermission('roles.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('roles.create');
    }

    public function update(User $user, Permission $permission): bool
    {
        return $user->hasPermission('roles.edit');
    }

    public function delete(User $user, Permission $permission): bool
    {
        return $user->hasPermission('roles.delete');
    }
}
