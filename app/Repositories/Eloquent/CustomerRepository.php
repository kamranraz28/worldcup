<?php

namespace App\Repositories\Eloquent;

use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CustomerRepository implements CustomerRepositoryInterface
{
    public function find(string $uuid): ?Customer
    {
        return Customer::where('uuid', $uuid)->first();
    }

    public function findById(int $id): ?Customer
    {
        return Customer::find($id);
    }

    public function findByEmail(string $email): ?Customer
    {
        return Customer::where('email', $email)->first();
    }

    public function findByDocument(string $documentNumber): ?Customer
    {
        return Customer::where('document_number', $documentNumber)->first();
    }

    public function all(array $criteria = []): Collection
    {
        return $this->applyCriteria(Customer::query(), $criteria)->latest()->get();
    }

    public function paginate(array $criteria = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->applyCriteria(Customer::query(), $criteria)
            ->withCount(['verifications as verification_count'])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): Customer
    {
        return Customer::create($data);
    }

    public function update(Customer $customer, array $data): Customer
    {
        $customer->update($data);
        return $customer->fresh();
    }

    public function delete(Customer $customer): bool
    {
        return $customer->delete();
    }

    public function countByVerificationStatus(): array
    {
        return [
            'total' => Customer::count(),
            'verified' => Customer::verified()->count(),
            'pending' => Customer::pendingVerification()->count(),
            'blacklisted' => Customer::blacklisted()->count(),
        ];
    }

    public function findDuplicates(Customer $customer): Collection
    {
        return Customer::where(function ($q) use ($customer) {
            if ($customer->email) {
                $q->orWhere('email', $customer->email);
            }
            if ($customer->phone) {
                $q->orWhere('phone', $customer->phone);
            }
            if ($customer->document_number) {
                $q->orWhere('document_number', $customer->document_number);
            }
        })
            ->when($customer->exists, fn ($q) => $q->where('id', '!=', $customer->id))
            ->get();
    }

    public function findVerified(): Collection
    {
        return Customer::verified()->latest()->get();
    }

    public function findPending(): Collection
    {
        return Customer::pendingVerification()->latest()->get();
    }

    private function applyCriteria($query, array $criteria)
    {
        if (!empty($criteria['search'])) {
            $query->search($criteria['search']);
        }

        if (!empty($criteria['status'])) {
            if ($criteria['status'] === 'verified') {
                $query->verified();
            } elseif ($criteria['status'] === 'pending') {
                $query->pendingVerification();
            } elseif ($criteria['status'] === 'blacklisted') {
                $query->blacklisted();
            }
        }

        if (!empty($criteria['document_type'])) {
            $query->byDocumentType($criteria['document_type']);
        }

        if (!empty($criteria['nationality'])) {
            $query->byNationality($criteria['nationality']);
        }

        if (!empty($criteria['date_from'])) {
            $query->where('created_at', '>=', $criteria['date_from']);
        }

        if (!empty($criteria['date_to'])) {
            $query->where('created_at', '<=', $criteria['date_to']);
        }

        return $query;
    }
}
