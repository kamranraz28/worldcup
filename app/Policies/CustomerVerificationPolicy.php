<?php

namespace App\Policies;

use App\Models\CustomerVerification;
use App\Models\User;

class CustomerVerificationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('verifications.view');
    }

    public function view(User $user, CustomerVerification $verification): bool
    {
        if ($user->hasPermission('verifications.view')) {
            return true;
        }

        return $user->customer?->id === $verification->customer_id;
    }

    public function review(User $user, CustomerVerification $verification): bool
    {
        return $user->hasPermission('verifications.review');
    }

    public function approve(User $user, CustomerVerification $verification): bool
    {
        return $user->hasPermission('verifications.approve');
    }

    public function reject(User $user, CustomerVerification $verification): bool
    {
        return $user->hasPermission('verifications.reject');
    }

    public function flag(User $user, CustomerVerification $verification): bool
    {
        return $user->hasPermission('verifications.flag');
    }
}
