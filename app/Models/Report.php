<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'uuid',
        'name',
        'type',
        'parameters',
        'file_path',
        'file_type',
        'status',
        'generated_by',
        'generated_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'parameters' => 'json',
            'generated_at' => 'datetime',
            'metadata' => 'json',
        ];
    }

    public function generator()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function isReady(): bool
    {
        return $this->status === 'completed' && !is_null($this->file_path);
    }
}
