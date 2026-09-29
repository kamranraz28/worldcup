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
        'early_booking_price',
        'early_booking_deadline',
        'start_date',
        'end_date',
        'registration_deadline',
        'banner_image',
        'ticket_template_path',
        'qr_x',
        'qr_y',
        'qr_size',
        'status',
        'requires_verification',
        'metadata',
        'created_by',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected $appends = ['current_price', 'is_early_booking'];

    protected function casts(): array
    {
        return [
            'venue_lat' => 'decimal:7',
            'venue_lng' => 'decimal:7',
            'max_capacity' => 'integer',
            'ticket_price' => 'decimal:2',
            'early_booking_price' => 'decimal:2',
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'registration_deadline' => 'datetime',
            'early_booking_deadline' => 'datetime',
            'requires_verification' => 'boolean',
            'qr_x' => 'decimal:2',
            'qr_y' => 'decimal:2',
            'qr_size' => 'decimal:2',
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

    public function scanners()
    {
        return $this->belongsToMany(User::class, 'event_scanner')->withTimestamps();
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
    {        return $this->tickets()->whereIn('status', ['confirmed', 'reserved'])->count() >= $this->max_capacity;
    }

    public function availableSpots(): int
    {
        return $this->max_capacity - $this->tickets()->whereIn('status', ['confirmed', 'reserved'])->count();
    }

    public function hasEarlyBooking(): bool
    {
        return $this->early_booking_price !== null && $this->early_booking_deadline !== null;
    }

    public function isEarlyBookingActive(): bool
    {
        return $this->hasEarlyBooking() && now()->lte($this->early_booking_deadline);
    }

    public function currentPrice(): float
    {
        if ($this->isEarlyBookingActive()) {
            return (float) $this->early_booking_price;
        }

        return (float) ($this->ticket_price ?? 0);
    }

    public function isBookingOpen(): bool
    {
        return $this->registration_deadline === null || now()->lte($this->registration_deadline);
    }

    public function getCurrentPriceAttribute(): float
    {
        return $this->currentPrice();
    }

    public function getIsEarlyBookingAttribute(): bool
    {
        return $this->isEarlyBookingActive();
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
