<?php

namespace Database\Factories;

use App\Models\EventSession;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventSessionFactory extends Factory
{
    protected $model = EventSession::class;

    public function definition(): array
    {
        $start = fake()->dateTimeBetween('+1 week', '+3 months');

        return [
            'title' => fake()->randomElement([
                'Main Session', 'Morning Session', 'Afternoon Session',
                'Opening Keynote', 'Workshop', 'Panel Discussion',
                'Networking Break', 'Closing Ceremony',
            ]),
            'start_time' => $start,
            'end_time' => (clone $start)->modify('+' . fake()->numberBetween(1, 4) . ' hours'),
            'capacity' => fake()->optional(0.7)->numberBetween(50, 1000),
            'location' => fake()->optional(0.8)->randomElement([
                'Main Hall', 'Room A', 'Room B', 'Conference Room 1',
                'Outdoor Stage', 'VIP Lounge', 'Virtual Room 1',
            ]),
        ];
    }

    public function virtual(): self
    {
        return $this->state(fn (array $attributes) => [
            'location' => null,
            'capacity' => fake()->numberBetween(100, 10000),
        ]);
    }
}
