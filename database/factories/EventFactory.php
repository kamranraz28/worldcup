<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $title = fake()->randomElement([
            'FIFA World Cup 2026 Final Viewing Party',
            'Semi-Final Live Screening',
            'Quarter-Final Fan Zone',
            'Toffee Champions Trophy Tour',
            'World Cup Opening Ceremony Watch Party',
            'Football Legends Meet & Greet',
            'Toffee Fan Park Experience',
            'World Cup Trophy Photo Opportunity',
        ]) . ' ' . fake()->year();

        return [
            'uuid' => (string) Str::uuid(),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(6),
            'description' => fake()->paragraphs(3, true),
            'event_type' => fake()->randomElement(['live', 'virtual', 'hybrid']),
            'venue_name' => fake()->randomElement([
                'Toffee Stadium', 'City Arena', 'Grand Convention Center',
                'Sports Complex', 'Beach Front Arena',
            ]),
            'venue_address' => fake()->address(),
            'venue_lat' => fake()->latitude(24.8, 25.5),
            'venue_lng' => fake()->longitude(67.0, 67.3),
            'max_capacity' => fake()->numberBetween(100, 5000),
            'ticket_price' => fake()->randomFloat(2, 0, 500),
            'start_date' => $start = fake()->dateTimeBetween('+1 week', '+6 months'),
            'end_date' => (clone $start)->modify('+' . fake()->numberBetween(2, 8) . ' hours'),
            'registration_deadline' => (clone $start)->modify('-2 days'),
            'banner_image' => null,
            'status' => fake()->randomElement(['draft', 'published', 'cancelled', 'completed']),
            'requires_verification' => fake()->boolean(80),
            'metadata' => json_encode([
                'parking_available' => fake()->boolean(),
                'food_allowed' => fake()->boolean(),
                'age_restriction' => fake()->randomElement([null, 12, 16, 18, 21]),
            ]),
            'created_by' => User::factory(),
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }

    public function upcoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'start_date' => $start = fake()->dateTimeBetween('+1 day', '+2 weeks'),
            'end_date' => (clone $start)->modify('+' . fake()->numberBetween(2, 6) . ' hours'),
            'registration_deadline' => (clone $start)->modify('-1 day'),
        ]);
    }

    public function free(): static
    {
        return $this->state(fn (array $attributes) => [
            'ticket_price' => 0,
        ]);
    }

    public function live(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_type' => 'live',
            'venue_name' => fake()->company() . ' Arena',
            'venue_address' => fake()->address(),
        ]);
    }
}
