<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'notifiable_type',
        'notifiable_id',
        'channel',
        'subject',
        'body',
        'data',
        'read_at',
        'sent_at',
        'failed_at',
        'error_message',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'json',
            'read_at' => 'datetime',
            'sent_at' => 'datetime',
            'failed_at' => 'datetime',
        ];
    }

    public function notifiable()
    {
        return $this->morphTo();
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeByChannel($query, string $channel)
    {
        return $query->where('channel', $channel);
    }

    /**
     * Scope to a single recipient. The table stores one row per
     * (notification, channel), so callers must also narrow by channel.
     */
    public function scopeForNotifiable($query, $notifiable)
    {
        return $query->where('notifiable_type', $notifiable->getMorphClass())
            ->where('notifiable_id', $notifiable->getKey());
    }

    /**
     * The in-app feed — only 'database' channel rows surface in the bell.
     */
    public function scopeInApp($query)
    {
        return $query->where('channel', 'database');
    }

    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    public function markAsRead(): void
    {
        if (is_null($this->read_at)) {
            $this->update(['read_at' => now()]);
        }
    }

    public function markAsSent(): void
    {
        $this->update(['sent_at' => now()]);
    }

    public function markAsFailed(string $error): void
    {
        $this->update([
            'failed_at' => now(),
            'error_message' => $error,
        ]);
    }
}
