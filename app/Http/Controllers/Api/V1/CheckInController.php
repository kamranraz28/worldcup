<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\CheckInService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CheckInController extends Controller
{
    private $checkInService;

    public function __construct(CheckInService $checkInService)
    {
        $this->checkInService = $checkInService;
    }

    public function scan(Request $request)
    {
        $validated = $request->validate([
            'qr_code' => 'required|string|max:255',
            'event_id' => 'required|integer|exists:events,id',
            'scan_method' => 'nullable|string|in:qr,manual,nfc',
            'device_id' => 'nullable|string|max:100',
            'offline_queue_id' => 'nullable|string|max:100',
            'location' => 'nullable|array',
            'location.lat' => 'nullable|numeric',
            'location.lng' => 'nullable|numeric',
        ]);

        $result = $this->checkInService->scan(
            $validated['qr_code'],
            $validated['event_id'],
            [
                'scan_method' => $validated['scan_method'] ?? 'qr',
                'device_id' => $validated['device_id'] ?? null,
                'offline_queue_id' => $validated['offline_queue_id'] ?? null,
                'location' => $validated['location'] ?? null,
            ]
        );

        $statusCode = $result['success'] ? 200 : ($result['code'] === 'DUPLICATE_SCAN' ? 409 : 422);
        return response()->json($result, $statusCode);
    }

    public function validateQr(Request $request)
    {
        $validated = $request->validate([
            'qr_code' => 'required|string|max:255',
            'event_id' => 'required|integer|exists:events,id',
        ]);

        $result = $this->checkInService->validateQrCode($validated['qr_code'], $validated['event_id']);

        return response()->json($result);
    }

    public function batchSync(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|max:500',
            'items.*.qr_code' => 'required|string',
            'items.*.event_id' => 'required|integer|exists:events,id',
            'items.*.scan_method' => 'nullable|string|in:qr,manual,nfc',
            'items.*.device_id' => 'nullable|string|max:100',
            'items.*.offline_queue_id' => 'required|string|max:100',
            'items.*.location' => 'nullable|array',
            'items.*.scanned_at' => 'nullable|date',
        ]);

        $results = $this->checkInService->processOfflineQueue($validated['items']);

        return response()->json([
            'synced' => count(array_filter($results, fn ($r) => $r['success'])),
            'failed' => count(array_filter($results, fn ($r) => !$r['success'])),
            'total' => count($results),
            'results' => $results,
        ]);
    }

    public function history(Request $request)
    {
        $filters = $request->only(['event_id', 'date_from', 'date_to', 'is_valid', 'scan_method', 'search']);
        $history = $this->checkInService->getHistory($filters);

        return response()->json([
            'data' => $history,
            'total' => $history->count(),
        ]);
    }

    public function eventAttendance(int $eventId)
    {
        $attendance = $this->checkInService->getEventAttendance($eventId);

        return response()->json(['data' => $attendance]);
    }

    public function stats()
    {
        return response()->json($this->checkInService->getDailyStats());
    }
}
