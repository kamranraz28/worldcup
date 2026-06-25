<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitVerificationRequest;
use App\Models\Customer;
use App\Services\CustomerVerificationService;
use App\Services\VerificationApiService;
use Illuminate\Http\JsonResponse;

class CustomerVerificationController extends Controller
{
    private $verificationService;
    private $apiService;

    public function __construct(CustomerVerificationService $verificationService, VerificationApiService $apiService)
    {
        $this->verificationService = $verificationService;
        $this->apiService = $apiService;
    }

    public function submit(SubmitVerificationRequest $request, string $customerUuid): JsonResponse
    {
        $customer = Customer::where('uuid', $customerUuid)->first();

        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

        $verification = $this->verificationService->submitVerification(
            $customer,
            $request->safe()->except(['document_front', 'document_back', 'selfie_image', 'notes']),
            $request->file('document_front'),
            $request->file('document_back'),
            $request->file('selfie_image'),
        );

        return response()->json([
            'message' => 'Verification submitted successfully',
            'verification' => $verification->load('customer'),
        ], 201);
    }

    public function status(string $customerUuid): JsonResponse
    {
        $customer = Customer::where('uuid', $customerUuid)->first();

        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

        $latest = $customer->latestVerification;

        return response()->json([
            'is_verified' => $customer->is_verified,
            'verified_at' => $customer->verified_at,
            'is_blacklisted' => $customer->isBlacklisted(),
            'latest_verification' => $latest ? [
                'uuid' => $latest->uuid,
                'status' => $latest->status,
                'type' => $latest->verification_type,
                'created_at' => $latest->created_at,
            ] : null,
        ]);
    }

    public function eligibility(string $customerUuid): JsonResponse
    {
        $customer = Customer::where('uuid', $customerUuid)->first();

        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

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
                'message' => 'Customer identity not verified',
            ];
        }

        $eligible = empty(array_filter($checks, fn ($c) => !$c['passed']));

        return response()->json([
            'eligible' => $eligible,
            'customer_uuid' => $customerUuid,
            'checks' => $checks,
        ]);
    }

    public function history(string $customerUuid): JsonResponse
    {
        $customer = Customer::where('uuid', $customerUuid)->first();

        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

        $history = $this->verificationService->getHistory($customer);
        $verifications = $this->verificationService->getVerificationHistory($customer->id);

        return response()->json([
            'customer' => $customer->only(['uuid', 'first_name', 'last_name', 'email', 'is_verified']),
            'verifications' => $verifications,
            'logs' => $history,
        ]);
    }
}
