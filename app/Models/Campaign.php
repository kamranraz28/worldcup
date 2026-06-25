<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'uuid',
        'title',
        'slug',
        'description',
        'campaign_type',
        'start_date',
        'end_date',
        'reward_type',
        'reward_value',
        'total_budget',
        'total_participants',
        'max_participants',
        'rules',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'reward_value' => 'decimal:2',
            'total_budget' => 'decimal:2',
            'total_participants' => 'integer',
            'max_participants' => 'integer',
            'rules' => 'json',
        ];
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function participants()
    {
        return $this->hasMany(CampaignParticipant::class);
    }

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'campaign_participants')
            ->using(CampaignParticipant::class)
            ->withPivot(['points_earned', 'rewards_claimed', 'status', 'joined_at', 'completed_at'])
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('end_date', '>', now());
    }

    public function isFull(): bool
    {
        if (is_null($this->max_participants)) {
            return false;
        }

        return $this->total_participants >= $this->max_participants;
    }

    public function isActive(): bool
    {
        return $this->status === 'active'
            && $this->start_date->isPast()
            && $this->end_date->isFuture();
    }
}
