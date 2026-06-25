<?php

namespace App\Observers;

use App\Models\Customer;
use Illuminate\Support\Facades\Cache;

class CustomerObserver
{
    public function created(Customer $customer): void
    {
        Cache::tags(['customers'])->flush();
    }

    public function updated(Customer $customer): void
    {
        Cache::tags(['customers'])->flush();
    }

    public function deleted(Customer $customer): void
    {
        Cache::tags(['customers'])->flush();
    }

    public function restored(Customer $customer): void
    {
        Cache::tags(['customers'])->flush();
    }

    public function forceDeleted(Customer $customer): void
    {
        Cache::tags(['customers'])->flush();
    }
}
