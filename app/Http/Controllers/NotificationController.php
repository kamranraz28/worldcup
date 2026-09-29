<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * The authenticated user's in-app feed ('database' channel only).
     */
    private function feed(Request $request)
    {
        return Notification::query()
            ->forNotifiable($request->user())
            ->inApp();
    }

    public function index(Request $request): Response
    {
        $notifications = $this->feed($request)
            ->latest()
            ->paginate(15);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(Request $request, int $id)
    {
        // Scoped to the owner so one user cannot mark another's notification.
        $notification = $this->feed($request)->findOrFail($id);
        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead(Request $request)
    {
        $this->feed($request)
            ->unread()
            ->update(['read_at' => now()]);

        return back();
    }
}
