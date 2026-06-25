<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\NexmoMessage;
use Illuminate\Notifications\Notification;

class TicketSms extends Notification
{
    use Queueable;

    private $message;

    public function __construct(string $message)
    {
        $this->message = $message;
    }

    public function via($notifiable): array
    {
        return ['nexmo'];
    }

    public function toNexmo($notifiable): NexmoMessage
    {
        return (new NexmoMessage)
            ->content($this->message);
    }
}
