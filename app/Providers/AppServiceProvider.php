<?php

namespace App\Providers;

use App\Models\Customer;
use App\Models\Event;
use App\Models\Ticket;
use App\Observers\CustomerObserver;
use App\Observers\EventObserver;
use App\Observers\TicketObserver;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Repositories\Contracts\EventRepositoryInterface;
use App\Repositories\Contracts\RegistrationRepositoryInterface;
use App\Repositories\Eloquent\CustomerRepository;
use App\Repositories\Eloquent\EventRepository;
use App\Repositories\Eloquent\RegistrationRepository;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(EventRepositoryInterface::class, EventRepository::class);
        $this->app->singleton(CustomerRepositoryInterface::class, CustomerRepository::class);
        $this->app->singleton(RegistrationRepositoryInterface::class, RegistrationRepository::class);
    }

    public function boot(): void
    {
        // Pin generated URLs to the configured origin (needed because this app
        // runs from the document root on shared hosting, not /public).
        URL::forceRootUrl(config('app.url'));

        // Always build secure https URLs in production, even if a request
        // reached the origin over plain http (e.g. via a proxy).
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }

        Event::observe(EventObserver::class);
        Ticket::observe(TicketObserver::class);
        Customer::observe(CustomerObserver::class);
    }
}
