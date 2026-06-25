<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketConfirmation extends Notification
{
    use Queueable;

    private $ticket;
    private $pdfPath;

    public function __construct(Ticket $ticket, string $pdfPath = null)
    {
        $this->ticket = $ticket;
        $this->pdfPath = $pdfPath;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $event = $this->ticket->event;
        $customer = $this->ticket->customer;

        $mail = (new MailMessage)
            ->subject('Your Ticket for ' . ($event->title ?? 'Event') . ' — Confirmed')
            ->greeting('Hello ' . ($customer->first_name ?? 'Valued Customer') . '!')
            ->line('Your ticket has been confirmed for the following event:')
            ->line('**' . $event->title . '**')
            ->line('')
            ->line('📅 **Date:** ' . ($event->start_date ? $event->start_date->format('l, F j, Y') : 'TBD'))
            ->line('⏰ **Time:** ' . ($event->start_date ? $event->start_date->format('g:i A') : 'TBD'))
            ->line('📍 **Venue:** ' . ($event->venue_name ?? 'TBD'))
            ->line('🎫 **Ticket Type:** ' . ucfirst($this->ticket->ticket_type))
            ->line('🆔 **Ticket Code:** ' . $this->ticket->qr_code)
            ->line('')
            ->line('Please find your e-ticket attached. You can also download it anytime from your dashboard.')
            ->action('View Ticket', url('/tickets/' . $this->ticket->uuid))
            ->line('')
            ->line('Thank you for choosing Toffee!')
            ->salutation('— The Toffee Team');

        if ($this->pdfPath) {
            $mail->attach(storage_path('app/public/' . $this->pdfPath), [
                'as' => 'ticket-' . $this->ticket->uuid . '.pdf',
                'mime' => 'application/pdf',
            ]);
        }

        return $mail;
    }
}
