<?php

namespace App\Providers;

use App\Models\Campaign;
use App\Models\Customer;
use App\Models\CustomerVerification;
use App\Models\Event;
use App\Models\Permission as PermissionModel;
use App\Models\Report;
use App\Models\Role;
use App\Models\Ticket;
use App\Models\User;
use App\Policies\CampaignPolicy;
use App\Policies\CustomerPolicy;
use App\Policies\CustomerVerificationPolicy;
use App\Policies\EventPolicy;
use App\Policies\PermissionPolicy;
use App\Policies\ReportPolicy;
use App\Policies\RolePolicy;
use App\Policies\SettingsPolicy;
use App\Policies\TicketPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
        Role::class => RolePolicy::class,
        PermissionModel::class => PermissionPolicy::class,
        Event::class => EventPolicy::class,
        Ticket::class => TicketPolicy::class,
        Customer::class => CustomerPolicy::class,
        CustomerVerification::class => CustomerVerificationPolicy::class,
        Campaign::class => CampaignPolicy::class,
        Report::class => ReportPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('view-dashboard', fn (User $user) => $user->isAdmin());

        Gate::define('view-settings', [SettingsPolicy::class, 'view']);
        Gate::define('edit-settings', [SettingsPolicy::class, 'edit']);

        Gate::before(function (User $user) {
            if ($user->role && $user->role->name === 'super-admin') {
                return true;
            }
        });
    }
}
