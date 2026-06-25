<?php

namespace App\Policies;

use App\Models\Report;
use App\Models\User;

class ReportPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('reports.view');
    }

    public function view(User $user, Report $report): bool
    {
        return $user->hasPermission('reports.view');
    }

    public function generate(User $user): bool
    {
        return $user->hasPermission('reports.generate');
    }

    public function export(User $user, Report $report): bool
    {
        return $user->hasPermission('reports.export');
    }

    public function delete(User $user, Report $report): bool
    {
        return $user->hasPermission('reports.delete');
    }
}
