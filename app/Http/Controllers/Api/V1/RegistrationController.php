<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRegistrationRequest;
use App\Models\Event;
use App\Services\RegistrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    private $registrationService;

    public function __construct(RegistrationService $registrationService)
    {
        $this->registrationService = $registrationService;
    }

    public function register(StoreRegistrationRequest $request): JsonResponse
    {
        $event = Event::find($request->input('event_id'));

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        try {
            $ticket = $this->registrationService->register($event, $request->validated());

            return response()->json([
                'message' => 'Registration successful',
                'registration' => $ticket->load('event:id,title', 'customer:id,first_name,last_name'),
            ], 201);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function status(string $uuid): JsonResponse
    {
        $ticket = $this->registrationService->find($uuid);

        if (!$ticket) {
            return response()->json(['error' => 'Registration not found'], 404);
        }

        return response()->json([
            'uuid' => $ticket->uuid,
            'status' => $ticket->status,
            'event' => $ticket->event->only(['uuid', 'title']),
            'customer' => $ticket->customer ? $ticket->customer->only(['uuid', 'first_name', 'last_name', 'email']) : null,
            'ticket_type' => $ticket->ticket_type,
            'registered_at' => $ticket->registered_at,
            'approved_at' => $ticket->approved_at,
            'checked_in_at' => $ticket->checked_in_at,
        ]);
    }

    public function checkAvailability(Event $event): JsonResponse
    {
        $confirmedCount = $event->tickets()->whereIn('status', ['confirmed', 'redeemed'])->count();
        $available = $event->max_capacity ? $event->max_capacity - $confirmedCount : null;

        return response()->json([
            'event_uuid' => $event->uuid,
            'event_title' => $event->title,
            'max_capacity' => $event->max_capacity,
            'confirmed' => $confirmedCount,
            'available' => $available,
            'is_full' => $event->isFull(),
        ]);
    }

    public function byEvent(Event $event): JsonResponse
    {
        $registrations = $event->tickets()
            ->with('customer:id,first_name,last_name,email')
            ->latest()
            ->get();

        return response()->json([
            'event' => $event->only(['uuid', 'title']),
            'total' => $registrations->count(),
            'registrations' => $registrations,
        ]);
    }
}
