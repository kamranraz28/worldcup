<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'uuid',
        'title',
        'slug',
        'description',
        'event_type',
        'venue_name',
        'venue_address',
        'venue_lat',
        'venue_lng',
        'max_capacity',
        'ticket_price',
        'start_date',
        'end_date',
        'registration_deadline',
        'banner_image',
        'status',
        'requires_verification',
        'metadata',
        'created_by',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected function casts(): array
    {
        return [
            'venue_lat' => 'decimal:7',
            'venue_lng' => 'decimal:7',
            'max_capacity' => 'integer',
            'ticket_price' => 'decimal:2',
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'registration_deadline' => 'datetime',
            'requires_verification' => 'boolean',
            'metadata' => 'json',
        ];
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function sessions()
    {
        return $this->hasMany(EventSession::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function checkIns()
    {
        return $this->hasMany(CheckIn::class);
    }

    public function gallery()
    {
        return $this->hasMany(EventGallery::class)->orderBy('order');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>', now())
            ->whereIn('status', ['published', 'draft']);
    }

    public function scopePast($query)
    {
        return $query->where('end_date', '<', now());
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('event_type', $type);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByDateRange($query, string $from, ?string $to = null)
    {
        $query->where('start_date', '>=', $from);

        if ($to) {
            $query->where('start_date', '<=', $to);
        }

        return $query;
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
              ->orWhere('description', 'like', "%{$term}%")
              ->orWhere('venue_name', 'like', "%{$term}%")
              ->orWhere('venue_address', 'like', "%{$term}%");
        });
    }

    public function isFull(): bool
    {
        return $this->tickets()->whereIn('status', ['confirmed', 'reserved'])->count() >= $this->max_capacity;
    }

    public function availableSpots(): int
    {
        return $this->max_capacity - $this->tickets()->whereIn('status', ['confirmed', 'reserved'])->count();
    }

    public function isUpcoming(): bool
    {
        return $this->start_date->isFuture();
    }

    public function isOngoing(): bool
    {
        return $this->start_date->isPast() && $this->end_date->isFuture();
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function canBePublished(): bool
    {
        return $this->status === 'draft'
            && $this->start_date->isFuture()
            && !empty($this->title);
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['draft', 'published']) && $this->start_date->isFuture();
    }
}
