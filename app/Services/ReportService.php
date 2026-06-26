<?php

namespace App\Services;

use App\Models\CheckIn;
use App\Models\Customer;
use App\Models\CustomerVerification;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketAction;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function registrationReport(array $filters = []): array
    {
        $query = Ticket::with(['event:id,title,start_date,venue_name', 'customer:id,first_name,last_name,email,phone,nationality']);

        if (!empty($filters['event_id'])) {
            $query->where('event_id', (int) $filters['event_id']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['ticket_type'])) {
            $query->where('ticket_type', $filters['ticket_type']);
        }
        if (!empty($filters['date_from'])) {
            $query->where('created_at', '>=', Carbon::parse($filters['date_from'])->startOfDay());
        }
        if (!empty($filters['date_to'])) {
            $query->where('created_at', '<=', Carbon::parse($filters['date_to'])->endOfDay());
        }

        $tickets = $query->latest()->get();

        $totalTickets = $tickets->count();
        $totalRevenue = $tickets->sum('price');
        $statusBreakdown = $tickets->groupBy('status')->map->count();
        $typeBreakdown = $tickets->groupBy('ticket_type')->map->count();

        $dailyTrend = $tickets->groupBy(function ($t) {
            return $t->created_at->format('Y-m-d');
        })->map(function ($group) {
            return ['count' => $group->count(), 'revenue' => $group->sum('price')];
        })->sortKeys();

        return [
            'summary' => [
                'total_tickets' => $totalTickets,
                'total_revenue' => $totalRevenue,
                'average_price' => $totalTickets > 0 ? round($totalRevenue / $totalTickets, 2) : 0,
                'currency' => $tickets->first()->currency ?? 'BDT',
                'confirmed' => $statusBreakdown->get('confirmed', 0),
                'pending_approval' => $statusBreakdown->get('pending_approval', 0),
                'redeemed' => $statusBreakdown->get('redeemed', 0),
                'rejected' => $statusBreakdown->get('rejected', 0),
                'cancelled' => $statusBreakdown->get('cancelled', 0),
                'reserved' => $statusBreakdown->get('reserved', 0),
            ],
            'by_type' => $typeBreakdown->map(function ($count, $type) use ($tickets) {
                $typeTickets = $tickets->where('ticket_type', $type);
                return [
                    'type' => $type,
                    'count' => $count,
                    'revenue' => $typeTickets->sum('price'),
                    'avg_price' => $count > 0 ? round($typeTickets->sum('price') / $count, 2) : 0,
                ];
            })->values(),
            'by_status' => $statusBreakdown->map(function ($count, $status) {
                return ['status' => $status, 'count' => $count];
            })->values(),
            'daily_trend' => $dailyTrend->map(function ($data, $date) {
                return ['date' => $date, 'count' => $data['count'], 'revenue' => $data['revenue']];
            })->values(),
            'tickets' => $tickets->map(function ($t) {
                return [
                    'uuid' => $t->uuid,
                    'ticket_type' => $t->ticket_type,
                    'price' => $t->price,
                    'currency' => $t->currency,
                    'status' => $t->status,
                    'qr_code' => $t->qr_code,
                    'registered_at' => $t->registered_at,
                    'approved_at' => $t->approved_at,
                    'checked_in_at' => $t->checked_in_at,
                    'event' => $t->event ? ['title' => $t->event->title] : null,
                    'customer' => $t->customer ? [
                        'first_name' => $t->customer->first_name,
                        'last_name' => $t->customer->last_name,
                        'email' => $t->customer->email,
                        'phone' => $t->customer->phone,
                        'nationality' => $t->customer->nationality,
                    ] : null,
                ];
            }),
        ];
    }

    public function attendanceReport(array $filters = []): array
    {
        $query = CheckIn::with([
            'event:id,title,start_date,venue_name',
            'customer:id,first_name,last_name,email,nationality',
            'ticket:id,uuid,ticket_type,status',
            'scanner:id,name',
        ]);

        if (!empty($filters['event_id'])) {
            $query->where('event_id', (int) $filters['event_id']);
        }
        if (!empty($filters['is_valid'])) {
            $query->where('is_valid', filter_var($filters['is_valid'], FILTER_VALIDATE_BOOLEAN));
        }
        if (!empty($filters['scan_method'])) {
            $query->where('scan_method', $filters['scan_method']);
        }
        if (!empty($filters['date_from'])) {
            $query->where('scanned_at', '>=', Carbon::parse($filters['date_from'])->startOfDay());
        }
        if (!empty($filters['date_to'])) {
            $query->where('scanned_at', '<=', Carbon::parse($filters['date_to'])->endOfDay());
        }

        $checkIns = $query->latest('scanned_at')->get();

        $totalScans = $checkIns->count();
        $validScans = $checkIns->where('is_valid', true)->count();
        $invalidScans = $checkIns->where('is_valid', false)->count();
        $methodBreakdown = $checkIns->groupBy('scan_method')->map->count();

        $byEvent = $checkIns->groupBy('event_id')->map(function ($group) {
            $event = $group->first()->event;
            return [
                'event_title' => $event->title ?? 'Unknown',
                'total' => $group->count(),
                'valid' => $group->where('is_valid', true)->count(),
                'invalid' => $group->where('is_valid', false)->count(),
            ];
        })->values();

        $hourlyDistribution = $checkIns->groupBy(function ($c) {
            return Carbon::parse($c->scanned_at)->format('H:00');
        })->map->count()->sortKeys();

        $dailyTrend = $checkIns->groupBy(function ($c) {
            return Carbon::parse($c->scanned_at)->format('Y-m-d');
        })->map->count()->sortKeys();

        return [
            'summary' => [
                'total_scans' => $totalScans,
                'valid_scans' => $validScans,
                'invalid_scans' => $invalidScans,
                'attendance_rate' => $totalScans > 0 ? round(($validScans / $totalScans) * 100, 1) : 0,
                'unique_customers' => $checkIns->pluck('customer_id')->unique()->count(),
                'unique_events' => $checkIns->pluck('event_id')->unique()->count(),
            ],
            'by_method' => $methodBreakdown->map(function ($count, $method) {
                return ['method' => $method, 'count' => $count];
            })->values(),
            'by_event' => $byEvent,
            'hourly_distribution' => $hourlyDistribution->map(function ($count, $hour) {
                return ['hour' => $hour, 'count' => $count];
            })->values(),
            'daily_trend' => $dailyTrend->map(function ($count, $date) {
                return ['date' => $date, 'count' => $count];
            })->values(),
            'checkins' => $checkIns->map(function ($c) {
                return [
                    'id' => $c->id,
                    'is_valid' => $c->is_valid,
                    'scan_method' => $c->scan_method,
                    'scanned_at' => $c->scanned_at,
                    'event' => $c->event ? ['title' => $c->event->title] : null,
                    'customer' => $c->customer ? [
                        'first_name' => $c->customer->first_name,
                        'last_name' => $c->customer->last_name,
                        'email' => $c->customer->email,
                        'nationality' => $c->customer->nationality,
                    ] : null,
                    'ticket' => $c->ticket ? [
                        'ticket_type' => $c->ticket->ticket_type,
                        'status' => $c->ticket->status,
                    ] : null,
                    'scanner' => $c->scanner ? $c->scanner->name : 'System',
                ];
            }),
        ];
    }

    public function verificationReport(array $filters = []): array
    {
        $query = CustomerVerification::with([
            'customer:id,first_name,last_name,email,nationality',
            'reviewer:id,name',
        ]);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['verification_type'])) {
            $query->where('verification_type', $filters['verification_type']);
        }
        if (!empty($filters['reviewer_id'])) {
            $query->where('reviewed_by', (int) $filters['reviewer_id']);
        }
        if (!empty($filters['date_from'])) {
            $query->where('created_at', '>=', Carbon::parse($filters['date_from'])->startOfDay());
        }
        if (!empty($filters['date_to'])) {
            $query->where('created_at', '<=', Carbon::parse($filters['date_to'])->endOfDay());
        }

        $verifications = $query->latest()->get();

        $totalVerifications = $verifications->count();
        $statusBreakdown = $verifications->groupBy('status')->map->count();
        $typeBreakdown = $verifications->groupBy('verification_type')->map->count();
        $reviewerBreakdown = $verifications->groupBy('reviewed_by')->map(function ($group) {
            $reviewer = $group->first()->reviewer;
            return [
                'name' => $reviewer->name ?? 'Unassigned',
                'count' => $group->count(),
                'approved' => $group->where('status', 'verified')->count(),
                'rejected' => $group->where('status', 'rejected')->count(),
            ];
        })->values();

        $dailyTrend = $verifications->groupBy(function ($v) {
            return $v->created_at->format('Y-m-d');
        })->map->count()->sortKeys();

        $avgReviewTime = $verifications->filter(function ($v) {
            return $v->reviewed_at && $v->created_at;
        })->avg(function ($v) {
            return Carbon::parse($v->reviewed_at)->diffInHours(Carbon::parse($v->created_at));
        });

        return [
            'summary' => [
                'total_verifications' => $totalVerifications,
                'verified' => $statusBreakdown->get('verified', 0),
                'rejected' => $statusBreakdown->get('rejected', 0),
                'pending' => $statusBreakdown->get('pending', 0),
                'in_review' => $statusBreakdown->get('in_review', 0),
                'flagged' => $statusBreakdown->get('flagged', 0),
                'verification_rate' => $totalVerifications > 0 ? round(($statusBreakdown->get('verified', 0) / $totalVerifications) * 100, 1) : 0,
                'avg_review_time_hours' => round($avgReviewTime ?: 0, 1),
            ],
            'by_status' => $statusBreakdown->map(function ($count, $status) {
                return ['status' => $status, 'count' => $count];
            })->values(),
            'by_type' => $typeBreakdown->map(function ($count, $type) {
                return ['type' => $type, 'count' => $count];
            })->values(),
            'by_reviewer' => $reviewerBreakdown,
            'daily_trend' => $dailyTrend->map(function ($count, $date) {
                return ['date' => $date, 'count' => $count];
            })->values(),
            'verifications' => $verifications->map(function ($v) {
                return [
                    'uuid' => $v->uuid,
                    'status' => $v->status,
                    'verification_type' => $v->verification_type,
                    'submitted_at' => $v->created_at,
                    'reviewed_at' => $v->reviewed_at,
                    'notes' => $v->notes,
                    'customer' => $v->customer ? [
                        'first_name' => $v->customer->first_name,
                        'last_name' => $v->customer->last_name,
                        'email' => $v->customer->email,
                        'nationality' => $v->customer->nationality,
                    ] : null,
                    'reviewer' => $v->reviewer ? $v->reviewer->name : 'Unassigned',
                ];
            }),
        ];
    }

    public function scannerReport(array $filters = []): array
    {
        $scannerQuery = CheckIn::with(['scanner:id,name', 'event:id,title']);

        if (!empty($filters['event_id'])) {
            $scannerQuery->where('event_id', (int) $filters['event_id']);
        }
        if (!empty($filters['date_from'])) {
            $scannerQuery->where('scanned_at', '>=', Carbon::parse($filters['date_from'])->startOfDay());
        }
        if (!empty($filters['date_to'])) {
            $scannerQuery->where('scanned_at', '<=', Carbon::parse($filters['date_to'])->endOfDay());
        }
        if (!empty($filters['scanner_id'])) {
            $scannerQuery->where('scanned_by', (int) $filters['scanner_id']);
        }

        $allScans = $scannerQuery->get();

        $totalScans = $allScans->count();
        $byScanner = $allScans->groupBy('scanned_by')->map(function ($group) {
            $scanner = $group->first()->scanner;
            return [
                'name' => $scanner->name ?? 'System',
                'total_scans' => $group->count(),
                'valid_scans' => $group->where('is_valid', true)->count(),
                'invalid_scans' => $group->where('is_valid', false)->count(),
                'unique_events' => $group->pluck('event_id')->unique()->count(),
                'qr_scans' => $group->where('scan_method', 'qr')->count(),
                'manual_scans' => $group->where('scan_method', 'manual')->count(),
                'last_scan_at' => $group->max('scanned_at'),
            ];
        })->values();

        $byDevice = $allScans->groupBy('device_id')->map(function ($group, $device) {
            return [
                'device' => $device ?: 'Unknown',
                'count' => $group->count(),
            ];
        })->values();

        $dailyTrend = $allScans->groupBy(function ($s) {
            return Carbon::parse($s->scanned_at)->format('Y-m-d');
        })->map->count()->sortKeys();

        return [
            'summary' => [
                'total_scans' => $totalScans,
                'active_scanners' => $allScans->whereNotNull('scanned_by')->pluck('scanned_by')->unique()->count(),
                'unique_devices' => $allScans->whereNotNull('device_id')->pluck('device_id')->unique()->count(),
                'qr_scans' => $allScans->where('scan_method', 'qr')->count(),
                'manual_scans' => $allScans->where('scan_method', 'manual')->count(),
                'period' => !empty($filters['date_from']) && !empty($filters['date_to'])
                    ? Carbon::parse($filters['date_from'])->format('M d') . ' - ' . Carbon::parse($filters['date_to'])->format('M d, Y')
                    : 'All time',
            ],
            'by_scanner' => $byScanner,
            'by_device' => $byDevice,
            'daily_trend' => $dailyTrend->map(function ($count, $date) {
                return ['date' => $date, 'count' => $count];
            })->values(),
            'scans' => $allScans->map(function ($s) {
                return [
                    'id' => $s->id,
                    'is_valid' => $s->is_valid,
                    'scan_method' => $s->scan_method,
                    'device_id' => $s->device_id,
                    'scanned_at' => $s->scanned_at,
                    'event' => $s->event ? ['title' => $s->event->title] : null,
                    'scanner' => $s->scanner ? $s->scanner->name : 'System',
                ];
            }),
        ];
    }

    public function dashboardAnalytics(array $filters = []): array
    {
        $now = now();
        $daysBack = (int) ($filters['days'] ?? 30);
        $startDate = $now->copy()->subDays($daysBack);

        $registrationTrend = Ticket::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(price) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($row) {
                return ['date' => $row->date, 'count' => (int) $row->count, 'revenue' => (float) ($row->revenue ?: 0)];
            });

        $attendanceTrend = CheckIn::where('scanned_at', '>=', $startDate)
            ->selectRaw('DATE(scanned_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($row) {
                return ['date' => $row->date, 'count' => (int) $row->count];
            });

        $verificationTrend = CustomerVerification::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($row) {
                return ['date' => $row->date, 'count' => (int) $row->count];
            });

        $revenueByType = Ticket::whereIn('status', ['confirmed', 'redeemed'])
            ->selectRaw('ticket_type, COUNT(*) as count, SUM(price) as revenue')
            ->groupBy('ticket_type')
            ->get()
            ->map(function ($row) {
                return ['type' => $row->ticket_type, 'count' => (int) $row->count, 'revenue' => (float) ($row->revenue ?: 0)];
            });

        $topEvents = Event::published()
            ->withCount(['tickets as confirmed_tickets' => fn ($q) => $q->where('status', 'confirmed')])
            ->withCount(['tickets as redeemed_tickets' => fn ($q) => $q->where('status', 'redeemed')])
            ->orderByDesc('confirmed_tickets')
            ->take(10)
            ->get()
            ->map(function ($e) {
                return [
                    'title' => $e->title,
                    'confirmed' => (int) $e->confirmed_tickets,
                    'redeemed' => (int) $e->redeemed_tickets,
                    'attendance_rate' => $e->confirmed_tickets > 0
                        ? round(($e->redeemed_tickets / $e->confirmed_tickets) * 100, 1) : 0,
                ];
            });

        $verificationFunnel = [
            ['stage' => 'Submitted', 'count' => CustomerVerification::count()],
            ['stage' => 'In Review', 'count' => CustomerVerification::where('status', 'in_review')->count()],
            ['stage' => 'Verified', 'count' => CustomerVerification::where('status', 'verified')->count()],
            ['stage' => 'Rejected', 'count' => CustomerVerification::where('status', 'rejected')->count()],
        ];

        $todayStats = [
            'registrations_today' => Ticket::whereDate('created_at', $now)->count(),
            'checkins_today' => CheckIn::whereDate('scanned_at', $now)->count(),
            'verifications_today' => CustomerVerification::whereDate('created_at', $now)->count(),
            'revenue_today' => Ticket::whereIn('status', ['confirmed', 'redeemed'])
                ->whereDate('created_at', $now)->sum('price'),
            'pending_verifications' => CustomerVerification::pending()->count(),
            'upcoming_events' => Event::published()->upcoming()->count(),
        ];

        return [
            'today_stats' => $todayStats,
            'registration_trend' => $registrationTrend,
            'attendance_trend' => $attendanceTrend,
            'verification_trend' => $verificationTrend,
            'revenue_by_type' => $revenueByType,
            'top_events' => $topEvents,
            'verification_funnel' => $verificationFunnel,
            'period_days' => $daysBack,
        ];
    }

    public function toCsv(array $data, string $reportType): string
    {
        $output = fopen('php://temp', 'r+');

        switch ($reportType) {
            case 'registration':
                fputcsv($output, ['Ticket UUID', 'Event', 'Customer Name', 'Email', 'Phone', 'Nationality', 'Ticket Type', 'Price', 'Currency', 'Status', 'Registered At', 'Approved At', 'Checked In At', 'QR Code']);
                foreach ($data['tickets'] ?? [] as $t) {
                    fputcsv($output, [
                        $t['uuid'] ?? '', $t['event']['title'] ?? '', ($t['customer']['first_name'] ?? '') . ' ' . ($t['customer']['last_name'] ?? ''),
                        $t['customer']['email'] ?? '', $t['customer']['phone'] ?? '', $t['customer']['nationality'] ?? '',
                        $t['ticket_type'] ?? '', $t['price'] ?? 0, $t['currency'] ?? 'BDT', $t['status'] ?? '',
                        $t['registered_at'] ?? '', $t['approved_at'] ?? '', $t['checked_in_at'] ?? '', $t['qr_code'] ?? '',
                    ]);
                }
                break;

            case 'attendance':
                fputcsv($output, ['Customer Name', 'Email', 'Nationality', 'Event', 'Ticket Type', 'Ticket Status', 'Scan Method', 'Scanner', 'Valid', 'Scanned At']);
                foreach ($data['checkins'] ?? [] as $c) {
                    fputcsv($output, [
                        ($c['customer']['first_name'] ?? '') . ' ' . ($c['customer']['last_name'] ?? ''),
                        $c['customer']['email'] ?? '', $c['customer']['nationality'] ?? '',
                        $c['event']['title'] ?? '', $c['ticket']['ticket_type'] ?? '', $c['ticket']['status'] ?? '',
                        $c['scan_method'] ?? '', $c['scanner'] ?? '', $c['is_valid'] ? 'Yes' : 'No',
                        $c['scanned_at'] ?? '',
                    ]);
                }
                break;

            case 'verification':
                fputcsv($output, ['Customer Name', 'Email', 'Nationality', 'Type', 'Status', 'Reviewer', 'Submitted At', 'Reviewed At', 'Notes']);
                foreach ($data['verifications'] ?? [] as $v) {
                    fputcsv($output, [
                        ($v['customer']['first_name'] ?? '') . ' ' . ($v['customer']['last_name'] ?? ''),
                        $v['customer']['email'] ?? '', $v['customer']['nationality'] ?? '',
                        $v['verification_type'] ?? '', $v['status'] ?? '', $v['reviewer'] ?? '',
                        $v['submitted_at'] ?? '', $v['reviewed_at'] ?? '', $v['notes'] ?? '',
                    ]);
                }
                break;

            case 'scanner':
                fputcsv($output, ['Scanner', 'Event', 'Scan Method', 'Device', 'Valid', 'Scanned At']);
                foreach ($data['scans'] ?? [] as $s) {
                    fputcsv($output, [
                        $s['scanner'] ?? '', $s['event']['title'] ?? '', $s['scan_method'] ?? '',
                        $s['device_id'] ?? '', $s['is_valid'] ? 'Yes' : 'No', $s['scanned_at'] ?? '',
                    ]);
                }
                break;
        }

        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        return $csv;
    }

    public function toPdf(array $data, string $reportType): string
    {
        $viewName = 'pdf.reports.' . $reportType;
        $pdf = Pdf::loadView($viewName, ['report' => $data, 'generatedAt' => now()]);
        $pdf->setPaper('a4', 'landscape');
        $pdf->setOptions([
            'defaultFont' => 'Inter',
            'isRemoteEnabled' => true,
            'isHtml5ParserEnabled' => true,
        ]);
        return $pdf->output();
    }

    public function getRegistrationCsv(array $filters = []): string
    {
        $data = $this->registrationReport($filters);
        return $this->toCsv($data, 'registration');
    }

    public function getAttendanceCsv(array $filters = []): string
    {
        $data = $this->attendanceReport($filters);
        return $this->toCsv($data, 'attendance');
    }

    public function getVerificationCsv(array $filters = []): string
    {
        $data = $this->verificationReport($filters);
        return $this->toCsv($data, 'verification');
    }

    public function getScannerCsv(array $filters = []): string
    {
        $data = $this->scannerReport($filters);
        return $this->toCsv($data, 'scanner');
    }

    public function getRegistrationPdf(array $filters = []): string
    {
        $data = $this->registrationReport($filters);
        return $this->toPdf($data, 'registration');
    }

    public function getAttendancePdf(array $filters = []): string
    {
        $data = $this->attendanceReport($filters);
        return $this->toPdf($data, 'attendance');
    }

    public function getVerificationPdf(array $filters = []): string
    {
        $data = $this->verificationReport($filters);
        return $this->toPdf($data, 'verification');
    }

    public function getScannerPdf(array $filters = []): string
    {
        $data = $this->scannerReport($filters);
        return $this->toPdf($data, 'scanner');
    }

    public function getEventsForDropdown(): Collection
    {
        return Event::published()->orderBy('start_date')->get(['id', 'uuid', 'title', 'start_date', 'venue_name']);
    }

    public function getReportTypeLabel(string $type): string
    {
        $labels = [
            'registration' => 'Registration Report',
            'attendance' => 'Attendance Report',
            'verification' => 'Verification Report',
            'scanner' => 'Scanner Report',
        ];
        return $labels[$type] ?? 'Report';
    }
}
