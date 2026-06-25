<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckIn extends Model
{
    use HasFactory;

    protected $table = 'check_ins';

    protected $fillable = [
        'ticket_id',
        'event_id',
        'customer_id',
        'scanned_by',
        'scan_method',
        'device_id',
        'ip_address',
        'location_data',
        'is_valid',
        'validation_message',
        'scanned_at',
    ];

    protected function casts(): array
    {
        return [
            'location_data' => 'json',
            'is_valid' => 'boolean',
            'scanned_at' => 'datetime',
        ];
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function scanner()
    {
        return $this->belongsTo(User::class, 'scanned_by');
    }

    public function scopeValid($query)
    {
        return $query->where('is_valid', true);
    }

    public function scopeByEvent($query, int $eventId)
    {
        return $query->where('event_id', $eventId);
    }
}
