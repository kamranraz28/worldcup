<?php

namespace App\Policies;

use App\Models\User;

class SettingsPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermission('configs.view');
    }

    public function edit(User $user): bool
    {
        return $user->hasPermission('configs.edit');
    }
}
