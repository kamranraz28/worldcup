<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\CustomerVerification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CustomerVerificationFactory extends Factory
{
    protected $model = CustomerVerification::class;

    public function definition(): array
    {
        $status = fake()->randomElement(['pending', 'in_review', 'verified', 'rejected', 'flagged']);

        return [
            'customer_id' => Customer::factory(),
            'uuid' => (string) Str::uuid(),
            'verification_type' => fake()->randomElement(['identity', 'address', 'age', 'ticket_eligibility']),
            'status' => $status,
            'document_front' => 'verification-docs/' . Str::random(20) . '.jpg',
            'document_back' => fake()->boolean(70) ? 'verification-docs/' . Str::random(20) . '.jpg' : null,
            'selfie_image' => fake()->boolean(80) ? 'verification-docs/' . Str::random(20) . '.jpg' : null,
            'ocr_data' => json_encode([
                'full_name' => fake()->name(),
                'document_number' => strtoupper(Str::random(10)),
                'date_of_birth' => fake()->date(),
                'nationality' => fake()->country(),
                'issue_date' => fake()->date(),
                'expiry_date' => fake()->dateTimeBetween('+1 year', '+10 years')->format('Y-m-d'),
            ]),
            'confidence_score' => fake()->randomFloat(2, 0.6, 1),
            'reviewed_by' => in_array($status, ['verified', 'rejected', 'flagged'])
                ? User::factory()
                : null,
            'reviewed_at' => in_array($status, ['verified', 'rejected']) ? now()->subHours(rand(1, 48)) : null,
            'rejection_reason' => $status === 'rejected' ? fake()->randomElement([
                'Document is blurry, please upload a clearer image.',
                'Document number does not match provided information.',
                'Selfie does not match document photo.',
                'Document has expired.',
                'Unable to verify authenticity of document.',
            ]) : null,
            'verification_metadata' => json_encode([
                'source' => fake()->randomElement(['web', 'mobile', 'api']),
                'ip_address' => fake()->ipv4(),
                'attempts' => 1,
            ]),
            'expires_at' => $status === 'verified' ? now()->addYear() : null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'reviewed_by' => null,
            'reviewed_at' => null,
            'rejection_reason' => null,
        ]);
    }

    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'verified',
            'reviewed_by' => User::factory(),
            'reviewed_at' => now()->subHours(rand(1, 24)),
            'confidence_score' => fake()->randomFloat(2, 0.85, 1),
            'expires_at' => now()->addYear(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'reviewed_by' => User::factory(),
            'reviewed_at' => now()->subHours(rand(1, 24)),
            'rejection_reason' => 'Document is blurry, please upload a clearer image.',
        ]);
    }
}
