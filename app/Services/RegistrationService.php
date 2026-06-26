<?php

namespace App\Services;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketAction;
use App\Models\WaitingList;
use App\Repositories\Contracts\RegistrationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RegistrationService
{
    private $registrationRepository;

    public function __construct(RegistrationRepositoryInterface $registrationRepository)
    {
        $this->registrationRepository = $registrationRepository;
    }

    public function find(string $uuid): ?Ticket
    {
        return $this->registrationRepository->find($uuid);
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->registrationRepository->paginate($filters, $perPage);
    }

    public function register(Event $event, array $data, $customer = null): Ticket
    {
        return DB::transaction(function () use ($event, $data, $customer) {
            if ($event->isFull()) {
                throw new \RuntimeException('Event is at full capacity. Please join the waiting list.');
            }

            $data['event_id'] = $event->id;
            $data['uuid'] = (string) Str::uuid();
            $data['qr_code'] = (string) Str::uuid();
            $data['status'] = $data['status'] ?? ($event->requires_verification ? 'pending_approval' : 'confirmed');
            $data['registered_at'] = now();

            if ($customer) {
                $data['customer_id'] = $customer->id;
            }

            if (!isset($data['ticket_type'])) {
                $data['ticket_type'] = 'general';
            }

            $ticket = $this->registrationRepository->create($data);

            $this->logAction($ticket, 'registered', null, $ticket->status, 'Registration submitted');

            return $ticket;
        });
    }

    public function approve(Ticket $ticket, string $notes = null): Ticket
    {
        return DB::transaction(function () use ($ticket, $notes) {
            if (!$ticket->canBeApproved()) {
                throw new \RuntimeException('This registration cannot be approved in its current state.');
            }

            $oldStatus = $ticket->status;
            $updated = $this->registrationRepository->update($ticket, [
                'status' => 'confirmed',
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);

            $this->logAction($updated, 'approved', $oldStatus, 'confirmed', $notes ?? 'Registration approved');

            return $updated;
        });
    }

    public function reject(Ticket $ticket, string $reason, string $notes = null): Ticket
    {
        return DB::transaction(function () use ($ticket, $reason, $notes) {
            if (!$ticket->canBeRejected()) {
                throw new \RuntimeException('This registration cannot be rejected in its current state.');
            }

            $oldStatus = $ticket->status;
            $updated = $this->registrationRepository->update($ticket, [
                'status' => 'rejected',
                'rejected_by' => auth()->id(),
                'rejected_at' => now(),
                'rejection_reason' => $reason,
            ]);

            $this->logAction($updated, 'rejected', $oldStatus, 'rejected', $notes ?? $reason);

            return $updated;
        });
    }

    public function cancel(Ticket $ticket, string $reason = null): Ticket
    {
        return DB::transaction(function () use ($ticket, $reason) {
            $oldStatus = $ticket->status;
            $updated = $this->registrationRepository->update($ticket, [
                'status' => 'cancelled',
                'rejection_reason' => $reason,
            ]);

            $this->logAction($updated, 'cancelled', $oldStatus, 'cancelled', $reason ?? 'Registration cancelled');

            return $updated;
        });
    }

    public function joinWaitingList(Event $event, int $customerId, string $ticketType = 'general'): WaitingList
    {
        return DB::transaction(function () use ($event, $customerId, $ticketType) {
            $currentPosition = WaitingList::byEvent($event->id)->active()->max('position') ?? 0;

            return WaitingList::create([
                'event_id' => $event->id,
                'customer_id' => $customerId,
                'ticket_type' => $ticketType,
                'status' => 'waiting',
                'position' => $currentPosition + 1,
                'max_positions' => $event->max_capacity,
            ]);
        });
    }

    public function notifyFromWaitingList(Event $event, int $count = 1): Collection
    {
        return DB::transaction(function () use ($event, $count) {
            $entries = WaitingList::byEvent($event->id)
                ->waiting()
                ->orderBy('position')
                ->take($count)
                ->get();

            foreach ($entries as $entry) {
                $entry->update([
                    'status' => 'notified',
                    'notified_by' => auth()->id(),
                    'notified_at' => now(),
                ]);
            }

            return $entries;
        });
    }

    public function convertWaitingToTicket(WaitingList $entry, array $ticketData): Ticket
    {
        return DB::transaction(function () use ($entry, $ticketData) {
            $ticketData['event_id'] = $entry->event_id;
            $ticketData['customer_id'] = $entry->customer_id;
            $ticketData['ticket_type'] = $ticketData['ticket_type'] ?? $entry->ticket_type;

            $ticket = $this->register($entry->event, $ticketData, $entry->customer);

            $entry->update(['status' => 'converted']);

            return $ticket;
        });
    }

    public function bulkImport(Event $event, array $registrations): Collection
    {
        return DB::transaction(function () use ($event, $registrations) {
            $tickets = collect();

            foreach ($registrations as $data) {
                $customer = null;
                if (!empty($data['customer_id'])) {
                    $customer = \App\Models\Customer::find($data['customer_id']);
                }

                $ticketData = [
                    'ticket_type' => $data['ticket_type'] ?? 'general',
                    'price' => $data['price'] ?? 0,
                    'currency' => $data['currency'] ?? 'BDT',
                    'status' => $data['status'] ?? 'confirmed',
                    'metadata' => json_encode(['imported' => true, 'import_batch' => (string) Str::uuid()]),
                ];

                if ($customer) {
                    $ticketData['customer_id'] = $customer->id;
                }

                $tickets->push($this->register($event, $ticketData, $customer));
            }

            return $tickets;
        });
    }

    public function export(array $filters = []): Collection
    {
        $query = Ticket::with(['event:id,title', 'customer:id,first_name,last_name,email,phone,nationality']);

        if (!empty($filters['event_id'])) {
            $query->byEvent((int) $filters['event_id']);
        }
        if (!empty($filters['status'])) {
            $query->byStatus($filters['status']);
        }
        if (!empty($filters['date_from'])) {
            $query->byDateRange($filters['date_from'], $filters['date_to'] ?? null);
        }

        return $query->latest()->get();
    }

    public function getActions(Ticket $ticket): Collection
    {
        return TicketAction::where('ticket_id', $ticket->id)
            ->with(['actor:id,name'])
            ->recent()
            ->get();
    }

    public function getWaitingList(Event $event): Collection
    {
        return WaitingList::with(['customer:id,first_name,last_name,email,phone'])
            ->byEvent($event->id)
            ->active()
            ->orderBy('position')
            ->get();
    }

    public function getStats(): array
    {
        $statusCounts = $this->registrationRepository->countByStatus();

        return [
            'by_status' => $statusCounts,
            'total' => array_sum($statusCounts),
            'confirmed' => $statusCounts['confirmed'] ?? 0,
            'pending_approval' => $statusCounts['pending_approval'] ?? 0,
            'cancelled' => $statusCounts['cancelled'] ?? 0,
            'rejected' => $statusCounts['rejected'] ?? 0,
            'today' => Ticket::whereDate('created_at', today())->count(),
        ];
    }

    private function logAction(Ticket $ticket, string $action, $statusFrom, $statusTo, string $notes = null): void
    {
        TicketAction::create([
            'ticket_id' => $ticket->id,
            'event_id' => $ticket->event_id,
            'customer_id' => $ticket->customer_id,
            'action' => $action,
            'status_from' => $statusFrom,
            'status_to' => $statusTo,
            'actor_id' => auth()->id(),
            'notes' => $notes,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
