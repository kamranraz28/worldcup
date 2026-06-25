<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketAction;
use App\Models\WaitingList;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RegistrationSeeder extends Seeder
{
    public function run(): void
    {
        $events = Event::published()->get();
        $customers = Customer::factory(20)->create();
        $allCustomers = Customer::all();

        $statuses = ['confirmed', 'confirmed', 'confirmed', 'pending_approval', 'rejected', 'cancelled', 'redeemed'];

        foreach ($events as $event) {
            $registrations = min($allCustomers->count(), fake()->numberBetween(3, 8));

            for ($i = 0; $i < $registrations; $i++) {
                $customer = $allCustomers->random();
                $status = $statuses[array_rand($statuses)];

                $ticket = Ticket::factory()->create([
                    'event_id' => $event->id,
                    'customer_id' => $customer->id,
                    'ticket_type' => fake()->randomElement(['general', 'vip', 'general', 'general', 'comp']),
                    'status' => $status,
                    'registered_at' => now()->subDays(rand(0, 30)),
                ]);

                TicketAction::create([
                    'ticket_id' => $ticket->id,
                    'event_id' => $event->id,
                    'customer_id' => $customer->id,
                    'action' => 'registered',
                    'status_to' => $status === 'confirmed' ? 'confirmed' : 'pending_approval',
                    'actor_id' => null,
                    'notes' => 'Registration submitted',
                ]);

                if ($status === 'confirmed') {
                    Ticket::where('id', $ticket->id)->update([
                        'approved_at' => now()->subDays(rand(0, 5)),
                    ]);

                    TicketAction::create([
                        'ticket_id' => $ticket->id,
                        'event_id' => $event->id,
                        'customer_id' => $customer->id,
                        'action' => 'approved',
                        'status_from' => 'pending_approval',
                        'status_to' => 'confirmed',
                        'notes' => 'Auto-approved',
                    ]);
                }
            }

            if ($event->isFull()) {
                for ($i = 0; $i < 3; $i++) {
                    WaitingList::create([
                        'event_id' => $event->id,
                        'customer_id' => $allCustomers->random()->id,
                        'ticket_type' => 'general',
                        'status' => 'waiting',
                        'position' => $i + 1,
                    ]);
                }
            }
        }
    }
}
