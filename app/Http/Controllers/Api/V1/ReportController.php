<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ReportController extends Controller
{
    private $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function registration(Request $request)
    {
        $filters = $request->only(['event_id', 'status', 'ticket_type', 'date_from', 'date_to']);
        return response()->json($this->reportService->registrationReport($filters));
    }

    public function attendance(Request $request)
    {
        $filters = $request->only(['event_id', 'is_valid', 'scan_method', 'date_from', 'date_to']);
        return response()->json($this->reportService->attendanceReport($filters));
    }

    public function verification(Request $request)
    {
        $filters = $request->only(['status', 'verification_type', 'reviewer_id', 'date_from', 'date_to']);
        return response()->json($this->reportService->verificationReport($filters));
    }

    public function scanner(Request $request)
    {
        $filters = $request->only(['event_id', 'scanner_id', 'date_from', 'date_to']);
        return response()->json($this->reportService->scannerReport($filters));
    }

    public function analytics(Request $request)
    {
        $filters = $request->only(['days']);
        return response()->json($this->reportService->dashboardAnalytics($filters));
    }

    public function exportCsv(Request $request, string $type)
    {
        $filters = $request->only(['event_id', 'status', 'ticket_type', 'date_from', 'date_to', 'is_valid', 'scan_method']);

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
                return response()->json(['error' => 'Invalid report type.'], 404);
        }

        return response()->streamDownload(function () use ($csv) { echo $csv; }, $filename, ['Content-Type' => 'text/csv']);
    }
}
