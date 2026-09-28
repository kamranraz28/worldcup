<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\TicketAction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    protected ShurjoPayService $shurjoPay;

    protected TicketService $ticketService;

    public function __construct(ShurjoPayService $shurjoPay, TicketService $ticketService)
    {
        $this->shurjoPay = $shurjoPay;
        $this->ticketService = $ticketService;
    }

    public function createCheckoutForTicket(Ticket $ticket): ?array
    {
        $ticket->loadMissing('event:id,uuid,title,ticket_price', 'customer:id,first_name,last_name,email,phone', 'user:id,name,email');

        $orderNumber = $this->generateOrderNumber($ticket->uuid);

        $payment = $this->shurjoPay->createPayment([
            'amount' => $ticket->price,
            'order_id' => $orderNumber,
            'return_url' => route('payment.return'),
            'cancel_url' => route('payment.cancel', ['uuid' => $ticket->uuid]),
            'payment_opt' => 1,
            'customer_name' => $this->customerName($ticket),
            'customer_email' => $email = ($ticket->customer?->email ?? $ticket->user?->email),
            'customer_phone' => $phone = (($ticket->customer?->phone ?? '') !== '' ? $ticket->customer->phone : '01700000000'),
            'customer_address' => $address = ($ticket->customer?->metadata['address'] ?? asset('/')),
            'customer_city' => 'Dhaka',
            'customer_state' => 'Dhaka',
            'customer_country' => 'Bangladesh',
            'customer_post_code' => '1000',
            'discount_amount' => 0,
            'client_ip' => request()->ip() ?: '127.0.0.1',
        ]);

        if (!$payment || empty($payment['checkout_url'])) {
            return null;
        }

        $this->storePaymentMetadata($ticket, array_merge($payment, ['order_number' => $orderNumber]));

        return $payment;
    }

    public function verify(string $orderId): ?array
    {
        return $this->shurjoPay->verifyPayment($orderId);
    }

    public function findTicketByOrderId(string $orderId): ?Ticket
    {
        return Ticket::query()
            ->whereIn('status', ['pending_approval', 'reserved', 'confirmed'])
            ->whereRaw("json_extract(metadata, '$.\"payment\".\"sp_order_id\"') = ?", [$orderId])
            ->first();
    }

    public function findTicketByOrderNumber(string $orderNumber): ?Ticket
    {
        $uuid = $this->extractUuidFromOrderNumber($orderNumber);

        return $uuid ? Ticket::query()->whereNull('cancelled_at')->where('uuid', $uuid)->first() : null;
    }

    public function finalizeSuccessfulPayment(Ticket $ticket, array $verification): Ticket
    {
        $ticket = DB::transaction(function () use ($ticket, $verification) {
            $oldStatus = $ticket->status;
            $alreadyConfirmed = $ticket->status === 'confirmed';

            $ticket->update([
                'status' => 'confirmed',
                'approved_at' => now(),
                'reserved_until' => null,
            ]);

            $this->storePaymentMetadata($ticket->refresh(), [
                'verified' => true,
                'transaction_id' => $verification['sp_tx_id'] ?? ($verification['id'] ?? null),
                'bank_txn_id' => $verification['bank_txn_id'] ?? null,
                'method' => $verification['method'] ?? null,
                'amount' => $verification['transactionAmount'] ?? null,
                'verified_at' => now()->toIso8601String(),
            ]);

            TicketAction::create([
                'ticket_id' => $ticket->id,
                'event_id' => $ticket->event_id,
                'customer_id' => $ticket->customer_id,
                'action' => $alreadyConfirmed ? 'payment_verified' : 'paid',
                'status_from' => $alreadyConfirmed ? 'confirmed' : $oldStatus,
                'status_to' => 'confirmed',
                'actor_id' => null,
                'notes' => 'Payment successful via ShurjoPay. Transaction: ' . ($verification['sp_tx_id'] ?? 'n/a'),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $ticket;
        });

        $this->sendTicketToCustomer($ticket->fresh());

        return $ticket;
    }

    public function markCancelled(Ticket $ticket): void
    {
        TicketAction::create([
            'ticket_id' => $ticket->id,
            'event_id' => $ticket->event_id,
            'customer_id' => $ticket->customer_id,
            'action' => 'payment_cancelled',
            'status_from' => $ticket->status,
            'status_to' => $ticket->status,
            'actor_id' => null,
            'notes' => 'Payment cancelled at ShurjoPay checkout',
        ]);
    }

    protected function sendTicketToCustomer(Ticket $ticket): void
    {
        try {
            $this->ticketService->generateAndSavePdf($ticket);
            $this->ticketService->sendEmail($ticket);
        } catch (\Exception $e) {
            Log::error('Failed to send ticket after payment', [
                'ticket_uuid' => $ticket->uuid,
                'error' => $e->getMessage(),
            ]);
        }
    }

    protected function storePaymentMetadata(Ticket $ticket, array $data): void
    {
        $metadata = $ticket->metadata ?? [];
        $metadata = $this->decodeMetadata($metadata);
        $metadata['payment'] = array_merge($metadata['payment'] ?? [], $data);
        $ticket->metadata = $metadata;
        $ticket->saveQuietly();
    }

    protected function decodeMetadata(mixed $metadata): array
    {
        $decoded = $metadata;

        for ($i = 0; $i < 3 && is_string($decoded); $i++) {
            $decoded = json_decode($decoded, true);
        }

        return is_array($decoded) ? $decoded : [];
    }

    protected function customerName(Ticket $ticket): string
    {
        $customer = $ticket->customer;

        if ($customer) {
            return trim($customer->first_name . ' ' . $customer->last_name);
        }

        return $ticket->user?->name ?? 'Valued Customer';
    }

    protected function generateOrderNumber(string $ticketUuid): string
    {
        return $this->shurjoPay->prefix() . '-' . str_replace('-', '', $ticketUuid);
    }

    protected function extractUuidFromOrderNumber(string $orderNumber): ?string
    {
        $raw = ltrim($orderNumber, '/');

        if (!str_starts_with($raw, $this->shurjoPay->prefix() . '-')) {
            return null;
        }

        $raw = substr($raw, strlen($this->shurjoPay->prefix()) + 1);

        if (!preg_match('/^[a-f0-9]{32}$/i', $raw)) {
            return null;
        }

        return vsprintf('%s-%s-%s-%s-%s', [
            substr($raw, 0, 8),
            substr($raw, 8, 4),
            substr($raw, 12, 4),
            substr($raw, 16, 4),
            substr($raw, 20, 12),
        ]);
    }
}
