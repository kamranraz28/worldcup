<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VerificationApiService
{
    private $baseUrl;
    private $apiKey;
    private $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.verification_api.base_url', 'https://api.identity-verify.example.com/v1');
        $this->apiKey = config('services.verification_api.api_key', '');
        $this->timeout = config('services.verification_api.timeout', 30);
    }

    public function verifyDocument(string $imagePath, string $documentType): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'X-Source' => config('app.name'),
                ])
                ->attach('document', file_get_contents(storage_path('app/public/' . $imagePath)), basename($imagePath))
                ->post($this->baseUrl . '/documents/verify', [
                    'document_type' => $documentType,
                ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                ];
            }

            Log::warning('Document verification API failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [
                'success' => false,
                'error' => 'Verification service returned an error',
                'status_code' => $response->status(),
            ];
        } catch (\Exception $e) {
            Log::error('Document verification API exception', [
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => 'Unable to reach verification service',
            ];
        }
    }

    public function verifySelfie(string $selfiePath, string $documentPath): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                ])
                ->attach('selfie', file_get_contents(storage_path('app/public/' . $selfiePath)), basename($selfiePath))
                ->attach('document', file_get_contents(storage_path('app/public/' . $documentPath)), basename($documentPath))
                ->post($this->baseUrl . '/face-matching/verify');

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                ];
            }

            return [
                'success' => false,
                'error' => 'Face matching service returned an error',
                'status_code' => $response->status(),
            ];
        } catch (\Exception $e) {
            Log::error('Selfie verification API exception', [
                'message' => $e->getMessage(),
            ]);
            return [
                'success' => false,
                'error' => 'Unable to reach face matching service',
            ];
        }
    }

    public function checkSanctions(string $fullName, string $dateOfBirth, string $nationality): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                ])
                ->post($this->baseUrl . '/sanctions/check', [
                    'full_name' => $fullName,
                    'date_of_birth' => $dateOfBirth,
                    'nationality' => $nationality,
                ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                ];
            }

            return [
                'success' => false,
                'error' => 'Sanctions check service returned an error',
            ];
        } catch (\Exception $e) {
            Log::error('Sanctions check API exception', [
                'message' => $e->getMessage(),
            ]);
            return [
                'success' => false,
                'error' => 'Unable to reach sanctions check service',
            ];
        }
    }

    public function performFullVerification(string $documentPath, string $documentType, ?string $selfiePath = null): array
    {
        $results = [
            'document' => null,
            'face_match' => null,
            'sanctions' => null,
            'overall' => false,
        ];

        $docResult = $this->verifyDocument($documentPath, $documentType);
        $results['document'] = $docResult;

        if ($docResult['success'] && $selfiePath) {
            $results['face_match'] = $this->verifySelfie($selfiePath, $documentPath);
        }

        return $results;
    }
}
