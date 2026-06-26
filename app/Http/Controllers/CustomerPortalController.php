<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitVerificationRequest;
use App\Models\Customer;
use App\Models\Event;
use App\Models\Ticket;
use App\Services\CustomerVerificationService;
use App\Services\RegistrationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CustomerPortalController extends Controller
{
    private $registrationService;
    private $verificationService;

    public function __construct(
        RegistrationService $registrationService,
        CustomerVerificationService $verificationService,
    ) {
        $this->registrationService = $registrationService;
        $this->verificationService = $verificationService;
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();
        $customer = $user->customer;

        $tickets = Ticket::with([
            'event:id,title,start_date,end_date,venue_name,event_type,banner_image',
            'session:id,title,location,start_time',
        ])
            ->where('user_id', $user->id)
            ->orWhere(fn ($q) => $customer ? $q->where('customer_id', $customer->id) : $q)
            ->latest('registered_at')
            ->paginate(10);

        $verifications = $customer
            ? $customer->verifications()->latest()->get()
            : collect();

        $stats = [
            'upcoming_events' => Ticket::where('user_id', $user->id)
                ->orWhere(fn ($q) => $customer ? $q->where('customer_id', $customer->id) : $q)
                ->whereHas('event', fn ($q) => $q->where('start_date', '>', now()))
                ->whereNotIn('status', ['cancelled', 'rejected'])
                ->count(),
            'confirmed_tickets' => Ticket::where('user_id', $user->id)
                ->orWhere(fn ($q) => $customer ? $q->where('customer_id', $customer->id) : $q)
                ->where('status', 'confirmed')
                ->count(),
            'verification_status' => $customer?->is_verified ? 'verified' : ($verifications->where('status', 'pending')->count() > 0 ? 'pending' : 'not_submitted'),
        ];

        $registeredEventIds = Ticket::where('user_id', $user->id)
            ->orWhere(fn ($q) => $customer ? $q->where('customer_id', $customer->id) : $q)
            ->whereNotIn('status', ['cancelled', 'rejected'])
            ->pluck('event_id');

        $events = Event::where('status', 'published')
            ->where(function ($q) {
                $q->where('end_date', '>=', now())
                  ->orWhereNull('end_date');
            })
            ->whereNotIn('id', $registeredEventIds)
            ->orderBy('start_date')
            ->get(['id', 'uuid', 'title', 'start_date', 'end_date', 'venue_name', 'event_type', 'banner_image']);

        return Inertia::render('Customer/Dashboard', [
            'tickets' => $tickets,
            'verifications' => $verifications,
            'stats' => $stats,
            'customer' => $customer,
            'events' => $events,
        ]);
    }

    public function registerForm(Request $request, string $uuid)
    {
        $event = Event::published()
            ->with('sessions')
            ->where('uuid', $uuid)
            ->firstOrFail();

        $user = $request->user();

        $existingTicket = $user->tickets()
            ->where('event_id', $event->id)
            ->whereNotIn('status', ['cancelled', 'rejected'])
            ->first();

        if ($existingTicket) {
            return redirect()->route('customer.dashboard')
                ->with('flash', ['info' => 'You are already registered for this event.']);
        }

        return Inertia::render('Customer/Register', [
            'event' => [
                'uuid' => $event->uuid,
                'title' => $event->title,
                'start_date' => $event->start_date,
                'end_date' => $event->end_date,
                'venue_name' => $event->venue_name,
                'venue_address' => $event->venue_address,
                'ticket_price' => $event->ticket_price,
                'max_capacity' => $event->max_capacity,
                'event_type' => $event->event_type,
                'banner_image' => $event->banner_image,
                'sessions' => $event->sessions,
                'isFull' => $event->isFull(),
            ],
            'ticketTypes' => ['general', 'vip', 'vvip'],
        ]);
    }

    public function register(Request $request, string $uuid)
    {
        $event = Event::published()->where('uuid', $uuid)->firstOrFail();

        if ($event->isFull()) {
            return back()->with('flash', ['error' => 'This event is fully booked.']);
        }

        $user = $request->user();
        $customer = $user->customer;

        $existingTicket = $user->tickets()
            ->where('event_id', $event->id)
            ->whereNotIn('status', ['cancelled', 'rejected'])
            ->exists();

        if ($existingTicket) {
            return back()->with('flash', ['error' => 'You are already registered for this event.']);
        }

        $validated = $request->validate([
            'ticket_type' => 'required|in:general,vip,vvip',
            'event_session_id' => 'nullable|exists:event_sessions,id',
        ]);

        try {
            $result = DB::transaction(function () use ($event, $user, $customer, $request, $validated) {
                if (!$customer) {
                    $customer = Customer::create([
                        'uuid' => (string) Str::uuid(),
                        'user_id' => $user->id,
                        'first_name' => $user->name,
                        'last_name' => '',
                        'email' => $user->email,
                        'phone' => '',
                    ]);
                }

                $ticketData = [
                    'ticket_type' => $validated['ticket_type'],
                    'price' => $event->ticket_price ?? 0,
                    'currency' => 'BDT',
                    'status' => 'pending_approval',
                    'event_session_id' => $validated['event_session_id'] ?? null,
                    'user_id' => $user->id,
                ];

                $ticket = $this->registrationService->register($event, $ticketData, $customer);

                $ticket->update(['user_id' => $user->id]);

                return $ticket;
            });

            $msg = 'Registration submitted! It requires admin approval.';

            return redirect()->route('customer.dashboard')
                ->with('flash', ['success' => $msg]);
        } catch (\RuntimeException $e) {
            return back()->with('flash', ['error' => $e->getMessage()]);
        }
    }

    public function verificationForm(Request $request)
    {
        $user = $request->user();
        $customer = $user->customer;

        if (!$customer) {
            return redirect()->route('customer.dashboard')
                ->with('flash', ['error' => 'Complete your profile before submitting verification.']);
        }

        $latestVerification = $customer->latestVerification;

        return Inertia::render('Customer/Verification', [
            'status' => $latestVerification ? $latestVerification->status : 'not_submitted',
            'customer' => [
                'uuid' => $customer->uuid,
                'first_name' => $customer->first_name,
                'last_name' => $customer->last_name,
            ],
            'verification' => $latestVerification ? [
                'uuid' => $latestVerification->uuid,
                'status' => $latestVerification->status,
                'verification_type' => $latestVerification->verification_type,
                'created_at' => $latestVerification->created_at,
                'rejection_reason' => $latestVerification->rejection_reason,
            ] : null,
        ]);
    }

    public function submitVerification(SubmitVerificationRequest $request)
    {
        $user = $request->user();
        $customer = $user->customer;

        if (!$customer) {
            return back()->with('flash', ['error' => 'Customer profile not found.']);
        }

        if ($customer->is_verified) {
            return back()->with('flash', ['info' => 'You are already verified.']);
        }

        try {
            $this->verificationService->submitVerification(
                $customer,
                $request->safe()->except(['document_front', 'document_back', 'selfie_image']),
                $request->file('document_front'),
                $request->file('document_back'),
                $request->file('selfie_image'),
            );

            return redirect()->route('customer.verification')
                ->with('flash', ['success' => 'Verification submitted successfully. It will be reviewed shortly.']);
        } catch (\Exception $e) {
            return back()->with('flash', ['error' => 'Failed to submit verification: ' . $e->getMessage()]);
        }
    }
}
