<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class EventCreateTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_event_via_form_endpoint(): void
    {
        $this->seed();
        $user = User::where('email', 'superadmin@synergyinterface.com')->firstOrFail();

        $response = $this->actingAs($user)->post('/events', [
            'title' => 'Backend Test Event ' . Str::random(5),
            'description' => 'Test description',
            'event_type' => 'live',
            'venue_name' => 'Test Venue',
            'venue_address' => '123 Test St',
            'max_capacity' => '100',
            'ticket_price' => '10.50',
            'start_date' => '2026-10-01T18:00',
            'end_date' => '2026-10-01T22:00',
            'registration_deadline' => '2026-09-30T18:00',
            'status' => 'published',
            'requires_verification' => '1',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseHas('events', ['event_type' => 'live', 'max_capacity' => 100]);
    }
}
