<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Ticket;
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
        ], $overrides));
    }

    private function guestPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Mashrafe Rahman',
            'email' => 'guest@example.com',
            'phone' => '01712345678',
        ], $overrides);
    }

    public function test_early_price_is_charged_before_the_early_deadline(): void
    {
        $event = $this->makeEvent();

        $this->post(route('events.public.register.store', $event->uuid), $this->guestPayload())
            ->assertRedirect();

        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();
        $this->assertSame('100.00', $ticket->price);
        $this->assertSame('reserved', $ticket->status);
    }

    public function test_regular_price_is_charged_after_the_early_deadline(): void
    {
        $event = $this->makeEvent(['early_booking_deadline' => now()->subDay()]);

        $this->post(route('events.public.register.store', $event->uuid), $this->guestPayload())
            ->assertRedirect(route('payment.initiate', ['uuid' => Ticket::where('event_id', $event->id)->first()->uuid]));

        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();
        $this->assertSame('200.00', $ticket->price);
    }

    public function test_registration_is_blocked_after_the_booking_deadline(): void
    {
        $event = $this->makeEvent(['registration_deadline' => now()->subDay()]);

        $this->from(route('events.public.show', $event->uuid))
            ->post(route('events.public.register.store', $event->uuid), $this->guestPayload())
            ->assertRedirect(route('events.public.show', $event->uuid));

        $this->assertSame(0, Ticket::where('event_id', $event->id)->count());
    }
}