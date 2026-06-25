<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\VerificationLog;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    private $customerRepository;

    public function __construct(CustomerRepositoryInterface $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    public function find(string $uuid): ?Customer
    {
        return $this->customerRepository->find($uuid);
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->customerRepository->paginate($filters, $perPage);
    }

    public function create(array $data): Customer
    {
        return DB::transaction(function () use ($data) {
            $customer = $this->customerRepository->create($data);

            VerificationLog::create([
                'customer_id' => $customer->id,
                'action' => 'created',
                'actor_id' => auth()->id(),
                'actor_type' => 'staff',
                'notes' => 'Customer profile created',
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $customer;
        });
    }

    public function update(Customer $customer, array $data): Customer
    {
        return DB::transaction(function () use ($customer, $data) {
            $updated = $this->customerRepository->update($customer, $data);

            VerificationLog::create([
                'customer_id' => $customer->id,
                'action' => 'updated',
                'actor_id' => auth()->id(),
                'actor_type' => 'staff',
                'notes' => 'Customer profile updated',
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $updated;
        });
    }

    public function delete(Customer $customer): bool
    {
        return DB::transaction(function () use ($customer) {
            VerificationLog::create([
                'customer_id' => $customer->id,
                'action' => 'deleted',
                'actor_id' => auth()->id(),
                'actor_type' => 'staff',
                'notes' => 'Customer profile deleted',
            ]);

            return $this->customerRepository->delete($customer);
        });
    }

    public function findDuplicates(Customer $customer): Collection
    {
        return $this->customerRepository->findDuplicates($customer);
    }

    public function checkEligibility(Customer $customer): array
    {
        $checks = [];

        if ($customer->isBlacklisted()) {
            $checks[] = [
                'check' => 'blacklist',
                'passed' => false,
                'message' => 'Customer is blacklisted',
            ];
        }

        if (!$customer->is_verified) {
            $checks[] = [
                'check' => 'verification',
                'passed' => false,
                'message' => 'Customer is not verified',
            ];
        }

        if (empty($checks)) {
            $checks[] = [
                'check' => 'overall',
                'passed' => true,
                'message' => 'Customer is eligible',
            ];
        }

        return $checks;
    }

    public function getStats(): array
    {
        return $this->customerRepository->countByVerificationStatus();
    }
}
