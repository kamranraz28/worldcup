<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class EventCreateWithTemplateTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_event_with_template_and_qr_position(): void
    {
        $this->seed();
        $user = User::where('email', 'superadmin@synergyinterface.com')->firstOrFail();

        $tmp = tempnam(sys_get_temp_dir(), 'tpl') . '.pdf';
        $fpdf = new \FPDF('P', 'mm', 'A4');
        $fpdf->AddPage();
        $fpdf->SetFont('Helvetica', 'B', 14);
        $fpdf->Text(60, 100, 'TEST TICKET');
        file_put_contents($tmp, $fpdf->Output('S'));

        $response = $this->actingAs($user)->post('/events', [
            'title' => 'Template Event ' . Str::random(5),
            'description' => 'Test description',
            'event_type' => 'live',
            'venue_name' => 'Test Venue',
            'max_capacity' => '100',
            'ticket_price' => '10.50',
            'start_date' => '2026-10-01T18:00',
            'end_date' => '2026-10-01T22:00',
            'registration_deadline' => '2026-09-30T18:00',
            'status' => 'draft',
            'requires_verification' => '1',
            'ticket_template' => new \Illuminate\Http\UploadedFile($tmp, 'template.pdf', 'application/pdf', null, true),
            'qr_x' => '140.5',
            'qr_y' => '180.2',
            'qr_size' => '35',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $event = Event::where('title', 'like', 'Template Event %')->first();
        $this->assertNotNull($event, 'Event was not created.');
        $this->assertNotNull($event->ticket_template_path, 'Template path not saved.');
        $this->assertSame(140.5, (float) $event->qr_x);
        $this->assertSame(180.2, (float) $event->qr_y);
        $this->assertSame(35, (float) $event->qr_size);
        $this->assertFileExists(storage_path('app/public/' . $event->ticket_template_path));
    }

    public function test_creates_event_without_template(): void
    {
        $this->seed();
        $user = User::where('email', 'superadmin@synergyinterface.com')->firstOrFail();

        $response = $this->actingAs($user)->post('/events', [
            'title' => 'No Template Event ' . Str::random(5),
            'description' => 'Test',
            'event_type' => 'virtual',
            'start_date' => '2026-10-01T18:00',
            'end_date' => '2026-10-01T22:00',
            'status' => 'draft',
        ]);

        $response->assertSessionHasNoErrors();

        dump([
            'status' => $response->getStatusCode(),
            'redirect' => $response->headers->get('Location'),
            'eventCount' => Event::count(),
            'allTitles' => Event::pluck('title')->toArray(),
        ]);

        $event = Event::where('title', 'like', 'No Template Event %')->first();
        $this->assertNotNull($event);
        $this->assertNull($event->ticket_template_path);
    }
}