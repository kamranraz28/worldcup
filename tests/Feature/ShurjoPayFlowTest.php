<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Ticket;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ShurjoPayFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_paid_registration_redirects_through_payment_gateway(): void
    {
        $event = Event::factory()->create([
            'status' => 'published',
            'ticket_price' => 100,
            'registration_deadline' => now()->addDays(2),
            'start_date' => now()->addDays(5),
            'end_date' => now()->addDays(6),
        ]);

        Http::fake([
            '*/get_token' => Http::response([
                'token' => 'test-token',
                'store_id' => 1,
                'execute_url' => 'https://engine.shurjopayment.com/api/secret-pay',
            ], 200),
            '*/secret-pay' => Http::response([
                'sp_code' => '200',
                'sp_message' => 'Success',
                'sp_order_id' => 'SILTESTORDER1',
                'checkout_url' => 'https://securepay.shurjopayment.com/spaycheckout?token=abc',
            ], 200),
        ]);

        $this->post(route('events.public.register.store', $event->uuid), [
            'name' => 'Guest User',
            'email' => 'guest@example.com',
            'phone' => '01712345678',
        ])->assertRedirect();

        $ticket = Ticket::where('event_id', $event->id)->firstOrFail();
        $this->assertSame('reserved', $ticket->status);

        $this->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => \Inertia\Inertia::getVersion(),
        ])
            ->get(route('payment.initiate', $ticket->uuid))
            ->assertStatus(409)
            ->assertHeader('X-Inertia-Location', 'https://securepay.shurjopayment.com/spaycheckout?token=abc');
    }
}