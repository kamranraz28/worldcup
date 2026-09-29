<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Role;
use App\Models\Ticket;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScannerAssignmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    private function event(string $title = 'Event'): Event
    {
        return Event::factory()->create([
            'title' => $title,
            'status' => 'published',
            'ticket_price' => 0,
            'start_date' => now()->addDay(),
            'end_date' => now()->addDays(2),
            'requires_verification' => false,
        ]);
    }

    private function admin(): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', 'super-admin')->value('id'),
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
    }

    private function scanner(array $eventIds = []): User
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'checkin-staff')->value('id'),
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        if ($eventIds) {
            $user->assignedEvents()->sync($eventIds);
        }

        return $user;
    }

    public function test_admin_can_create_scanner_with_multiple_events(): void
    {
        $admin = $this->admin();
        $e1 = $this->event('A');
        $e2 = $this->event('B');

        $this->actingAs($admin)->post(route('scanners.store'), [
            'name' => 'Gate Scanner',
            'email' => 'gate@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'is_active' => true,
            'event_ids' => [$e1->id, $e2->id],
        ])->assertRedirect(route('scanners.index'));

        $scanner = User::where('email', 'gate@example.com')->firstOrFail();
        $this->assertSame('checkin-staff', $scanner->role->name);
        $this->assertEqualsCanonicalizing([$e1->id, $e2->id], $scanner->assignedEvents()->pluck('events.id')->all());
    }

    public function test_scanner_can_only_see_assigned_events_in_dropdown(): void
    {
        $assigned = $this->event('Assigned');
        $other = $this->event('Other');
        $scanner = $this->scanner([$assigned->id]);

        $ids = app(\App\Services\CheckInService::class)
            ->getEventsForDropdown($scanner)
            ->pluck('id');

        $this->assertTrue($ids->contains($assigned->id));
        $this->assertFalse($ids->contains($other->id));
    }

    public function test_admin_sees_all_events_in_dropdown(): void
    {
        $this->event('A');
        $this->event('B');
        $admin = $this->admin();

        $this->assertSame(2, app(\App\Services\CheckInService::class)->getEventsForDropdown($admin)->count());
    }

    public function test_scanner_cannot_scan_unassigned_event(): void
    {
        $assigned = $this->event('Assigned');
        $other = $this->event('Other');
        $scanner = $this->scanner([$assigned->id]);

        $ticket = Ticket::create([
            'uuid' => (string) \Illuminate\Support\Str::uuid(),
            'event_id' => $other->id,
            'ticket_type' => 'general',
            'price' => 0,
            'currency' => 'BDT',
            'status' => 'confirmed',
            'qr_code' => (string) \Illuminate\Support\Str::uuid(),
        ]);

        $this->actingAs($scanner)
            ->postJson(route('checkin.scan'), ['qr_code' => $ticket->qr_code, 'event_id' => $other->id])
            ->assertStatus(403);
    }

    public function test_scanner_can_scan_assigned_event(): void
    {
        $assigned = $this->event('Assigned');
        $scanner = $this->scanner([$assigned->id]);

        $ticket = Ticket::create([
            'uuid' => (string) \Illuminate\Support\Str::uuid(),
            'event_id' => $assigned->id,
            'ticket_type' => 'general',
            'price' => 0,
            'currency' => 'BDT',
            'status' => 'confirmed',
            'qr_code' => (string) \Illuminate\Support\Str::uuid(),
        ]);

        $response = $this->actingAs($scanner)
            ->postJson(route('checkin.scan'), ['qr_code' => $ticket->qr_code, 'event_id' => $assigned->id]);

        $this->assertNotSame(403, $response->status());
        $this->assertNotSame('EVENT_FORBIDDEN', $response->json('code'));
    }
}
