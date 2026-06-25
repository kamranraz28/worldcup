<?php

namespace Database\Factories;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CampaignFactory extends Factory
{
    protected $model = Campaign::class;

    public function definition(): array
    {
        $title = fake()->randomElement([
            'World Cup Loyalty Rewards',
            'Refer a Friend – Win Tickets',
            'Match Predictor Challenge',
            'Ultimate Fan Contest',
            'Photo of the Day Competition',
            'Trivia Championship',
            'Toffee Points Booster',
            'Early Bird Special',
        ]);

        return [
            'uuid' => (string) Str::uuid(),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(6),
            'description' => fake()->paragraphs(2, true),
            'campaign_type' => fake()->randomElement(['loyalty', 'referral', 'engagement', 'contest', 'promotion']),
            'start_date' => fake()->dateTimeBetween('-1 month', '+1 month'),
            'end_date' => fake()->dateTimeBetween('+2 months', '+8 months'),
            'reward_type' => fake()->randomElement(['points', 'ticket', 'merchandise', 'coupon', 'cashback']),
            'reward_value' => fake()->randomFloat(2, 50, 5000),
            'total_budget' => fake()->randomFloat(2, 10000, 500000),
            'total_participants' => fake()->numberBetween(0, 5000),
            'max_participants' => fake()->optional(0.3)->numberBetween(100, 10000),
            'rules' => json_encode([
                'min_age' => 18,
                'nationality' => 'any',
                'max_entries_per_user' => 1,
            ]),
            'status' => fake()->randomElement(['draft', 'active', 'paused', 'completed', 'cancelled']),
            'created_by' => User::factory(),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'start_date' => now()->subDays(rand(1, 10)),
            'end_date' => now()->addMonths(rand(1, 3)),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'start_date' => now()->subMonths(2),
            'end_date' => now()->subWeek(),
        ]);
    }
}
