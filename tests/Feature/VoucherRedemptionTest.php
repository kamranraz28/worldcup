<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\Voucher;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VoucherRedemptionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    private function makeEvent(): Event
    {
        return Event::factory()->create([
            'status' => 'published',
            'ticket_price' => 200,
            'early_booking_price' => null,
            'early_booking_deadline' => null,
            'registration_deadline' => now()->addDays(5),
            'start_date' => now()->addDays(10),
            'end_date' => now()->addDays(11),
        ]);
    }

    private function makeVoucher(array $overrides = []): Voucher
    {
        return Voucher::create(array_merge([
            'code' => 'TEST15',
            'discount_percent' => 15,
            'max_uses' => 10,
            'used_count' => 0,
            'is_active' => true,
        ], $overrides));
    }

    private function guestPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Guest User',
            'email' => 'guest@example.com',
            'phone' => '01712345678',
        ], $overrides);
    }

    public function test_partial_discount_is_applied_and_usage_recorded(): void
    {
        $event = $this->makeEvent();
        $voucher = $this->makeVoucher();

        $this->post(route('events.public.register.store', $event->uuid), $this->guestPayload([
            'voucher_code' => 'test15',
        ]))->assertRedirect(route('payment.initiate', ['uuid' => Ticket::where('event_id', $event->id)->first()->uuid]));

        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();
        $this->assertSame('170.00', $ticket->price);
        $this->assertSame('30.00', $ticket->discount_amount);
        $this->assertSame($voucher->id, $ticket->voucher_id);
        $this->assertSame('reserved', $ticket->status);
        $this->assertSame(1, $voucher->fresh()->used_count);
    }

    public function test_full_discount_books_without_payment_gateway(): void
    {
        $event = $this->makeEvent();
        $voucher = $this->makeVoucher(['code' => 'FREE100', 'discount_percent' => 100, 'max_uses' => 5]);

        $this->post(route('events.public.register.store', $event->uuid), $this->guestPayload([
            'voucher_code' => 'FREE100',
        ]))->assertRedirect(route('tickets.public.success', ['uuid' => Ticket::where('event_id', $event->id)->first()->uuid]));

        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();
        $this->assertSame('0.00', $ticket->price);
        $this->assertSame('confirmed', $ticket->status);
        $this->assertNotNull($ticket->approved_at);
        $this->assertSame(1, $voucher->fresh()->used_count);
    }

    public function test_usage_cap_is_enforced(): void
    {
        $event = $this->makeEvent();
        $voucher = $this->makeVoucher(['code' => 'ONCE', 'discount_percent' => 100, 'max_uses' => 1]);

        $this->post(route('events.public.register.store', $event->uuid), $this->guestPayload([
            'voucher_code' => 'ONCE',
        ]))->assertRedirect();

        $this->assertSame(1, $voucher->fresh()->used_count);

        $this->from(route('events.public.show', $event->uuid))
            ->post(route('events.public.register.store', $event->uuid), $this->guestPayload([
                'voucher_code' => 'ONCE',
            ]))
            ->assertRedirect(route('events.public.show', $event->uuid));

        $this->assertSame(1, $voucher->fresh()->used_count);
        $this->assertSame(1, Ticket::where('event_id', $event->id)->count());
    }

    public function test_invalid_voucher_is_rejected(): void
    {
        $event = $this->makeEvent();

        $this->from(route('events.public.show', $event->uuid))
            ->post(route('events.public.register.store', $event->uuid), $this->guestPayload([
                'voucher_code' => 'NOPE',
            ]))
            ->assertRedirect(route('events.public.show', $event->uuid));

        $this->assertSame(0, Ticket::where('event_id', $event->id)->count());
    }
}