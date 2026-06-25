<?php

namespace App\Jobs;

use App\Models\Report;
use App\Services\ReportService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ExportReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $reportId;

    public function __construct(int $reportId)
    {
        $this->reportId = $reportId;
    }

    public function handle(ReportService $reportService): void
    {
        $report = Report::findOrFail($this->reportId);
        $report->update(['status' => 'processing']);

        try {
            $filters = $report->parameters ?: [];
            $fileType = $report->file_type ?: 'csv';
            $filename = $report->type . '-report-' . now()->format('Y-m-d-His') . '.' . $fileType;

            if ($fileType === 'csv') {
                switch ($report->type) {
                    case 'registration':
                        $content = $reportService->getRegistrationCsv($filters);
                        break;
                    case 'attendance':
                        $content = $reportService->getAttendanceCsv($filters);
                        break;
                    case 'verification':
                        $content = $reportService->getVerificationCsv($filters);
                        break;
                    case 'scanner':
                        $content = $reportService->getScannerCsv($filters);
                        break;
                    default:
                        throw new \InvalidArgumentException('Unknown report type: ' . $report->type);
                }
            } else {
                switch ($report->type) {
                    case 'registration':
                        $content = $reportService->getRegistrationPdf($filters);
                        break;
                    case 'attendance':
                        $content = $reportService->getAttendancePdf($filters);
                        break;
                    case 'verification':
                        $content = $reportService->getVerificationPdf($filters);
                        break;
                    case 'scanner':
                        $content = $reportService->getScannerPdf($filters);
                        break;
                    default:
                        throw new \InvalidArgumentException('Unknown report type: ' . $report->type);
                }
            }

            $path = 'reports/' . $filename;
            $storagePath = storage_path('app/public/' . $path);
            $dir = dirname($storagePath);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            file_put_contents($storagePath, $content);

            $report->update([
                'status' => 'completed',
                'file_path' => $path,
                'generated_at' => now(),
            ]);
        } catch (\Exception $e) {
            $report->update([
                'status' => 'failed',
                'metadata' => array_merge($report->metadata ?: [], ['error' => $e->getMessage()]),
            ]);
        }
    }
}
