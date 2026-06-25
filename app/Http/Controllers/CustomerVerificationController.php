<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewVerificationRequest;
use App\Http\Requests\SubmitVerificationRequest;
use App\Models\Customer;
use App\Services\CustomerVerificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerVerificationController extends Controller
{
    private $verificationService;

    public function __construct(CustomerVerificationService $verificationService)
    {
        $this->verificationService = $verificationService;
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'type', 'date_from', 'date_to']);

        return Inertia::render('Verifications/Index', [
            'verifications' => $this->verificationService->paginate($filters, $request->integer('per_page', 15)),
            'filters' => $filters,
            'stats' => $this->verificationService->getStats(),
        ]);
    }

    public function show(string $uuid): Response
    {
        $verification = $this->verificationService->find($uuid);

        if (!$verification) {
            abort(404);
        }

        return Inertia::render('Verifications/Show', [
            'verification' => $verification->loadMissing([
                'customer',
                'reviewer:id,name,email',
                'logs.actor:id,name',
            ]),
        ]);
    }

    public function submit(SubmitVerificationRequest $request, string $customerUuid): RedirectResponse
    {
        $customer = Customer::where('uuid', $customerUuid)->firstOrFail();

        $verification = $this->verificationService->submitVerification(
            $customer,
            $request->safe()->except(['document_front', 'document_back', 'selfie_image', 'notes']),
            $request->file('document_front'),
            $request->file('document_back'),
            $request->file('selfie_image'),
        );

        return redirect()
            ->route('verifications.show', $verification)
            ->with('flash', ['success' => 'Verification submitted successfully.']);
    }

    public function review(ReviewVerificationRequest $request, string $uuid): RedirectResponse
    {
        $verification = $this->verificationService->find($uuid);

        if (!$verification) {
            abort(404);
        }

        $action = $request->input('action');

        if ($action === 'approve') {
            $this->verificationService->approve($verification, $request->input('notes'));
            $message = 'Verification approved successfully.';
        } elseif ($action === 'reject') {
            $this->verificationService->reject($verification, $request->input('rejection_reason'), $request->input('notes'));
            $message = 'Verification rejected.';
        } else {
            $this->verificationService->flag($verification, $request->input('rejection_reason'));
            $message = 'Verification flagged for review.';
        }

        return redirect()
            ->route('verifications.show', $verification)
            ->with('flash', ['success' => $message]);
    }

    public function pendingReview(Request $request): Response
    {
        return Inertia::render('Verifications/Review', [
            'verifications' => $this->verificationService->paginate(
                array_merge($request->only(['search', 'type']), ['pending_review' => true]),
                $request->integer('per_page', 20)
            ),
            'filters' => $request->only(['search', 'type']),
            'stats' => $this->verificationService->getStats(),
        ]);
    }
}
