<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CheckIn;
use App\Models\Customer;
use App\Models\CustomerVerification;
use App\Models\Event;
use App\Models\Ticket;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $now = now();

        $eventsThisMonth = Event::whereMonth('start_date', $now->month)
            ->whereYear('start_date', $now->year)
            ->count();

        $eventsLastMonth = Event::whereMonth('start_date', $now->copy()->subMonth()->month)
            ->whereYear('start_date', $now->copy()->subMonth()->year)
            ->count();

        $eventChange = $eventsLastMonth > 0
            ? round((($eventsThisMonth - $eventsLastMonth) / $eventsLastMonth) * 100, 1)
            : 100;

        $ticketsSoldThisMonth = Ticket::where('status', 'confirmed')
            ->whereMonth('created_at', $now->month)
            ->count();

        $ticketsSoldLastMonth = Ticket::where('status', 'confirmed')
            ->whereMonth('created_at', $now->copy()->subMonth()->month)
            ->count();

        $ticketChange = $ticketsSoldLastMonth > 0
            ? round((($ticketsSoldThisMonth - $ticketsSoldLastMonth) / $ticketsSoldLastMonth) * 100, 1)
            : 100;

        $checkinsToday = CheckIn::whereDate('scanned_at', $today = $now->toDateString())->count();
        $checkinsYesterday = CheckIn::whereDate('scanned_at', $now->copy()->subDay()->toDateString())->count();
        $checkinChange = $checkinsYesterday > 0
            ? round((($checkinsToday - $checkinsYesterday) / $checkinsYesterday) * 100, 1)
            : ($checkinsToday > 0 ? 100 : 0);

        $totalCapacity = Event::published()->sum('max_capacity');
        $totalTickets = Ticket::whereIn('status', ['confirmed', 'redeemed'])->count();
        $capacityPercent = $totalCapacity > 0 ? round(($totalTickets / $totalCapacity) * 100, 1) : 0;

        return Inertia::render('Dashboard', [
            'stats' => [
                'activeEvents' => [
                    'value' => Event::published()->upcoming()->count(),
                    'change' => $eventChange,
                    'direction' => $eventChange >= 0 ? 'up' : 'down',
                ],
                'ticketsSold' => [
                    'value' => Ticket::confirmed()->count(),
                    'change' => $ticketChange,
                    'direction' => $ticketChange >= 0 ? 'up' : 'down',
                ],
                'checkinsToday' => [
                    'value' => $checkinsToday,
                    'change' => $checkinChange,
                    'direction' => $checkinChange >= 0 ? 'up' : 'down',
                ],
                'capacityUtilized' => [
                    'value' => $capacityPercent,
                    'change' => 5.2,
                    'direction' => 'up',
                    'suffix' => '%',
                ],
            ],
            'chartData' => [
                'registrationTrend' => $this->getRegistrationTrend(14),
                'ticketSalesByType' => $this->getTicketSalesByType(),
                'verificationStatus' => $this->getVerificationStatus(),
                'weeklyCheckins' => $this->getWeeklyCheckins(),
                'eventCapacity' => $this->getEventCapacity(),
            ],
            'recentActivity' => $this->getRecentActivity(),
            'upcomingEvents' => Event::published()
                ->upcoming()
                ->withCount(['tickets as confirmed_count' => fn ($q) => $q->where('status', 'confirmed')])
                ->withCount(['tickets as total_count'])
                ->latest('start_date')
                ->take(4)
                ->get()
                ->map(fn ($e) => [
                    'id' => $e->id,
                    'uuid' => $e->uuid,
                    'title' => $e->title,
                    'slug' => $e->slug,
                    'event_type' => $e->event_type,
                    'venue_name' => $e->venue_name,
                    'start_date' => $e->start_date->toIso8601String(),
                    'end_date' => $e->end_date->toIso8601String(),
                    'banner_image' => $e->banner_image,
                    'max_capacity' => $e->max_capacity,
                    'confirmed_count' => $e->confirmed_count,
                    'total_count' => $e->total_count,
                    'fill_percent' => $e->max_capacity > 0
                        ? round(($e->confirmed_count / $e->max_capacity) * 100)
                        : 0,
                ]),
            'pendingVerifications' => CustomerVerification::with('customer')
                ->pending()
                ->latest()
                ->take(5)
                ->get()
                ->map(fn ($v) => [
                    'id' => $v->id,
                    'uuid' => $v->uuid,
                    'customer_name' => $v->customer?->full_name ?? 'Unknown',
                    'verification_type' => $v->verification_type,
                    'submitted_at' => $v->created_at->diffForHumans(),
                ]),
        ]);
    }

    private function getRegistrationTrend(int $days): array
    {
        $data = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $data[] = [
                'date' => $date->format('M d'),
                'registrations' => Customer::whereDate('created_at', $date)->count(),
                'verifications' => CustomerVerification::whereDate('created_at', $date)->count(),
            ];
        }
        return $data;
    }

    private function getTicketSalesByType(): array
    {
        return Ticket::confirmed()
            ->selectRaw('ticket_type, COUNT(*) as total, SUM(price) as revenue')
            ->groupBy('ticket_type')
            ->get()
            ->map(fn ($t) => [
                'type' => $t->ticket_type,
                'count' => (int) $t->total,
                'revenue' => (float) $t->revenue,
            ])
            ->toArray();
    }

    private function getVerificationStatus(): array
    {
        return [
            ['status' => 'pending', 'count' => CustomerVerification::pending()->count()],
            ['status' => 'in_review', 'count' => CustomerVerification::inReview()->count()],
            ['status' => 'verified', 'count' => CustomerVerification::where('status', 'verified')->count()],
            ['status' => 'rejected', 'count' => CustomerVerification::where('status', 'rejected')->count()],
        ];
    }

    private function getWeeklyCheckins(): array
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $data[] = [
                'day' => $date->format('D'),
                'checkins' => CheckIn::whereDate('scanned_at', $date)->count(),
            ];
        }
        return $data;
    }

    private function getEventCapacity(): array
    {
        return Event::published()
            ->upcoming()
            ->take(5)
            ->get()
            ->map(fn ($e) => [
                'name' => \Illuminate\Support\Str::limit($e->title, 20),
                'capacity' => $e->max_capacity,
                'filled' => $e->tickets()->whereIn('status', ['confirmed', 'redeemed'])->count(),
            ])
            ->toArray();
    }

    private function getRecentActivity(): array
    {
        $activities = collect();

        $recentVerifications = CustomerVerification::with('customer')
            ->latest()
            ->take(3)
            ->get()
            ->map(fn ($v) => [
                'type' => 'verification',
                'action' => $v->status === 'verified' ? 'verified' : ($v->status === 'rejected' ? 'rejected' : 'submitted'),
                'subject' => $v->customer?->full_name ?? 'A customer',
                'detail' => $v->verification_type . ' verification ' . $v->status,
                'time' => $v->created_at->diffForHumans(),
                'icon' => $v->status === 'verified' ? 'check' : ($v->status === 'rejected' ? 'x' : 'clock'),
            ]);

        $recentTickets = Ticket::with('customer')
            ->latest()
            ->take(3)
            ->get()
            ->map(fn ($t) => [
                'type' => 'ticket',
                'action' => 'purchased',
                'subject' => $t->customer?->full_name ?? 'A fan',
                'detail' => "{$t->ticket_type} ticket",
                'time' => $t->created_at->diffForHumans(),
                'icon' => 'ticket',
            ]);

        $recentCheckins = CheckIn::with('customer')
            ->latest()
            ->take(3)
            ->get()
            ->map(fn ($c) => [
                'type' => 'checkin',
                'action' => 'checked in',
                'subject' => $c->customer?->full_name ?? 'A fan',
                'detail' => 'to event',
                'time' => $c->scanned_at->diffForHumans(),
                'icon' => 'checkin',
            ]);

        $activities = $recentVerifications
            ->concat($recentTickets)
            ->concat($recentCheckins)
            ->sortByDesc(fn ($a) => strtotime(str_replace([' seconds', ' minutes', ' hours', ' days', ' weeks', ' ago'], '', $a['time'])))
            ->take(8)
            ->values()
            ->toArray();

        if (empty($activities)) {
            $activities = [
                ['type' => 'system', 'action' => 'started', 'subject' => 'Platform', 'detail' => 'Toffee World Cup 2026 platform is live', 'time' => 'just now', 'icon' => 'system'],
            ];
        }

        return $activities;
    }
}
