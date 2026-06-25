<?php

namespace App\Repositories\Contracts;

use App\Models\Customer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CustomerRepositoryInterface
{
    public function find(string $uuid): ?Customer;
    public function findById(int $id): ?Customer;
    public function findByEmail(string $email): ?Customer;
    public function findByDocument(string $documentNumber): ?Customer;
    public function all(array $criteria = []): Collection;
    public function paginate(array $criteria = [], int $perPage = 15): LengthAwarePaginator;
    public function create(array $data): Customer;
    public function update(Customer $customer, array $data): Customer;
    public function delete(Customer $customer): bool;
    public function countByVerificationStatus(): array;
    public function findDuplicates(Customer $customer): Collection;
    public function findVerified(): Collection;
    public function findPending(): Collection;
}
