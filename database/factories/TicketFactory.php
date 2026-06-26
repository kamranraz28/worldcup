<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        $price = fake()->randomElement([0, 500, 1000, 2500, 5000, 10000]);

        return [
            'uuid' => (string) Str::uuid(),
            'event_id' => Event::factory(),
            'event_session_id' => null,
            'customer_id' => Customer::factory(),
            'user_id' => null,
            'ticket_type' => fake()->randomElement(['general', 'vip', 'vvip', 'comp', 'staff']),
            'price' => $price,
            'currency' => 'BDT',
            'status' => fake()->randomElement(['reserved', 'confirmed', 'cancelled', 'redeemed', 'expired']),
            'qr_code' => (string) Str::uuid(),
            'qr_code_path' => null,
            'checked_in_at' => null,
            'checked_in_by' => null,
            'reserved_until' => now()->addHours(2),
            'metadata' => json_encode([
                'purchased_at' => now()->toIso8601String(),
                'transfer_count' => 0,
            ]),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
            'reserved_until' => null,
        ]);
    }

    public function redeemed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'redeemed',
            'checked_in_at' => now(),
        ]);
    }

    public function vip(): static
    {
        return $this->state(fn (array $attributes) => [
            'ticket_type' => 'vip',
            'price' => 5000,
        ]);
    }

    public function free(): static
    {
        return $this->state(fn (array $attributes) => [
            'ticket_type' => 'comp',
            'price' => 0,
        ]);
    }
}
