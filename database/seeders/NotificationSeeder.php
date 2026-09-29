<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    /**
     * In-app notifications. One row per recipient, channel 'database',
     * mirroring what the mail channel logs for the same event.
     */
    private const FEED = [
        [
            'type' => 'ticket_confirmed',
            'subject' => 'Ticket Confirmed',
            'body' => 'Your Semi-Final viewing party ticket is confirmed.',
            'minutes_ago' => 60,
            'read' => false,
        ],
        [
            'type' => 'campaign',
            'subject' => 'New Campaign',
            'body' => 'Loyalty Rewards is now active. Join now!',
            'minutes_ago' => 180,
            'read' => true,
        ],
        [
            'type' => 'event_reminder',
            'subject' => 'Event Reminder',
            'body' => 'Quarter-Final Live Screening starts in 24 hours.',
            'minutes_ago' => 300,
            'read' => true,
        ],
        [
            'type' => 'check_in',
            'subject' => 'Check-in Alert',
            'body' => '842 fans checked in today. Great turnout!',
            'minutes_ago' => 480,
            'read' => true,
        ],
    ];

    public function run(): void
    {
        $users = User::where('is_active', true)->get();

        if ($users->isEmpty()) {
            $this->command?->warn('No active users found — skipping notification seed.');

            return;
        }

        foreach ($users as $user) {
            foreach (self::FEED as $item) {
                $createdAt = now()->subMinutes($item['minutes_ago']);

                Notification::updateOrCreate(
                    [
                        'notifiable_type' => $user->getMorphClass(),
                        'notifiable_id' => $user->id,
                        'type' => $item['type'],
                        'subject' => $item['subject'],
                        'channel' => 'database',
                    ],
                    [
                        'body' => $item['body'],
                        'data' => ['seeded' => true, 'ref' => (string) Str::uuid()],
                        'read_at' => $item['read'] ? $createdAt->copy()->addMinutes(5) : null,
                        'sent_at' => $createdAt,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]
                );
            }
        }
    }
}
