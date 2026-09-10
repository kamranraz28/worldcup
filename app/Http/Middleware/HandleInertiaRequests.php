<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'uuid' => $request->user()->uuid,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'phone' => $request->user()->phone,
                    'role' => $request->user()->role?->only(['name', 'display_name']),
                    'permissions' => $request->user()->role?->permissions?->pluck('name') ?? [],
                ] : null,
            ],
            'flash' => fn () => array_merge(
                $request->session()->get('flash', []),
                array_filter([
                    'success' => $request->session()->get('success'),
                    'error' => $request->session()->get('error'),
                    'status' => $request->session()->get('status'),
                ]),
            ),
        ]);
    }
}
