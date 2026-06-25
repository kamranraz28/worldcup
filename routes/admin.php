<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::resource('users', UserController::class)
    ->except(['show'])
    ->names([
        'index' => 'users.index',
        'create' => 'users.create',
        'store' => 'users.store',
        'edit' => 'users.edit',
        'update' => 'users.update',
        'destroy' => 'users.destroy',
    ]);

Route::get('users/{user}', [UserController::class, 'show'])->name('users.show');

Route::resource('roles', RoleController::class)->names([
    'index' => 'roles.index',
    'create' => 'roles.create',
    'store' => 'roles.store',
    'edit' => 'roles.edit',
    'update' => 'roles.update',
    'destroy' => 'roles.destroy',
]);

Route::resource('permissions', PermissionController::class)->names([
    'index' => 'permissions.index',
    'create' => 'permissions.create',
    'store' => 'permissions.store',
    'edit' => 'permissions.edit',
    'update' => 'permissions.update',
    'destroy' => 'permissions.destroy',
]);

Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
Route::post('settings/{group}', [SettingsController::class, 'update'])->name('settings.update');
Route::post('settings/test-smtp', [SettingsController::class, 'testSmtp'])->name('settings.test-smtp');
Route::post('settings/test-sms', [SettingsController::class, 'testSms'])->name('settings.test-sms');
Route::post('settings/toggle-maintenance', [SettingsController::class, 'toggleMaintenance'])->name('settings.toggle-maintenance');
