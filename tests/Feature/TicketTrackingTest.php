<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Event;
use App\Models\Ticket;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TicketTrackingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    private function attendee(string $phone, string $email = 'guest@example.com'): Customer
    {
        return Customer::create([
            'uuid' => (string) Str::uuid(),
            'first_name' => 'Guest',
            'last_name' => 'User',
            'email' => $email,
            'phone' => $phone,
        ]);
    }

    private function ticket(Event $event, Customer $customer, string $status = 'confirmed'): Ticket
    {
        return Ticket::create([
            'uuid' => (string) Str::uuid(),
            'event_id' => $event->id,
            'customer_id' => $customer->id,
            'ticket_type' => 'general',
            'price' => 100,
            'currency' => 'BDT',
            'status' => $status,
            'qr_code' => (string) Str::uuid(),
            'registered_at' => now(),
        ]);
    }

    public function test_tracking_page_renders(): void
    {
        $this->get(route('track-tickets'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Public/TrackTickets'));
    }

    public function test_it_finds_every_ticket_for_a_phone_number_regardless_of_formatting(): void
    {
        $customer = $this->attendee('01712345678');
        $eventA = Event::factory()->published()->create();
        $eventB = Event::factory()->published()->create();

        $this->ticket($eventA, $customer);
        $this->ticket($eventB, $customer);

        // A different guest must not leak into the results.
        $this->ticket(Event::factory()->published()->create(), $this->attendee('01999999999', 'other@example.com'));

        $this->post(route('track-tickets.search'), ['phone' => '+8801712345678'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/TrackTickets')
                ->has('tickets', 2)
                ->has('downloadAllUrl')
                ->where('tickets.0.download_url', fn ($url) => str_contains($url, 'signature='))
            );
    }

    public function test_unconfirmed_tickets_are_not_tracked(): void
    {
        $customer = $this->attendee('01712345678');
        $event = Event::factory()->published()->create();

        $this->ticket($event, $customer, 'reserved');
        $this->ticket($event, $customer, 'cancelled');

        $this->post(route('track-tickets.search'), ['phone' => '01712345678'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('tickets', 0));
    }

    public function test_invalid_phone_number_is_rejected(): void
    {
        $this->from(route('track-tickets'))
            ->post(route('track-tickets.search'), ['phone' => 'not-a-phone'])
            ->assertRedirect(route('track-tickets'))
            ->assertSessionHasErrors('phone');
    }

    public function test_legacy_landline_format_numbers_are_also_accepted(): void
    {
        // Pre-dates the mobile-only registration rule — padded with spaces.
        $customer = $this->attendee('02 9661 2345');
        $event = Event::factory()->published()->create();
        $this->ticket($event, $customer);

        $this->post(route('track-tickets.search'), ['phone' => '0296612345'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('tickets', 1));
    }

    public function test_ticket_download_requires_a_valid_signature(): void
    {
        $customer = $this->attendee('01712345678');
        $ticket = $this->ticket(Event::factory()->published()->create(), $customer);

        // Unsigned request is rejected outright.
        $this->get(route('tickets.public.download', ['uuid' => $ticket->uuid]))
            ->assertForbidden();
    }

    public function test_a_signed_link_downloads_the_ticket_pdf(): void
    {
        $customer = $this->attendee('01712345678');
        $ticket = $this->ticket(Event::factory()->published()->create(), $customer);

        $signed = URL::temporarySignedRoute('tickets.public.download', now()->addMinutes(10), [
            'uuid' => $ticket->uuid,
        ]);

        $response = $this->get($signed);
        $response->assertOk();
        $this->assertStringContainsString('pdf', (string) $response->headers->get('content-type'));
    }

    public function test_download_all_requires_a_valid_signature(): void
    {
        $this->get(route('tickets.public.download-all', ['uuids' => (string) Str::uuid()]))
            ->assertForbidden();
    }
}