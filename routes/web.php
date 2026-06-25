<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerVerificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\CheckInController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Welcome');
});

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)->name('verification.notice');
    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])->name('password.confirm');
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

Route::middleware(['auth', 'verified', 'is_active'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::resource('events', EventController::class)->parameters(['events' => 'uuid']);
    Route::post('events/{uuid}/publish', [EventController::class, 'publish'])->name('events.publish');
    Route::post('events/{uuid}/cancel', [EventController::class, 'cancel'])->name('events.cancel');
    Route::post('events/{uuid}/duplicate', [EventController::class, 'duplicate'])->name('events.duplicate');
    Route::post('events/{uuid}/gallery', [EventController::class, 'uploadGallery'])->name('events.gallery.upload');
    Route::delete('events/{uuid}/gallery/{galleryId}', [EventController::class, 'deleteGalleryImage'])->name('events.gallery.destroy');
    Route::put('events/{uuid}/gallery/reorder', [EventController::class, 'reorderGallery'])->name('events.gallery.reorder');

    Route::resource('customers', CustomerController::class)->parameters(['customers' => 'uuid']);
    Route::post('customers/{uuid}/blacklist', [CustomerController::class, 'blacklist'])->name('customers.blacklist');
    Route::delete('customers/{uuid}/blacklist', [CustomerController::class, 'removeBlacklist'])->name('customers.blacklist.remove');
    Route::get('customers/{uuid}/eligibility', [CustomerController::class, 'eligibility'])->name('customers.eligibility');

    Route::get('verifications', [CustomerVerificationController::class, 'index'])->name('verifications.index');
    Route::get('verifications/{uuid}', [CustomerVerificationController::class, 'show'])->name('verifications.show');
    Route::post('verifications/{uuid}/review', [CustomerVerificationController::class, 'review'])->name('verifications.review');
    Route::get('verifications-review', [CustomerVerificationController::class, 'pendingReview'])->name('verifications.pending');
    Route::post('customers/{customerUuid}/verifications', [CustomerVerificationController::class, 'submit'])->name('verifications.submit');

    Route::get('registrations', [RegistrationController::class, 'index'])->name('registrations.index');
    Route::get('registrations/create', [RegistrationController::class, 'create'])->name('registrations.create');
    Route::post('registrations', [RegistrationController::class, 'store'])->name('registrations.store');
    Route::get('registrations/{uuid}', [RegistrationController::class, 'show'])->name('registrations.show');
    Route::post('registrations/{uuid}/approve', [RegistrationController::class, 'approve'])->name('registrations.approve');
    Route::post('registrations/{uuid}/reject', [RegistrationController::class, 'reject'])->name('registrations.reject');
    Route::post('registrations/{uuid}/cancel', [RegistrationController::class, 'cancel'])->name('registrations.cancel');
    Route::get('registrations-import', [RegistrationController::class, 'importPage'])->name('registrations.import.page');
    Route::post('registrations-import', [RegistrationController::class, 'import'])->name('registrations.import');
    Route::get('registrations-export/csv', [RegistrationController::class, 'exportCsv'])->name('registrations.export.csv');
    Route::get('events/{eventUuid}/waiting-list', [RegistrationController::class, 'waitingList'])->name('registrations.waiting-list');
    Route::post('events/{eventUuid}/waiting-list/notify', [RegistrationController::class, 'notifyWaitingList'])->name('registrations.waiting-list.notify');

    Route::get('tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::get('tickets/{uuid}', [TicketController::class, 'show'])->name('tickets.show');
    Route::get('tickets/{uuid}/download', [TicketController::class, 'downloadPdf'])->name('tickets.download');
    Route::get('tickets/{uuid}/print', [TicketController::class, 'printTicket'])->name('tickets.print');
    Route::post('tickets/{uuid}/email', [TicketController::class, 'sendEmail'])->name('tickets.email');
    Route::post('tickets/{uuid}/sms', [TicketController::class, 'sendSms'])->name('tickets.sms');
    Route::get('tickets/{uuid}/history', [TicketController::class, 'history'])->name('tickets.history');

    Route::get('check-in', [CheckInController::class, 'scanner'])->name('checkin.scanner');
    Route::post('check-in/scan', [CheckInController::class, 'scan'])->name('checkin.scan');
    Route::post('check-in/validate', [CheckInController::class, 'validateQr'])->name('checkin.validate');
    Route::get('check-in/history', [CheckInController::class, 'history'])->name('checkin.history');
    Route::get('check-in/attendance/{eventId}', [CheckInController::class, 'eventAttendance'])->name('checkin.attendance');
    Route::get('check-in/stats', [CheckInController::class, 'stats'])->name('checkin.stats');
    Route::post('check-in/sync', [CheckInController::class, 'batchSync'])->name('checkin.sync');

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/registration', [ReportController::class, 'registration'])->name('reports.registration');
    Route::get('reports/attendance', [ReportController::class, 'attendance'])->name('reports.attendance');
    Route::get('reports/verification', [ReportController::class, 'verification'])->name('reports.verification');
    Route::get('reports/scanner', [ReportController::class, 'scanner'])->name('reports.scanner');
    Route::get('reports/export/{type}/csv', [ReportController::class, 'exportCsv'])->name('reports.export.csv');
    Route::get('reports/export/{type}/pdf', [ReportController::class, 'exportPdf'])->name('reports.export.pdf');
    Route::post('reports/generate', [ReportController::class, 'generate'])->name('reports.generate');
    Route::get('reports/download/{report}', [ReportController::class, 'download'])->name('reports.download');
    Route::get('reports/analytics', [ReportController::class, 'analytics'])->name('reports.analytics');
});
