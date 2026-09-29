<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Services\GuestRegistrationService;
use App\Services\PaymentService;
use App\Services\ShurjoPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService,
        protected GuestRegistrationService $guests,
    ) {
    }

    /**
     * Kick a guest off to the ShurjoPay checkout. No account is required.
     */
    public function initiate(Request $request, string $uuid)
    {
        $ticket = Ticket::with('event')->where('uuid', $uuid)->firstOrFail();

        if ($ticket->status === 'confirmed' && data_get($ticket->metadata, 'payment.verified')) {
            return $this->successResponse($ticket);
        }

        if ($ticket->status !== 'reserved') {
            return $this->failedResponse($ticket, 'This registration is no longer payable.');
        }

        if ($ticket->reserved_until && $ticket->reserved_until->isPast()) {
            $this->guests->discardPendingPayment($ticket);

            return $this->abandonedResponse($ticket, 'Your registration expired before payment was completed.');
        }

        $checkout = $this->paymentService->createCheckoutForTicket($ticket);

        if (! $checkout || empty($checkout['checkout_url'])) {
            Log::error('Payment initiation failed', ['ticket_uuid' => $ticket->uuid]);

            // The gateway never took the money, so the registration goes away too.
            $this->guests->discardPendingPayment($ticket);

            return $this->failedResponse($ticket, 'Could not start the payment. Please try again.');
        }

        return Inertia::location($checkout['checkout_url']);
    }

    public function return(Request $request)
    {
        // ShurjoPay echoes the SP order id back as 'order_id' on the return URL;
        // accept both the newer and legacy parameter names.
        $orderId = $request->query('sp_order_id', $request->query('order_id'));
        if (! $orderId) {
            return redirect()->route('home')
                ->with('flash', ['error' => 'Payment reference not found.']);
        }

        $ticket = $this->paymentService->findTicketByOrderId($orderId);

        // Some gateway revisions echo the merchant order number instead.
        if (! $ticket) {
            $ticket = $this->paymentService->findTicketByOrderNumber($orderId);
        }

        if (! $ticket) {
            return redirect()->route('home')
                ->with('flash', ['error' => 'Paid ticket not found.']);
        }

        if (in_array($ticket->status, ['cancelled', 'rejected'])) {
            return $this->failedResponse($ticket, 'Payment verification failed.');
        }

        // The customer may retry / refresh the return URL after success.
        if ($ticket->status === 'confirmed' && data_get($ticket->metadata, 'payment.verified')) {
            return $this->successResponse($ticket);
        }

        $verification = $this->paymentService->verify($orderId);
        Log::info('ShurjoPay verification result', ['order_id' => $orderId, 'result' => $verification]);

        if ($verification && ShurjoPayService::isSuccessful($verification)) {
            $ticket = $this->paymentService->finalizeSuccessfulPayment($ticket, $verification);

            return $this->successResponse($ticket);
        }

        // Complete or nothing: a failed payment removes the registration.
        $this->guests->discardPendingPayment($ticket);

        return $this->failedResponse($ticket, 'Payment could not be verified. Please try again.');
    }

    public function cancel(Request $request, string $uuid)
    {
        $ticket = Ticket::where('uuid', $uuid)->first();

        if ($ticket && $ticket->status === 'reserved') {
            $this->guests->discardPendingPayment($ticket);
        }

        return redirect()->route('tickets.public.failed')
            ->with('flash', ['warning' => 'Payment cancelled — no registration was kept.']);
    }

    protected function successResponse(Ticket $ticket)
    {
        return redirect()->route('tickets.public.success', ['uuid' => $ticket->uuid])
            ->with('flash', ['success' => 'Payment successful! Your event ticket is booked.']);
    }

    protected function failedResponse(Ticket $ticket, string $reason)
    {
        return redirect()->route('tickets.public.failed')
            ->with('flash', ['error' => $reason]);
    }

    protected function abandonedResponse(Ticket $ticket, string $reason)
    {
        $uuid = $ticket->event?->uuid;

        return $uuid
            ? redirect()->route('events.public.show', $uuid)->with('flash', ['error' => $reason])
            : redirect()->route('home')->with('flash', ['error' => $reason]);
    }
}