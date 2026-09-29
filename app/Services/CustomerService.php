<?php

namespace App\Services;

use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

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
        return $this->customerRepository->create($data);
    }

    public function update(Customer $customer, array $data): Customer
    {
        return $this->customerRepository->update($customer, $data);
    }

    public function delete(Customer $customer): bool
    {
        return $this->customerRepository->delete($customer);
    }

    public function findDuplicates(Customer $customer): Collection
    {
        return $this->customerRepository->findDuplicates($customer);
    }

    public function getStats(): array
    {
        return ['total' => \App\Models\Customer::count()];
    }
}
