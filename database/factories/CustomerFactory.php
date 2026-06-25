<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        return [
            'uuid' => (string) Str::uuid(),
            'user_id' => null,
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->unique()->phoneNumber(),
            'date_of_birth' => fake()->date('Y-m-d', '2004-12-31'),
            'nationality' => fake()->randomElement(['PAK', 'UAE', 'IND', 'USA', 'GBR', 'SAU']),
            'document_type' => fake()->randomElement(['passport', 'national_id', 'drivers_license']),
            'document_number' => fake()->unique()->regexify('[A-Z0-9]{10,15}'),
            'metadata' => null,
            'is_verified' => false,
            'verified_at' => null,
            'last_participated_at' => null,
        ];
    }

    public function linkedToUser(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => User::factory(),
        ]);
    }

    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => true,
            'verified_at' => now()->subDays(rand(1, 30)),
        ]);
    }
}
