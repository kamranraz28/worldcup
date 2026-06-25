<?php

namespace App\Providers;

use App\Models\Customer;
use App\Models\Event;
use App\Models\Ticket;
use App\Observers\CustomerObserver;
use App\Observers\EventObserver;
use App\Observers\TicketObserver;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Repositories\Contracts\CustomerVerificationRepositoryInterface;
use App\Repositories\Contracts\EventRepositoryInterface;
use App\Repositories\Contracts\RegistrationRepositoryInterface;
use App\Repositories\Eloquent\CustomerRepository;
use App\Repositories\Eloquent\CustomerVerificationRepository;
use App\Repositories\Eloquent\EventRepository;
use App\Repositories\Eloquent\RegistrationRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(EventRepositoryInterface::class, EventRepository::class);
        $this->app->singleton(CustomerRepositoryInterface::class, CustomerRepository::class);
        $this->app->singleton(CustomerVerificationRepositoryInterface::class, CustomerVerificationRepository::class);
        $this->app->singleton(RegistrationRepositoryInterface::class, RegistrationRepository::class);
    }

    public function boot(): void
    {
        Event::observe(EventObserver::class);
        Ticket::observe(TicketObserver::class);
        Customer::observe(CustomerObserver::class);
    }
}
