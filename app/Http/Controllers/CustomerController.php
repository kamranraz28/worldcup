<?php

namespace App\Http\Controllers;

use App\Http\Requests\BlacklistCustomerRequest;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use App\Services\CustomerService;
use App\Services\CustomerVerificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    private $customerService;
    private $verificationService;

    public function __construct(CustomerService $customerService, CustomerVerificationService $verificationService)
    {
        $this->customerService = $customerService;
        $this->verificationService = $verificationService;
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'document_type', 'nationality', 'date_from', 'date_to']);

        return Inertia::render('Customers/Index', [
            'customers' => $this->customerService->paginate($filters, $request->integer('per_page', 15)),
            'filters' => $filters,
            'stats' => $this->customerService->getStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Customers/Create');
    }

    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        $customer = $this->customerService->create($request->validated());

        return redirect()
            ->route('customers.show', $customer)
            ->with('flash', ['success' => 'Customer created successfully.']);
    }

    public function show(string $uuid): Response
    {
        $customer = $this->customerService->find($uuid);

        if (!$customer) {
            abort(404);
        }

        $customer->loadMissing(['user', 'latestVerification', 'tickets' => function ($q) {
            $q->latest()->take(5);
        }]);

        $duplicates = $this->customerService->findDuplicates($customer);
        $eligibility = $this->customerService->checkEligibility($customer);
        $history = $this->verificationService->getHistory($customer);
        $verifications = $this->verificationService->getVerificationHistory($customer->id);
        $isBlacklisted = $customer->isBlacklisted();

        return Inertia::render('Customers/Show', [
            'customer' => $customer,
            'duplicates' => $duplicates,
            'eligibility' => $eligibility,
            'history' => $history,
            'verifications' => $verifications,
            'isBlacklisted' => $isBlacklisted,
        ]);
    }

    public function edit(string $uuid): Response
    {
        $customer = $this->customerService->find($uuid);

        if (!$customer) {
            abort(404);
        }

        $this->authorize('update', $customer);

        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    public function update(UpdateCustomerRequest $request, string $uuid): RedirectResponse
    {
        $customer = $this->customerService->find($uuid);

        if (!$customer) {
            abort(404);
        }

        $this->customerService->update($customer, $request->validated());

        return redirect()
            ->route('customers.show', $customer)
            ->with('flash', ['success' => 'Customer updated successfully.']);
    }

    public function destroy(string $uuid): RedirectResponse
    {
        $customer = $this->customerService->find($uuid);

        if (!$customer) {
            abort(404);
        }

        $this->authorize('delete', $customer);

        $this->customerService->delete($customer);

        return redirect()
            ->route('customers.index')
            ->with('flash', ['success' => 'Customer deleted successfully.']);
    }

    public function blacklist(BlacklistCustomerRequest $request, string $uuid): RedirectResponse
    {
        $customer = $this->customerService->find($uuid);

        if (!$customer) {
            abort(404);
        }

        $this->verificationService->blacklist(
            $customer,
            $request->input('reason'),
            $request->input('duration_days')
        );

        return back()->with('flash', ['success' => 'Customer blacklisted.']);
    }

    public function removeBlacklist(string $uuid): RedirectResponse
    {
        $customer = $this->customerService->find($uuid);

        if (!$customer) {
            abort(404);
        }

        $this->verificationService->removeBlacklist($customer);

        return back()->with('flash', ['success' => 'Blacklist removed.']);
    }

    public function eligibility(string $uuid): Response
    {
        $customer = $this->customerService->find($uuid);

        if (!$customer) {
            abort(404);
        }

        $checks = $this->customerService->checkEligibility($customer);
        $duplicates = $this->customerService->findDuplicates($customer);

        return Inertia::render('Customers/Eligibility', [
            'customer' => $customer,
            'checks' => $checks,
            'duplicates' => $duplicates,
        ]);
    }
}
