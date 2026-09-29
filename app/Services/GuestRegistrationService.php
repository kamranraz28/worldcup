<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketAction;
use App\Support\PhoneNumber;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Guest, account-free registration.
 *
 * A visitor provides name / email / phone, we find-or-create a Customer and
 * book a ticket as 'reserved' (a payment is due) or 'confirmed' (free event or
 * fully covered by a voucher). There is deliberately no 'pending_approval' in
 * this flow — a registration either completes payment or is removed entirely.
 */
class GuestRegistrationService
{
    public function __construct(
        protected RegistrationService $registrationService,
        protected VoucherService $voucherService,
    ) {
    }

    public function register(Event $event, array $input): Ticket
    {
        return DB::transaction(function () use ($event, $input) {
            if ($event->isFull()) {
                throw new \RuntimeException('This event is fully booked.');
            }

            if (! $event->isBookingOpen()) {
                throw new \RuntimeException('Booking for this event has closed.');
            }

            $customer = $this->findOrCreateCustomer($input);

            $ticket = $this->bookTicket($event, $customer, $input);

            // Free or fully-discounted tickets are complete immediately.
            if ($ticket->status === 'confirmed') {
                $ticket->fresh(['event', 'customer']);
            }

            return $ticket;
        });
    }

    protected function findOrCreateCustomer(array $input): Customer
    {
        $name = trim((string) ($input['name'] ?? ''));
        $parts = preg_split('/\s+/', $name, 2);
        $firstName = $parts[0] ?? 'Guest';
        $lastName = trim($parts[1] ?? '');
        $phone = trim((string) ($input['phone'] ?? ''));

        $customer = Customer::where('email', trim($input['email']))->first();

        if (! $customer) {
            $customer = Customer::create([
                'uuid' => (string) Str::uuid(),
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => trim($input['email']),
                'phone' => $phone,
                'is_verified' => false,
            ]);

            return $customer;
        }

        $customer->fill([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'phone' => $phone,
        ])->save();

        return $customer;
    }

    protected function bookTicket(Event $event, Customer $customer, array $input): Ticket
    {
        $basePrice = (float) $event->currentPrice();

        $voucher = null;
        $discount = 0.0;
        $voucherCode = trim((string) ($input['voucher_code'] ?? ''));
        if ($voucherCode !== '') {
            $voucher = $this->voucherService->findUsable($voucherCode);
            $discount = $this->voucherService->calculateDiscount($voucher, $basePrice);
        }

        $price = max(0, round($basePrice - $discount, 2));
        $fullyCovered = $price <= 0;

        $metadata = [];
        if ($event->isEarlyBookingActive()) {
            $metadata['pricing'] = ['early_booking' => true, 'regular_price' => (float) ($event->ticket_price ?? 0)];
        }
        if ($voucher) {
            $metadata['voucher'] = [
                'code' => $voucher->code,
                'percent' => (float) $voucher->discount_percent,
                'discount' => $discount,
                'original_price' => $basePrice,
            ];
        }

        $ticketData = [
            'ticket_type' => $input['ticket_type'] ?? 'general',
            'price' => $price,
            'discount_amount' => $discount,
            'voucher_id' => $voucher?->id,
            'currency' => 'BDT',
            'status' => $fullyCovered ? 'confirmed' : 'reserved',
            'event_session_id' => $input['event_session_id'] ?? null,
            'reserved_until' => $fullyCovered ? null : now()->addHours(2),
            'metadata' => $metadata ?: null,
        ];

        if ($voucher) {
            $this->voucherService->redeem($voucher);
        }

        $ticket = $this->registrationService->register($event, $ticketData, $customer);

        if ($fullyCovered) {
            $ticket->update(['approved_at' => now()]);
            TicketAction::create([
                'ticket_id' => $ticket->id,
                'event_id' => $ticket->event_id,
                'customer_id' => $ticket->customer_id,
                'action' => 'paid',
                'status_from' => 'reserved',
                'status_to' => 'confirmed',
                'actor_id' => null,
                'notes' => $voucher
                    ? "Fully covered by voucher {$voucher->code} ({$voucher->discount_percent}% discount)"
                    : 'Free event — no payment required',
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        }

        return $ticket;
    }

    /**
     * Complete an abandoned payment — remove every trace of the registration.
     * Ticket actions and check-ins cascade on delete.
     *
     * A guest who fills the form and never pays should not linger in the
     * attendee list, so an account-free customer left with no tickets at all
     * is soft-deleted alongside the registration.
     */
    public function discardPendingPayment(Ticket $ticket): void
    {
        $customerId = $ticket->customer_id;

        $ticket->delete();

        if ($customerId === null) {
            return;
        }

        $customer = Customer::find($customerId);

        if (! $customer || $customer->user_id !== null) {
            return;
        }

        if (! $customer->tickets()->exists()) {
            $customer->delete();
        }
    }

    /**
     * Prune every 'reserved' ticket whose payment window has lapsed.
     *
     * @return int number of tickets removed
     */
    public function pruneExpiredReservations(): int
    {
        $expired = Ticket::where('status', 'reserved')
            ->whereNotNull('reserved_until')
            ->where('reserved_until', '<', now())
            ->with('customer')
            ->get();

        $count = 0;
        foreach ($expired as $ticket) {
            try {
                $this->discardPendingPayment($ticket);
                $count++;
            } catch (\Throwable $e) {
                Log::warning('Failed to prune abandoned reservation', [
                    'ticket_uuid' => $ticket->uuid,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $count;
    }

    /**
     * A readable attendee line used by the payment gateway / tickets.
     */
    public function customerName(Customer $customer): string
    {
        return $customer->full_name ?: 'Valued Guest';
    }

    public function normalizePhone(?string $phone): ?string
    {
        return PhoneNumber::normalize($phone);
    }
}