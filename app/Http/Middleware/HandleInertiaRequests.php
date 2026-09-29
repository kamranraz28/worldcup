<?php

namespace App\Http\Middleware;

use App\Models\Notification;
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
            // Keeps the navbar bell in sync after marking notifications read.
            'notifications' => fn () => $this->notifications($request),
            'unreadCount' => fn () => $request->user()
                ? Notification::forNotifiable($request->user())->inApp()->unread()->count()
                : 0,
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

    /**
     * @return array<int, array<string, mixed>>
     */
    private function notifications(Request $request): array
    {
        if (! $request->user()) {
            return [];
        }

        return Notification::forNotifiable($request->user())
            ->inApp()
            ->latest()
            ->limit(8)
            ->get(['id', 'type', 'subject', 'body', 'data', 'read_at', 'created_at'])
            ->map(fn (Notification $n) => [
                'id' => $n->id,
                'type' => $n->type,
                'subject' => $n->subject,
                'body' => $n->body,
                'data' => $n->data,
                'read_at' => $n->read_at?->toIso8601String(),
                'created_at' => $n->created_at?->toIso8601String(),
            ])
            ->all();
    }
}
