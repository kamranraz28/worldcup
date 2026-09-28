<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ShurjoPayService
{
    protected string $baseUrl;
    protected string $username;
    protected string $password;
    protected string $prefix;
    protected string $currency;

    public function __construct()
    {
        $this->baseUrl = rtrim((string) config('shurjopay.base_url'), '/');
        $this->username = (string) config('shurjopay.username');
        $this->password = (string) config('shurjopay.password');
        $this->prefix = (string) config('shurjopay.prefix');
        $this->currency = (string) config('shurjopay.currency');
    }

    public function prefix(): string
    {
        return $this->prefix;
    }

    /**
     * Fetch an auth token + store info, cached until expiry.
     */
    public function token(): ?array
    {
        return Cache::remember('shurjopay_session', now()->addMinutes(55), function () {
            try {
                $response = Http::acceptJson()->post($this->baseUrl . '/get_token', [
                    'username' => $this->username,
                    'password' => $this->password,
                ]);

                if (!$response->successful() || !$response->json('token')) {
                    Log::error('ShurjoPay get_token failed', [
                        'status' => $response->status(),
                    ]);

                    return null;
                }

                return [
                    'token' => $response->json('token'),
                    'store_id' => $response->json('store_id'),
                    'execute_url' => $response->json('execute_url') ?: ($this->baseUrl . '/secret-pay'),
                ];
            } catch (\Exception $e) {
                Log::error('ShurjoPay get_token exception', ['error' => $e->getMessage()]);

                return null;
            }
        });
    }

    /**
     * Create a payment session at the gateway; returns the gateway response
     * containing `checkout_url` and `sp_order_id`.
     */
    public function createPayment(array $payment): ?array
    {
        $response = $this->requestPayment($payment);

        if (!$this->hasCheckout($response)) {
            // Cached token may have been invalidated (ShurjoPay allows one active token).
            // Refresh once and retry.
            Cache::forget('shurjopay_session');
            $response = $this->requestPayment($payment);
        }

        if (!$this->hasCheckout($response)) {
            Log::error('ShurjoPay create payment failed', [
                'sp_code' => $response['sp_code'] ?? null,
                'message' => $response['sp_message'] ?? ($response['message'] ?? null),
            ]);

            return $response;
        }

        return $response;
    }

    protected function requestPayment(array $payment): array
    {
        $session = $this->token();

        if (!$session) {
            return [];
        }

        try {
            $response = Http::acceptJson()
                ->withToken($session['token'])
                ->post($session['execute_url'], array_merge([
                    'prefix' => $this->prefix,
                    'currency' => $this->currency,
                    'token' => $session['token'],
                    'store_id' => $session['store_id'],
                ], $payment));

            return is_array($response->json()) ? $response->json() : [];
        } catch (\Exception $e) {
            Log::error('ShurjoPay create payment exception', ['error' => $e->getMessage()]);

            return [];
        }
    }

    protected function hasCheckout(?array $response): bool
    {
        return is_array($response) && !empty($response['checkout_url']);
    }

    /**
     * Verify a payment with the gateway.
     */
    public function verifyPayment(string $orderId): ?array
    {
        $result = $this->requestVerification($orderId);

        if (!is_array($result) || !isset($result['transactionStatus'])) {
            Cache::forget('shurjopay_session');
            $retry = $this->requestVerification($orderId);

            if (is_array($retry) && isset($retry['transactionStatus'])) {
                return $retry;
            }
        }

        return $result;
    }

    protected function requestVerification(string $orderId): ?array
    {
        $session = $this->token();

        if (!$session) {
            return null;
        }

        try {
            $response = Http::acceptJson()
                ->withToken($session['token'])
                ->post($this->baseUrl . '/verification', [
                    'order_id' => $orderId,
                ]);

            if (!$response->successful()) {
                Log::error('ShurjoPay verification failed', [
                    'order_id' => $orderId,
                    'status' => $response->status(),
                    'body' => substr((string) $response->body(), 0, 300),
                ]);

                return null;
            }

            $result = $response->json();

            return is_array($result) && array_is_list($result) ? ($result[0] ?? null) : $result;
        } catch (\Exception $e) {
            Log::error('ShurjoPay verification exception', ['error' => $e->getMessage()]);

            return null;
        }
    }

    public static function isSuccessful(?array $verification): bool
    {
        return isset($verification['transactionStatus']) && $verification['transactionStatus'] === 'Success';
    }
}
