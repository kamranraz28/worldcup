<?php

namespace App\Http\Controllers;

use App\Jobs\ExportReportJob;
use App\Models\Report;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    private $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index()
    {
        $events = $this->reportService->getEventsForDropdown();
        $analytics = $this->reportService->dashboardAnalytics();
        $reports = Report::with('generator:id,name')->latest()->take(20)->get()->map(function ($r) {
            return [
                'id' => $r->id,
                'uuid' => $r->uuid,
                'name' => $r->name,
                'type' => $r->type,
                'status' => $r->status,
                'file_type' => $r->file_type,
                'file_path' => $r->file_path ? asset('storage/' . $r->file_path) : null,
                'generated_at' => $r->generated_at,
                'generator' => $r->generator ? $r->generator->name : null,
            ];
        });

        return Inertia::render('Reports/Index', [
            'analytics' => $analytics,
            'events' => $events,
            'recentReports' => $reports,
        ]);
    }

    public function registration(Request $request)
    {
        $filters = $request->only(['event_id', 'status', 'ticket_type', 'date_from', 'date_to']);
        $data = $this->reportService->registrationReport($filters);
        $events = $this->reportService->getEventsForDropdown();

        return Inertia::render('Reports/Registration', [
            'report' => $data,
            'filters' => $filters,
            'events' => $events,
        ]);
    }

    public function attendance(Request $request)
    {
        $filters = $request->only(['event_id', 'is_valid', 'scan_method', 'date_from', 'date_to']);
        $data = $this->reportService->attendanceReport($filters);
        $events = $this->reportService->getEventsForDropdown();

        return Inertia::render('Reports/Attendance', [
            'report' => $data,
            'filters' => $filters,
            'events' => $events,
        ]);
    }

    public function verification(Request $request)
    {
        $filters = $request->only(['status', 'verification_type', 'reviewer_id', 'date_from', 'date_to']);
        $data = $this->reportService->verificationReport($filters);
        $events = $this->reportService->getEventsForDropdown();

        return Inertia::render('Reports/Verification', [
            'report' => $data,
            'filters' => $filters,
            'events' => $events,
        ]);
    }

    public function scanner(Request $request)
    {
        $filters = $request->only(['event_id', 'scanner_id', 'date_from', 'date_to']);
        $data = $this->reportService->scannerReport($filters);
        $events = $this->reportService->getEventsForDropdown();

        return Inertia::render('Reports/Scanner', [
            'report' => $data,
            'filters' => $filters,
            'events' => $events,
        ]);
    }

    public function exportCsv(Request $request, string $type)
    {
        $filters = $request->only(['event_id', 'status', 'ticket_type', 'date_from', 'date_to', 'is_valid', 'scan_method', 'reviewer_id', 'scanner_id']);

        switch ($type) {
            case 'registration':
                $csv = $this->reportService->getRegistrationCsv($filters);
                $filename = 'registration-report-' . now()->format('Y-m-d') . '.csv';
                break;
            case 'attendance':
                $csv = $this->reportService->getAttendanceCsv($filters);
                $filename = 'attendance-report-' . now()->format('Y-m-d') . '.csv';
                break;
            case 'verification':
                $csv = $this->reportService->getVerificationCsv($filters);
                $filename = 'verification-report-' . now()->format('Y-m-d') . '.csv';
                break;
            case 'scanner':
                $csv = $this->reportService->getScannerCsv($filters);
                $filename = 'scanner-report-' . now()->format('Y-m-d') . '.csv';
                break;
            default:
                abort(404);
        }

        return response()->streamDownload(function () use ($csv) {
            echo $csv;
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    public function exportPdf(Request $request, string $type)
    {
        $filters = $request->only(['event_id', 'status', 'ticket_type', 'date_from', 'date_to', 'is_valid', 'scan_method', 'reviewer_id', 'scanner_id']);

        switch ($type) {
            case 'registration':
                $pdf = $this->reportService->getRegistrationPdf($filters);
                $filename = 'registration-report-' . now()->format('Y-m-d') . '.pdf';
                break;
            case 'attendance':
                $pdf = $this->reportService->getAttendancePdf($filters);
                $filename = 'attendance-report-' . now()->format('Y-m-d') . '.pdf';
                break;
            case 'verification':
                $pdf = $this->reportService->getVerificationPdf($filters);
                $filename = 'verification-report-' . now()->format('Y-m-d') . '.pdf';
                break;
            case 'scanner':
                $pdf = $this->reportService->getScannerPdf($filters);
                $filename = 'scanner-report-' . now()->format('Y-m-d') . '.pdf';
                break;
            default:
                abort(404);
        }

        return response()->streamDownload(function () use ($pdf) {
            echo $pdf;
        }, $filename, ['Content-Type' => 'application/pdf']);
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:registration,attendance,verification,scanner',
            'file_type' => 'required|string|in:csv,pdf',
            'filters' => 'nullable|array',
            'name' => 'nullable|string|max:255',
        ]);

        $report = Report::create([
            'name' => $validated['name'] ?: $this->reportService->getReportTypeLabel($validated['type']),
            'type' => $validated['type'],
            'parameters' => $validated['filters'] ?? [],
            'file_type' => $validated['file_type'],
            'status' => 'pending',
            'generated_by' => auth()->id(),
        ]);

        ExportReportJob::dispatch($report->id);

        return redirect()->back()->with('success', 'Report generation started. It will be available shortly.');
    }

    public function download(Report $report)
    {
        if (!$report->isReady()) {
            return redirect()->back()->with('error', 'Report is not ready yet.');
        }

        return response()->download(storage_path('app/public/' . $report->file_path));
    }

    public function analytics(Request $request)
    {
        $filters = $request->only(['days']);
        $data = $this->reportService->dashboardAnalytics($filters);

        return response()->json($data);
    }
}
