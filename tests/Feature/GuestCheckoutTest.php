<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Event;
use App\Models\Ticket;
use App\Notifications\TicketConfirmation;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

/**
 * Guest checkout: no account, pay (or not) — complete or nothing.
 */
class GuestCheckoutTest extends TestCase
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
            'ticket_price' => 100,
            'registration_deadline' => now()->addDays(5),
            'start_date' => now()->addDays(10),
            'end_date' => now()->addDays(11),
        ], $overrides));
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Mashrafe Rahman',
            'email' => 'guest@example.com',
            'phone' => '01712345678',
        ], $overrides);
    }

    private function fakeGateway(array $overrides = []): void
    {
        Http::fake(array_merge([
            '*/get_token' => Http::response([
                'token' => 'test-token',
                'store_id' => 1,
                'execute_url' => 'https://engine.shurjopayment.com/api/secret-pay',
            ], 200),
            '*/secret-pay' => Http::response([
                'sp_code' => '200',
                'sp_message' => 'Success',
                'sp_order_id' => 'SIL-GUEST-1',
                'checkout_url' => 'https://securepay.shurjopayment.com/spaycheckout?token=abc',
            ], 200),
            '*/verification' => Http::response([
                'transactionStatus' => 'Success',
                'sp_tx_id' => 'TX-1',
            ], 200),
        ], $overrides));
    }

    public function test_guest_registers_with_minimum_info_and_reaches_payment(): void
    {
        $event = $this->makeEvent();

        $this->post(route('events.public.register.store', $event->uuid), $this->payload())
            ->assertRedirect();

        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();
        $this->assertSame('reserved', $ticket->status);
        $this->assertNotNull($ticket->reserved_until);
        $this->assertNull($ticket->user_id);

        $customer = $ticket->customer;
        $this->assertNotNull($customer);
        $this->assertSame('guest@example.com', $customer->email);
        $this->assertSame('Mashrafe Rahman', $customer->full_name);
        $this->assertSame('01712345678', $customer->phone_normalized);
    }

    public function test_cancelled_payment_removes_the_registration_entirely(): void
    {
        $event = $this->makeEvent();

        $this->post(route('events.public.register.store', $event->uuid), $this->payload());

        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();

        $this->get(route('payment.cancel', $ticket->uuid))
            ->assertRedirect(route('tickets.public.failed'));

        $this->assertDatabaseMissing('tickets', ['uuid' => $ticket->uuid]);
        $this->assertSame(0, Customer::count());
        $this->assertSame(1, Customer::withTrashed()->count());
    }

    public function test_successful_payment_confirms_the_ticket(): void
    {
        $this->fakeGateway();
        $event = $this->makeEvent();

        $this->post(route('events.public.register.store', $event->uuid), $this->payload());
        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();

        // Kick off checkout so the order id is stored, then come back "from" the gateway.
        $this->get(route('payment.initiate', $ticket->uuid));

        $orderId = data_get($ticket->fresh()->metadata, 'payment.sp_order_id');
        $this->assertNotNull($orderId);

        $this->get(route('payment.return', ['sp_order_id' => $orderId]))
            ->assertRedirect(route('tickets.public.success', ['uuid' => $ticket->uuid]));

        $ticket->refresh();
        $this->assertSame('confirmed', $ticket->status);
        $this->assertNull($ticket->reserved_until);
        $this->assertTrue((bool) data_get($ticket->metadata, 'payment.verified'));
    }

    public function test_payment_return_accepts_the_gateway_order_id_parameter(): void
    {
        $this->fakeGateway();
        $event = $this->makeEvent();

        $this->post(route('events.public.register.store', $event->uuid), $this->payload());
        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();
        $this->get(route('payment.initiate', $ticket->uuid));

        $orderId = data_get($ticket->fresh()->metadata, 'payment.sp_order_id');

        // ShurjoPay actually redirects the return URL with 'order_id=…'.
        $this->get(route('payment.return', ['order_id' => $orderId]))
            ->assertRedirect(route('tickets.public.success', ['uuid' => $ticket->uuid]));

        $this->assertSame('confirmed', $ticket->fresh()->status);
    }

    public function test_failed_payment_removes_the_registration_entirely(): void
    {
        $this->fakeGateway([
            '*/verification' => Http::response(['transactionStatus' => 'Failed'], 200),
        ]);
        $event = $this->makeEvent();

        $this->post(route('events.public.register.store', $event->uuid), $this->payload());
        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();

        $this->get(route('payment.initiate', $ticket->uuid));
        $orderId = data_get($ticket->fresh()->metadata, 'payment.sp_order_id');

        $this->get(route('payment.return', ['sp_order_id' => $orderId]))
            ->assertRedirect(route('tickets.public.failed'));

        $this->assertDatabaseMissing('tickets', ['uuid' => $ticket->uuid]);
    }

    public function test_free_event_issues_the_ticket_without_payment(): void
    {
        Notification::fake();
        $event = $this->makeEvent(['ticket_price' => 0]);

        $this->post(route('events.public.register.store', $event->uuid), $this->payload())
            ->assertRedirect(route('tickets.public.success', [
                'uuid' => Ticket::where('event_id', $event->id)->firstOrFail()->uuid,
            ]));

        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();
        $this->assertSame('confirmed', $ticket->status);
        $this->assertSame('0.00', $ticket->price);
        $this->assertNull($ticket->reserved_until);
        $this->assertNotNull($ticket->approved_at);
        $this->assertNull($ticket->user_id);

        // No payment asked — the ticket email goes out right away.
        Notification::assertSentOnDemand(TicketConfirmation::class);
    }

    public function test_failed_checkout_removes_the_registration(): void
    {
        Http::fake(['*' => Http::response([], 500)]);
        $event = $this->makeEvent();

        $this->post(route('events.public.register.store', $event->uuid), $this->payload());
        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();

        $this->get(route('payment.initiate', $ticket->uuid))
            ->assertRedirect(route('tickets.public.failed'));

        $this->assertDatabaseMissing('tickets', ['uuid' => $ticket->uuid]);
    }

    public function test_abandoned_reservations_are_pruned(): void
    {
        $event = $this->makeEvent();

        $this->post(route('events.public.register.store', $event->uuid), $this->payload());
        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();

        // Simulate the 2-hour payment window lapsing.
        $ticket->forceFill(['reserved_until' => now()->subMinute()])->save();

        $this->artisan('tickets:prune-abandoned')->assertSuccessful();

        $this->assertDatabaseMissing('tickets', ['uuid' => $ticket->uuid]);
        $this->assertSame(0, Customer::count());
        $this->assertSame(1, Customer::withTrashed()->count());
    }

    public function test_an_attendee_who_still_has_tickets_is_kept_when_one_is_discarded(): void
    {
        $eventA = $this->makeEvent();
        $eventB = $this->makeEvent();

        $this->post(route('events.public.register.store', $eventA->uuid), $this->payload());
        $this->post(route('events.public.register.store', $eventB->uuid), $this->payload());

        $this->assertSame(1, Customer::count());

        $abandoned = Ticket::where('event_id', $eventB->id)->firstOrFail();
        $this->get(route('payment.cancel', $abandoned->uuid));

        // The surviving ticket keeps the attendee on the list.
        $this->assertDatabaseMissing('tickets', ['uuid' => $abandoned->uuid]);
        $this->assertSame(1, Ticket::count());
        $this->assertSame(1, Customer::count());
        $this->assertSame(0, Customer::onlyTrashed()->count());
    }
}