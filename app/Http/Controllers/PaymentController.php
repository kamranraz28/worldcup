<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Services\PaymentService;
use App\Services\ShurjoPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function initiate(Request $request, string $uuid)
    {
        $ticket = Ticket::where('uuid', $uuid)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if (in_array($ticket->status, ['cancelled', 'rejected', 'redeemed'])) {
            return redirect()->route('customer.dashboard')
                ->with('flash', ['error' => 'This registration is no longer payable.']);
        }

        if ($ticket->status === 'confirmed' && data_get($ticket->metadata, 'payment.verified')) {
            return redirect()->route('tickets.show', ['ticket' => $ticket->uuid])
                ->with('flash', ['success' => 'Your ticket is already confirmed and paid.']);
        }

        $checkout = $this->paymentService->createCheckoutForTicket($ticket);

        if (!$checkout || empty($checkout['checkout_url'])) {
            Log::error('Payment initiation failed', ['ticket_uuid' => $ticket->uuid]);

            return redirect()->route('customer.dashboard')
                ->with('flash', ['error' => 'Could not start the payment. Please try again.']);
        }

        return Inertia::location($checkout['checkout_url']);
    }

    public function return(Request $request)
    {
        $orderId = $request->query('sp_order_id');
        if (!$orderId) {
            return redirect()->route('customer.dashboard')
                ->with('flash', ['error' => 'Payment reference not found.']);
        }

        $ticket = $this->paymentService->findTicketByOrderId($orderId);

        if (!$ticket) {
            return redirect()->route('customer.dashboard')
                ->with('flash', ['error' => 'Paid ticket not found.']);
        }

        if ($ticket->user_id !== $request->user()?->id || in_array($ticket->status, ['cancelled', 'rejected'])) {
            return redirect()->route('customer.dashboard')
                ->with('flash', ['error' => 'Payment verification failed.']);
        }

        if ($ticket->status === 'confirmed' && data_get($ticket->metadata, 'payment.verified')) {
            return $this->paidResponse($ticket);
        }

        $verification = $this->paymentService->verify($orderId);
        Log::info('ShurjoPay verification result', ['order_id' => $orderId, 'result' => $verification]);

        if ($verification && ShurjoPayService::isSuccessful($verification)) {
            $this->paymentService->finalizeSuccessfulPayment($ticket, $verification);

            return $this->paidResponse($ticket);
        }

        return redirect()->route('customer.dashboard')
            ->with('flash', ['error' => 'Payment could not be verified. Please try again.']);
    }

    public function cancel(Request $request, string $uuid)
    {
        $ticket = Ticket::where('uuid', $uuid)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($ticket) {
            $this->paymentService->markCancelled($ticket);
        }

        return redirect()->route('customer.dashboard')
            ->with('flash', ['warning' => 'Payment cancelled. Your registration is still pending payment.']);
    }

    protected function paidResponse(Ticket $ticket)
    {
        return redirect()->route('tickets.show', ['ticket' => $ticket->uuid])
            ->with('flash', ['success' => 'Payment successful! Your event ticket is booked.']);
    }
}
