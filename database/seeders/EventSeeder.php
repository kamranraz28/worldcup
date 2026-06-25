<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventSession;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            [
                'title' => 'FIFA World Cup 2026 Opening Ceremony',
                'event_type' => 'live',
                'venue_name' => 'Toffee Stadium',
                'venue_address' => '123 Arena Boulevard, New York, NY',
                'max_capacity' => 50000,
                'ticket_price' => 299.99,
                'start_date' => now()->addMonths(2),
                'end_date' => now()->addMonths(2)->addHours(4),
                'registration_deadline' => now()->addMonths(2)->subDays(3),
                'status' => 'published',
                'requires_verification' => true,
                'sessions' => [
                    ['title' => 'Main Ceremony', 'start_time' => '2026-06-08 19:00:00', 'end_time' => '2026-06-08 23:00:00', 'location' => 'Main Stage'],
                ],
            ],
            [
                'title' => 'VIP Networking Gala',
                'event_type' => 'live',
                'venue_name' => 'Grand Ballroom, Toffee Tower',
                'venue_address' => '456 Luxury Avenue, New York, NY',
                'max_capacity' => 500,
                'ticket_price' => 999.99,
                'start_date' => now()->addMonths(2)->addDays(1),
                'end_date' => now()->addMonths(2)->addDays(1)->addHours(6),
                'registration_deadline' => now()->addMonths(2)->subDays(5),
                'status' => 'published',
                'requires_verification' => true,
            ],
            [
                'title' => 'Live Watch Party: Semi-Finals',
                'event_type' => 'live',
                'venue_name' => 'Toffee Arena',
                'venue_address' => '789 Fan Zone Road, New York, NY',
                'max_capacity' => 15000,
                'ticket_price' => 49.99,
                'start_date' => now()->addMonths(3),
                'end_date' => now()->addMonths(3)->addHours(5),
                'registration_deadline' => now()->addMonths(3)->subDays(1),
                'status' => 'draft',
                'requires_verification' => false,
            ],
            [
                'title' => 'Virtual Fan Meet: Global Legends',
                'event_type' => 'virtual',
                'venue_name' => null,
                'venue_address' => null,
                'max_capacity' => 10000,
                'ticket_price' => 19.99,
                'start_date' => now()->addWeeks(3),
                'end_date' => now()->addWeeks(3)->addHours(2),
                'registration_deadline' => now()->addWeeks(3)->subDays(1),
                'status' => 'published',
                'requires_verification' => false,
            ],
            [
                'title' => 'Toffee Championship Finals',
                'event_type' => 'live',
                'venue_name' => 'Toffee National Stadium',
                'venue_address' => '100 Champions Way, New York, NY',
                'max_capacity' => 75000,
                'ticket_price' => 599.99,
                'start_date' => now()->addMonths(4),
                'end_date' => now()->addMonths(4)->addDays(1),
                'registration_deadline' => now()->addMonths(4)->subWeeks(2),
                'status' => 'published',
                'requires_verification' => true,
            ],
            [
                'title' => 'Hybrid Workshop: Football Analytics',
                'event_type' => 'hybrid',
                'venue_name' => 'Toffee Innovation Lab',
                'venue_address' => '321 Tech Park, New York, NY',
                'max_capacity' => 200,
                'ticket_price' => 149.99,
                'start_date' => now()->addWeeks(1),
                'end_date' => now()->addWeeks(1)->addHours(4),
                'registration_deadline' => now()->addWeeks(1)->subHours(12),
                'status' => 'published',
                'requires_verification' => false,
            ],
            [
                'title' => 'Past Tournament Highlights',
                'event_type' => 'live',
                'venue_name' => 'Toffee Cinema',
                'venue_address' => '555 Replay Street, New York, NY',
                'max_capacity' => 300,
                'ticket_price' => 0,
                'start_date' => now()->subMonth(),
                'end_date' => now()->subMonth()->addHours(3),
                'registration_deadline' => now()->subMonth()->subDays(1),
                'status' => 'published',
                'requires_verification' => false,
            ],
            [
                'title' => 'Cancelled: Beach Football Festival',
                'event_type' => 'live',
                'venue_name' => 'Toffee Beach Arena',
                'venue_address' => '777 Ocean Drive, New York, NY',
                'max_capacity' => 5000,
                'ticket_price' => 79.99,
                'start_date' => now()->addMonths(5),
                'end_date' => now()->addMonths(5)->addDays(2),
                'registration_deadline' => now()->addMonths(5)->subWeeks(1),
                'status' => 'cancelled',
                'requires_verification' => false,
            ],
        ];

        foreach ($events as $eventData) {
            $sessionsData = $eventData['sessions'] ?? [];
            unset($eventData['sessions']);

            $event = Event::factory()->create($eventData);

            foreach ($sessionsData as $sessionData) {
                EventSession::factory()->create(array_merge($sessionData, [
                    'event_id' => $event->id,
                ]));
            }
        }
    }
}
