<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlacklistedCustomer extends Model
{
    use HasFactory;

    protected $table = 'blacklisted_customers';

    protected $fillable = [
        'customer_id',
        'reason',
        'source',
        'flagged_by',
        'expires_at',
        'is_active',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
            'metadata' => 'json',
        ];
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function flagger()
    {
        return $this->belongsTo(User::class, 'flagged_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>', now());
            });
    }

    public function scopeExpired($query)
    {
        return $query->where('is_active', true)
            ->where('expires_at', '<=', now());
    }

    public function scopeBySource($query, string $source)
    {
        return $query->where('source', $source);
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }
}
