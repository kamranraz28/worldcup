<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class CampaignParticipant extends Pivot
{
    use HasFactory;

    protected $table = 'campaign_participants';

    protected $fillable = [
        'campaign_id',
        'customer_id',
        'points_earned',
        'rewards_claimed',
        'status',
        'joined_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'points_earned' => 'integer',
            'rewards_claimed' => 'json',
            'joined_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
