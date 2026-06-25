<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WaitingList extends Model
{
    use HasFactory;

    protected $table = 'waiting_list';

    protected $fillable = [
        'event_id',
        'customer_id',
        'ticket_type',
        'status',
        'position',
        'max_positions',
        'notified_by',
        'notified_at',
        'expires_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'max_positions' => 'integer',
            'notified_at' => 'datetime',
            'expires_at' => 'datetime',
            'metadata' => 'json',
        ];
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function notifiedBy()
    {
        return $this->belongsTo(User::class, 'notified_by');
    }

    public function scopeWaiting($query)
    {
        return $query->where('status', 'waiting');
    }

    public function scopeNotified($query)
    {
        return $query->where('status', 'notified');
    }

    public function scopeConverted($query)
    {
        return $query->where('status', 'converted');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    public function scopeByEvent($query, $eventId)
    {
        return $query->where('event_id', $eventId);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['waiting', 'notified']);
    }
}
