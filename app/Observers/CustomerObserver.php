<?php

namespace App\Observers;

use App\Models\Customer;
use Illuminate\Support\Facades\Cache;

class CustomerObserver
{
    public function created(Customer $customer): void
    {
        Cache::flush();
    }

    public function updated(Customer $customer): void
    {
        Cache::flush();
    }

    public function deleted(Customer $customer): void
    {
        Cache::flush();
    }

    public function restored(Customer $customer): void
    {
        Cache::flush();
    }

    public function forceDeleted(Customer $customer): void
    {
        Cache::flush();
    }
}
