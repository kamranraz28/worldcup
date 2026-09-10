<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\User;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use chillerlan\QRCode\Output\QRGdImagePNG;
use Illuminate\Foundation\Testing\RefreshDatabase;
use setasign\Fpdi\Fpdi;
use Tests\TestCase;

class TicketTemplateTest extends TestCase
{
    use RefreshDatabase;

    public function test_uploads_template_and_downloads_stamped_pdf(): void
    {
        $this->seed();
        $user = User::where('email', 'superadmin@synergyinterface.com')->firstOrFail();

        // 1. Create an event
        $event = Event::factory()->published()->create();

        // 2. Build a sample template PDF with Fpdi/Fpdf
        $tmp = tempnam(sys_get_temp_dir(), 'tpl') . '.pdf';
        $fpdf = new \FPDF('L', 'mm', [100, 54]);
        $fpdf->AddPage();
        $fpdf->SetFont('Helvetica', 'B', 12);
        $fpdf->SetTextColor(20, 20, 20);
        $fpdf->SetFillColor(240, 245, 250);
        $fpdf->Rect(0, 0, 100, 54, 'F');
        $fpdf->SetXY(6, 4);
        $fpdf->Text(0, 10, (string) 'TEMPLATE TICKET');
        $fpdf->SetFont('Helvetica', '', 9);
        $fpdf->Text(6, 18, 'QR AREA BELOW');

        file_put_contents($tmp, $fpdf->Output('S'));
        $this->assertFileExists($tmp);

        // 3. Upload via the endpoint (resampling the file as UploadedFile)
        $response = $this->actingAs($user)->post("/events/{$event->uuid}/ticket-template", [
            'template' => new \Illuminate\Http\UploadedFile($tmp, 'template.pdf', 'application/pdf', null, true),
            'qr_x' => 10,
            'qr_y' => 30,
            'qr_size' => 40,
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $event->refresh();
        $this->assertNotNull($event->ticket_template_path);
        $this->assertFileExists(storage_path('app/public/' . $event->ticket_template_path));

        // 4. Create a ticket and verify stamping generates a PDF
        $ticket = Ticket::factory()->create([
            'event_id' => $event->id,
            'status' => 'confirmed',
        ]);

        app(\App\Services\PdfTicketService::class)->generate($ticket);

        // 5. Assert PDF contains the QR image and that the resulting content is a valid PDF
        //    We re-generate from the template to test content-level validity:
        $service = app(\App\Services\PdfTicketService::class);
        $content = $service->generate($ticket);

        $this->assertStringStartsWith('%PDF', $content);

        // 6. Now stamp-free check: content includes a QR image
        // (FPDI with PNG embeds an image object)
        $this->assertStringContainsString('image', strtolower($content));
    }
}
