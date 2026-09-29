<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationReadTest extends TestCase
{
    use RefreshDatabase;

    private function makeNotification(User $user, array $overrides = []): Notification
    {
        return Notification::create(array_merge([
            'type' => 'event_reminder',
            'notifiable_type' => $user->getMorphClass(),
            'notifiable_id' => $user->id,
            'channel' => 'database',
            'subject' => 'Event Reminder',
            'body' => 'Screening starts in 24 hours.',
            'sent_at' => now(),
        ], $overrides));
    }

    public function test_notification_feed_is_shared_to_authenticated_pages(): void
    {
        $this->seed();
        $user = User::where('email', 'superadmin@synergyinterface.com')->firstOrFail();

        $this->makeNotification($user, ['type' => 'ticket_confirmed', 'subject' => 'Ticket Confirmed']);
        $this->makeNotification($user, ['read_at' => now()]);

        $response = $this->actingAs($user)->get('/dashboard');

        $expectedUnread = Notification::forNotifiable($user)->unread()->count();

        $response->assertOk();
        $response->assertSee('Ticket Confirmed');
        $response->assertSee('"unreadCount":' . $expectedUnread, false);
    }

    public function test_marking_a_single_notification_as_read_persists(): void
    {
        $this->seed();
        $user = User::where('email', 'superadmin@synergyinterface.com')->firstOrFail();
        $notification = $this->makeNotification($user);

        $this->assertNull($notification->fresh()->read_at);

        $this->actingAs($user)
            ->post("/notifications/{$notification->id}/read")
            ->assertRedirect();

        $this->assertNotNull($notification->fresh()->read_at);
    }

    public function test_mark_all_as_read_clears_only_the_current_user_unread_rows(): void
    {
        $this->seed();
        $user = User::where('email', 'superadmin@synergyinterface.com')->firstOrFail();
        $other = User::where('email', 'admin@synergyinterface.com')->firstOrFail();

        $mine = $this->makeNotification($user);
        $this->makeNotification($user);
        $theirs = $this->makeNotification($other);

        $this->actingAs($user)->post('/notifications/read-all')->assertRedirect();

        $this->assertSame(0, Notification::forNotifiable($user)->unread()->count());
        $this->assertNotNull($mine->fresh()->read_at);
        // Another user's unread row must be untouched.
        $this->assertNull($theirs->fresh()->read_at);
    }

    public function test_a_user_cannot_mark_another_users_notification_as_read(): void
    {
        $this->seed();
        $user = User::where('email', 'superadmin@synergyinterface.com')->firstOrFail();
        $other = User::where('email', 'admin@synergyinterface.com')->firstOrFail();
        $theirs = $this->makeNotification($other);

        $this->actingAs($user)
            ->post("/notifications/{$theirs->id}/read")
            ->assertNotFound();

        $this->assertNull($theirs->fresh()->read_at);
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/notifications')->assertRedirect('/login');
    }

    public function test_mail_channel_rows_are_excluded_from_the_in_app_feed(): void
    {
        $this->seed();
        $user = User::where('email', 'superadmin@synergyinterface.com')->firstOrFail();

        $this->makeNotification($user, ['subject' => 'In App']);
        $this->makeNotification($user, ['channel' => 'mail', 'subject' => 'Mailed Only']);

        $response = $this->actingAs($user)->get('/notifications');

        $response->assertOk();
        $response->assertSee('In App');
        $response->assertDontSee('Mailed Only');
    }
}
