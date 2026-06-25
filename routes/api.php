<?php

use App\Http\Controllers\Api\V1\CustomerVerificationController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\CustomerVerificationController;
use App\Http\Controllers\Api\V1\RegistrationController;
use App\Http\Controllers\Api\V1\TicketController;
use App\Http\Controllers\Api\V1\CheckInController;
use App\Http\Controllers\Api\V1\ReportController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/v1')->middleware('api')->group(function () {
    Route::post('customers/{customerUuid}/verifications', [CustomerVerificationController::class, 'submit']);
    Route::get('customers/{customerUuid}/verification-status', [CustomerVerificationController::class, 'status']);
    Route::get('customers/{customerUuid}/eligibility', [CustomerVerificationController::class, 'eligibility']);
    Route::get('customers/{customerUuid}/verification-history', [CustomerVerificationController::class, 'history']);

    Route::post('registrations', [RegistrationController::class, 'register']);
    Route::get('registrations/{uuid}', [RegistrationController::class, 'status']);
    Route::get('events/{event}/availability', [RegistrationController::class, 'checkAvailability']);
    Route::get('events/{event}/registrations', [RegistrationController::class, 'byEvent']);

    Route::get('tickets', [TicketController::class, 'index']);
    Route::get('tickets/{uuid}', [TicketController::class, 'show']);
    Route::get('tickets/{uuid}/download', [TicketController::class, 'download']);
    Route::post('tickets/validate', [TicketController::class, 'validateTicket']);

    Route::post('check-in', [CheckInController::class, 'scan']);
    Route::post('check-in/validate', [CheckInController::class, 'validateQr']);
    Route::post('check-in/batch-sync', [CheckInController::class, 'batchSync']);
    Route::get('check-in/history', [CheckInController::class, 'history']);
    Route::get('check-in/attendance/{eventId}', [CheckInController::class, 'eventAttendance']);
    Route::get('check-in/stats', [CheckInController::class, 'stats']);

    Route::get('reports/registration', [ReportController::class, 'registration']);
    Route::get('reports/attendance', [ReportController::class, 'attendance']);
    Route::get('reports/verification', [ReportController::class, 'verification']);
    Route::get('reports/scanner', [ReportController::class, 'scanner']);
    Route::get('reports/analytics', [ReportController::class, 'analytics']);
    Route::get('reports/export/{type}/csv', [ReportController::class, 'exportCsv']);
});
