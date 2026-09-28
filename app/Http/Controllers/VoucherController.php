<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVoucherRequest;
use App\Http\Requests\UpdateVoucherRequest;
use App\Models\Voucher;
use App\Services\VoucherService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VoucherController extends Controller
{
    private $voucherService;

    public function __construct(VoucherService $voucherService)
    {
        $this->voucherService = $voucherService;
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);

        return Inertia::render('Vouchers/Index', [
            'vouchers' => $this->voucherService->paginate($filters, $request->integer('per_page', 15)),
            'filters' => $filters,
            'stats' => $this->voucherService->getStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Vouchers/Create');
    }

    public function store(StoreVoucherRequest $request): RedirectResponse
    {
        $voucher = $this->voucherService->create($request->validated());

        return redirect()
            ->route('vouchers.index')
            ->with('flash', ['success' => "Voucher {$voucher->code} created successfully."]);
    }

    public function edit(Voucher $voucher): Response
    {
        return Inertia::render('Vouchers/Edit', [
            'voucher' => [
                'uuid' => $voucher->uuid,
                'code' => $voucher->code,
                'description' => $voucher->description,
                'discount_percent' => $voucher->discount_percent,
                'max_uses' => $voucher->max_uses,
                'used_count' => $voucher->used_count,
                'starts_at' => $voucher->starts_at,
                'expires_at' => $voucher->expires_at,
                'is_active' => $voucher->is_active,
                'status' => $voucher->status,
            ],
        ]);
    }

    public function update(UpdateVoucherRequest $request, Voucher $voucher): RedirectResponse
    {
        $this->voucherService->update($voucher, $request->validated());

        return redirect()
            ->route('vouchers.index')
            ->with('flash', ['success' => "Voucher {$voucher->code} updated successfully."]);
    }

    public function toggle(Voucher $voucher): RedirectResponse
    {
        $voucher->update(['is_active' => !$voucher->is_active]);

        return redirect()->back()->with('flash', [
            'success' => $voucher->is_active ? 'Voucher activated.' : 'Voucher deactivated.',
        ]);
    }

    public function destroy(Voucher $voucher): RedirectResponse
    {
        if ($voucher->used_count > 0) {
            return redirect()->back()->with('flash', [
                'error' => 'This voucher has already been used and cannot be deleted. Deactivate it instead.',
            ]);
        }

        $voucher->delete();

        return redirect()->route('vouchers.index')->with('flash', ['success' => 'Voucher deleted.']);
    }
}
