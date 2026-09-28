<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'uuid',
        'code',
        'description',
        'discount_percent',
        'max_uses',
        'used_count',
        'starts_at',
        'expires_at',
        'is_active',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'discount_percent' => 'decimal:2',
            'max_uses' => 'integer',
            'used_count' => 'integer',
            'starts_at' => 'datetime',
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function remainingUses(): int
    {
        return max(0, $this->max_uses - $this->used_count);
    }

    public function isExhausted(): bool
    {
        return $this->used_count >= $this->max_uses;
    }

    public function hasStarted(): bool
    {
        return $this->starts_at === null || now()->gte($this->starts_at);
    }

    public function hasExpired(): bool
    {
        return $this->expires_at !== null && now()->gt($this->expires_at);
    }

    public function isUsable(): bool
    {
        return $this->is_active && !$this->isExhausted() && $this->hasStarted() && !$this->hasExpired();
    }

    public function getStatusAttribute(): string
    {
        if (!$this->is_active) {
            return 'inactive';
        }
        if ($this->hasExpired()) {
            return 'expired';
        }
        if (!$this->hasStarted()) {
            return 'scheduled';
        }
        if ($this->isExhausted()) {
            return 'used_up';
        }

        return 'active';
    }
}
