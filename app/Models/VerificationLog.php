<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationLog extends Model
{
    use HasFactory;

    protected $table = 'verification_logs';

    protected $fillable = [
        'customer_id',
        'verification_id',
        'action',
        'status_from',
        'status_to',
        'actor_id',
        'actor_type',
        'notes',
        'metadata',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'json',
        ];
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function verification()
    {
        return $this->belongsTo(CustomerVerification::class, 'verification_id');
    }

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    public function scopeByCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeRecent($query, int $limit = 20)
    {
        return $query->latest()->take($limit);
    }
}
