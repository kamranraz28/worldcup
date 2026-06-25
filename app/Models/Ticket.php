<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'uuid',
        'event_id',
        'event_session_id',
        'customer_id',
        'user_id',
        'ticket_type',
        'price',
        'currency',
        'status',
        'qr_code',
        'qr_code_path',
        'checked_in_at',
        'checked_in_by',
        'approved_by',
        'approved_at',
        'rejected_by',
        'rejected_at',
        'rejection_reason',
        'registered_at',
        'reserved_until',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'checked_in_at' => 'datetime',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'registered_at' => 'datetime',
            'reserved_until' => 'datetime',
            'metadata' => 'json',
        ];
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function session()
    {
        return $this->belongsTo(EventSession::class, 'event_session_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function checkIn()
    {
        return $this->hasOne(CheckIn::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function rejecter()
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    public function actions()
    {
        return $this->hasMany(TicketAction::class);
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeByEvent($query, $eventId)
    {
        return $query->where('event_id', $eventId);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('ticket_type', $type);
    }

    public function scopeByDateRange($query, $from, $to = null)
    {
        $query->where('created_at', '>=', $from);
        if ($to) {
            $query->where('created_at', '<=', $to);
        }
        return $query;
    }

    public function scopePendingApproval($query)
    {
        return $query->where('status', 'pending_approval');
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('ticket_type', 'like', "%{$term}%")
              ->orWhere('qr_code', 'like', "%{$term}%")
              ->orWhereHas('customer', function ($c) use ($term) {
                  $c->where('first_name', 'like', "%{$term}%")
                    ->orWhere('last_name', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%")
                    ->orWhere('phone', 'like', "%{$term}%");
              })
              ->orWhereHas('event', function ($e) use ($term) {
                  $e->where('title', 'like', "%{$term}%");
              });
        });
    }

    public function isRedeemed(): bool
    {
        return $this->status === 'redeemed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function isPendingApproval(): bool
    {
        return $this->status === 'pending_approval';
    }

    public function isApproved(): bool
    {
        return $this->status === 'confirmed';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function isReserved(): bool
    {
        return $this->status === 'reserved';
    }

    public function canBeApproved(): bool
    {
        return in_array($this->status, ['reserved', 'pending_approval']);
    }

    public function canBeRejected(): bool
    {
        return in_array($this->status, ['reserved', 'pending_approval', 'confirmed']);
    }

    public function canBeCheckedIn(): bool
    {
        return $this->status === 'confirmed' && !$this->checked_in_at;
    }
}
