<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketReceipt extends Notification
{
    use Queueable;

    private $ticket;

    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $event = $this->ticket->event;
        $customer = $this->ticket->customer;

        return (new MailMessage)
            ->subject('Payment Receipt — ' . ($event->title ?? 'Event'))
            ->greeting('Hi ' . ($customer->first_name ?? 'there') . ',')
            ->line('Here is your payment receipt for:')
            ->line('**' . $event->title . '**')
            ->line('')
            ->line('💰 **Amount Paid:** ' . $this->ticket->currency . ' ' . number_format($this->ticket->price, 2))
            ->line('🎫 **Ticket Type:** ' . ucfirst($this->ticket->ticket_type))
            ->line('🆔 **Transaction Ref:** ' . $this->ticket->qr_code)
            ->line('📅 **Date:** ' . now()->format('F j, Y'))
            ->line('')
            ->line('Thank you for your purchase!')
            ->salutation('— The Toffee Team');
    }
}
