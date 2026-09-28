<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\User;
use Tests\TestCase;

class TicketDownloadProbeTest extends TestCase
{
    public function test_download_and_view_routes(): void
    {
        $user = User::where('email', 'superadmin@synergyinterface.com')->firstOrFail();
        $ticket = Ticket::where('status', 'confirmed')->latest('id')->first()
            ?? Ticket::latest('id')->firstOrFail();

        $download = $this->actingAs($user)->get(route('tickets.download', $ticket->uuid));
        fwrite(STDERR, 'download_status=' . $download->getStatusCode() . ' type=' . $download->headers->get('Content-Type') . PHP_EOL);

        $show = $this->actingAs($user)->get(route('tickets.show', $ticket->uuid));
        fwrite(STDERR, 'show_status=' . $show->getStatusCode() . ' type=' . $show->headers->get('Content-Type') . PHP_EOL);
        if ($show->getStatusCode() >= 500) {
            fwrite(STDERR, 'show_body=' . substr($show->getContent(), 0, 500) . PHP_EOL);
        }

        $this->assertTrue(true);
    }
}
