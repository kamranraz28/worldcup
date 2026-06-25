<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'title',
        'start_time',
        'end_time',
        'capacity',
        'location',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'capacity' => 'integer',
        ];
    }

    public function scopeByLocation($query, string $location)
    {
        return $query->where('location', $location);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function isFull(): bool
    {
        if (is_null($this->capacity)) {
            return false;
        }

        return $this->tickets()->whereIn('status', ['confirmed', 'reserved'])->count() >= $this->capacity;
    }
}
