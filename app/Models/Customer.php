<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'uuid',
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'date_of_birth',
        'nationality',
        'document_type',
        'document_number',
        'metadata',
        'is_verified',
        'verified_at',
        'last_participated_at',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'metadata' => 'json',
            'is_verified' => 'boolean',
            'verified_at' => 'datetime',
            'last_participated_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function verifications()
    {
        return $this->hasMany(CustomerVerification::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function checkIns()
    {
        return $this->hasMany(CheckIn::class);
    }

    public function campaignParticipants()
    {
        return $this->hasMany(CampaignParticipant::class);
    }

    public function campaigns()
    {
        return $this->belongsToMany(Campaign::class, 'campaign_participants')
            ->using(CampaignParticipant::class)
            ->withPivot(['points_earned', 'rewards_claimed', 'status', 'joined_at', 'completed_at'])
            ->withTimestamps();
    }

    public function latestVerification()
    {
        return $this->hasOne(CustomerVerification::class)->latest();
    }

    public function verificationLogs()
    {
        return $this->hasMany(VerificationLog::class);
    }

    public function blacklistEntries()
    {
        return $this->hasMany(BlacklistedCustomer::class);
    }

    public function activeBlacklist()
    {
        return $this->hasOne(BlacklistedCustomer::class)->active();
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getInitialsAttribute(): string
    {
        return strtoupper(substr($this->first_name, 0, 1) . substr($this->last_name, 0, 1));
    }

    public function isBlacklisted(): bool
    {
        return $this->activeBlacklist()->exists();
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopePendingVerification($query)
    {
        return $query->where('is_verified', false);
    }

    public function scopeBlacklisted($query)
    {
        return $query->whereHas('blacklistEntries', function ($q) {
            $q->active();
        });
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('first_name', 'like', "%{$term}%")
              ->orWhere('last_name', 'like', "%{$term}%")
              ->orWhere('email', 'like', "%{$term}%")
              ->orWhere('phone', 'like', "%{$term}%")
              ->orWhere('document_number', 'like', "%{$term}%");
        });
    }

    public function scopeByDocumentType($query, string $type)
    {
        return $query->where('document_type', $type);
    }

    public function scopeByNationality($query, string $nationality)
    {
        return $query->where('nationality', $nationality);
    }
}
