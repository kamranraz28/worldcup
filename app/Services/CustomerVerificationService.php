<?php

namespace App\Services;

use App\Models\BlacklistedCustomer;
use App\Models\Customer;
use App\Models\CustomerVerification;
use App\Models\VerificationLog;
use App\Repositories\Contracts\CustomerVerificationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CustomerVerificationService
{
    private $verificationRepository;

    public function __construct(CustomerVerificationRepositoryInterface $verificationRepository)
    {
        $this->verificationRepository = $verificationRepository;
    }

    public function find(string $uuid): ?CustomerVerification
    {
        return $this->verificationRepository->find($uuid);
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->verificationRepository->paginate($filters, $perPage);
    }

    public function submitVerification(Customer $customer, array $data, ?UploadedFile $documentFront = null, ?UploadedFile $documentBack = null, ?UploadedFile $selfie = null): CustomerVerification
    {
        return DB::transaction(function () use ($customer, $data, $documentFront, $documentBack, $selfie) {
            if ($documentFront) {
                $data['document_front'] = $documentFront->store('verification-docs', 'public');
            }
            if ($documentBack) {
                $data['document_back'] = $documentBack->store('verification-docs', 'public');
            }
            if ($selfie) {
                $data['selfie_image'] = $selfie->store('verification-docs', 'public');
            }

            $data['customer_id'] = $customer->id;
            $data['uuid'] = (string) Str::uuid();
            $data['status'] = 'pending';
            $data['verification_metadata'] = array_merge($data['verification_metadata'] ?? [], [
                'source' => 'web',
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            $verification = $this->verificationRepository->create($data);

            VerificationLog::create([
                'customer_id' => $customer->id,
                'verification_id' => $verification->id,
                'action' => 'submitted',
                'status_to' => 'pending',
                'actor_id' => auth()->id(),
                'actor_type' => auth()->user() ? 'staff' : 'customer',
                'notes' => 'Verification submitted',
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $verification;
        });
    }

    public function approve(CustomerVerification $verification, string $notes = null): CustomerVerification
    {
        return DB::transaction(function () use ($verification, $notes) {
            $reviewed = $this->verificationRepository->update($verification, [
                'status' => 'verified',
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
                'expires_at' => now()->addYear(),
            ]);

            $verification->customer->update([
                'is_verified' => true,
                'verified_at' => now(),
            ]);

            VerificationLog::create([
                'customer_id' => $reviewed->customer_id,
                'verification_id' => $reviewed->id,
                'action' => 'approved',
                'status_from' => $verification->status,
                'status_to' => 'verified',
                'actor_id' => auth()->id(),
                'actor_type' => 'staff',
                'notes' => $notes ?? 'Verification approved',
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $reviewed;
        });
    }

    public function reject(CustomerVerification $verification, string $reason, string $notes = null): CustomerVerification
    {
        return DB::transaction(function () use ($verification, $reason, $notes) {
            $reviewed = $this->verificationRepository->update($verification, [
                'status' => 'rejected',
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
                'rejection_reason' => $reason,
            ]);

            VerificationLog::create([
                'customer_id' => $reviewed->customer_id,
                'verification_id' => $reviewed->id,
                'action' => 'rejected',
                'status_from' => $verification->status,
                'status_to' => 'rejected',
                'actor_id' => auth()->id(),
                'actor_type' => 'staff',
                'notes' => $notes ?? $reason,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $reviewed;
        });
    }

    public function flag(CustomerVerification $verification, string $reason): CustomerVerification
    {
        return DB::transaction(function () use ($verification, $reason) {
            $flagged = $this->verificationRepository->update($verification, [
                'status' => 'flagged',
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
                'rejection_reason' => $reason,
            ]);

            VerificationLog::create([
                'customer_id' => $flagged->customer_id,
                'verification_id' => $flagged->id,
                'action' => 'flagged',
                'status_from' => $verification->status,
                'status_to' => 'flagged',
                'actor_id' => auth()->id(),
                'actor_type' => 'staff',
                'notes' => $reason,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $flagged;
        });
    }

    public function blacklist(Customer $customer, string $reason, int $durationDays = null): BlacklistedCustomer
    {
        return DB::transaction(function () use ($customer, $reason, $durationDays) {
            $entry = BlacklistedCustomer::create([
                'customer_id' => $customer->id,
                'reason' => $reason,
                'source' => 'manual',
                'flagged_by' => auth()->id(),
                'expires_at' => $durationDays ? now()->addDays($durationDays) : null,
                'is_active' => true,
            ]);

            VerificationLog::create([
                'customer_id' => $customer->id,
                'action' => 'blacklisted',
                'actor_id' => auth()->id(),
                'actor_type' => 'staff',
                'notes' => $reason,
            ]);

            return $entry;
        });
    }

    public function removeBlacklist(Customer $customer): void
    {
        DB::transaction(function () use ($customer) {
            $customer->blacklistEntries()->active()->update(['is_active' => false]);

            VerificationLog::create([
                'customer_id' => $customer->id,
                'action' => 'blacklist_removed',
                'actor_id' => auth()->id(),
                'actor_type' => 'staff',
                'notes' => 'Blacklist entry removed',
            ]);
        });
    }

    public function getHistory(Customer $customer): Collection
    {
        return VerificationLog::byCustomer($customer->id)
            ->with(['actor', 'verification'])
            ->recent(50)
            ->get();
    }

    public function getVerificationHistory(int $customerId): Collection
    {
        return $this->verificationRepository->findByCustomer($customerId);
    }

    public function getStats(): array
    {
        $statusCounts = $this->verificationRepository->countByStatus();
        $dailyStats = $this->verificationRepository->getDailyStats(7);

        return [
            'by_status' => $statusCounts,
            'daily' => $dailyStats,
            'pending_count' => $statusCounts['pending'] ?? 0,
            'total_today' => CustomerVerification::whereDate('created_at', today())->count(),
            'approved_today' => CustomerVerification::whereDate('reviewed_at', today())->where('status', 'verified')->count(),
        ];
    }
}
