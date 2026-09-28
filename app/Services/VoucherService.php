<?php

namespace App\Services;

use App\Models\Voucher;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class VoucherService
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Voucher::query()->latest();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            match ($filters['status']) {
                'active' => $query->where('is_active', true)->whereColumn('used_count', '<', 'max_uses'),
                'inactive' => $query->where('is_active', false),
                'used_up' => $query->whereColumn('used_count', '>=', 'max_uses'),
                'expired' => $query->whereNotNull('expires_at')->where('expires_at', '<', now()),
                default => null,
            };
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function create(array $data): Voucher
    {
        $data['code'] = $this->normalizeCode($data['code']);
        $data['created_by'] = auth()->id();

        return Voucher::create($data);
    }

    public function update(Voucher $voucher, array $data): Voucher
    {
        if (isset($data['code'])) {
            $data['code'] = $this->normalizeCode($data['code']);
        }

        $voucher->update($data);

        return $voucher;
    }

    /**
     * Resolve a voucher code to a usable voucher or throw.
     */
    public function findUsable(string $code): Voucher
    {
        $voucher = Voucher::where('code', $this->normalizeCode($code))->first();

        if (!$voucher) {
            throw new \RuntimeException('Invalid voucher code.');
        }

        if (!$voucher->is_active) {
            throw new \RuntimeException('This voucher is no longer active.');
        }

        if (!$voucher->hasStarted()) {
            throw new \RuntimeException('This voucher is not active yet.');
        }

        if ($voucher->hasExpired()) {
            throw new \RuntimeException('This voucher has expired.');
        }

        if ($voucher->isExhausted()) {
            throw new \RuntimeException('This voucher has reached its usage limit.');
        }

        return $voucher;
    }

    public function calculateDiscount(Voucher $voucher, float $price): float
    {
        return round($price * ((float) $voucher->discount_percent) / 100, 2);
    }

    /**
     * Atomically claim one use of the voucher, failing if the cap is reached.
     */
    public function redeem(Voucher $voucher): void
    {
        $affected = Voucher::where('id', $voucher->id)
            ->where('is_active', true)
            ->whereColumn('used_count', '<', 'max_uses')
            ->increment('used_count');

        if ($affected === 0) {
            throw new \RuntimeException('This voucher has reached its usage limit.');
        }
    }

    public function getStats(): array
    {
        return [
            'total' => Voucher::count(),
            'active' => Voucher::where('is_active', true)->whereColumn('used_count', '<', 'max_uses')->count(),
            'inactive' => Voucher::where('is_active', false)->count(),
            'used_up' => Voucher::whereColumn('used_count', '>=', 'max_uses')->count(),
            'redemptions' => (int) Voucher::sum('used_count'),
        ];
    }

    protected function normalizeCode(string $code): string
    {
        return strtoupper(trim($code));
    }
}
