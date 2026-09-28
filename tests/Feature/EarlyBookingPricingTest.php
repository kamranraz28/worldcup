<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EarlyBookingPricingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    private function makeEvent(array $overrides = []): Event
    {
        return Event::factory()->create(array_merge([
            'status' => 'published',
            'ticket_price' => 200,
            'early_booking_price' => 100,
            'early_booking_deadline' => now()->addDays(2),
            'registration_deadline' => now()->addDays(5),
            'start_date' => now()->addDays(10),
            'end_date' => now()->addDays(11),
            'requires_verification' => true,
        ], $overrides));
    }

    public function test_early_price_is_charged_before_the_early_deadline(): void
    {
        $user = User::factory()->create(['email_verified_at' => now(), 'is_active' => true]);
        $event = $this->makeEvent();

        $this->actingAs($user)
            ->post(route('customer.events.register.store', $event->uuid), ['ticket_type' => 'general'])
            ->assertRedirect();

        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();
        $this->assertSame('100.00', $ticket->price);
    }

    public function test_regular_price_is_charged_after_the_early_deadline(): void
    {
        $user = User::factory()->create(['email_verified_at' => now(), 'is_active' => true]);
        $event = $this->makeEvent(['early_booking_deadline' => now()->subDay()]);

        $this->actingAs($user)
            ->post(route('customer.events.register.store', $event->uuid), ['ticket_type' => 'general'])
            ->assertRedirect();

        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();
        $this->assertSame('200.00', $ticket->price);
    }

    public function test_registration_is_blocked_after_the_booking_deadline(): void
    {
        $user = User::factory()->create(['email_verified_at' => now(), 'is_active' => true]);
        $event = $this->makeEvent(['registration_deadline' => now()->subDay()]);

        $this->actingAs($user)
            ->from(route('events.public.show', $event->uuid))
            ->post(route('customer.events.register.store', $event->uuid), ['ticket_type' => 'general'])
            ->assertRedirect(route('events.public.show', $event->uuid));

        $this->assertSame(0, Ticket::where('event_id', $event->id)->count());
    }
}
