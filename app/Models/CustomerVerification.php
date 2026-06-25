<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerVerification extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'customer_verifications';

    protected $fillable = [
        'customer_id',
        'uuid',
        'verification_type',
        'status',
        'document_front',
        'document_back',
        'selfie_image',
        'ocr_data',
        'confidence_score',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
        'verification_metadata',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'ocr_data' => 'json',
            'confidence_score' => 'decimal:2',
            'reviewed_at' => 'datetime',
            'verification_metadata' => 'json',
            'expires_at' => 'datetime',
        ];
    }

    public function logs()
    {
        return $this->hasMany(VerificationLog::class, 'verification_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeInReview($query)
    {
        return $query->where('status', 'in_review');
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('verification_type', $type);
    }

    public function scopeByReviewer($query, $userId)
    {
        return $query->where('reviewed_by', $userId);
    }

    public function scopePendingReview($query)
    {
        return $query->whereIn('status', ['pending', 'in_review']);
    }

    public function scopeRequiringAttention($query)
    {
        return $query->where('status', 'flagged')
            ->orWhere(function ($q) {
                $q->where('status', 'pending')
                  ->where('created_at', '<', now()->subHours(48));
            });
    }

    public function isApproved(): bool
    {
        return $this->status === 'verified';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function isFlagged(): bool
    {
        return $this->status === 'flagged';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending' || $this->status === 'in_review';
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }
}
