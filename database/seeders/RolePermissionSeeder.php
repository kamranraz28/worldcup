<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'super-admin', 'display_name' => 'Super Admin', 'description' => 'Full system access', 'is_system' => true],
            ['name' => 'admin', 'display_name' => 'Admin', 'description' => 'Administrative access', 'is_system' => true],
            ['name' => 'verification-officer', 'display_name' => 'Verification Officer', 'description' => 'Review verification documents', 'is_system' => true],
            ['name' => 'event-manager', 'display_name' => 'Event Manager', 'description' => 'Create and manage events', 'is_system' => false],
            ['name' => 'checkin-staff', 'display_name' => 'Check-in Staff', 'description' => 'Scan QR codes at venue', 'is_system' => false],
            ['name' => 'support-agent', 'display_name' => 'Support Agent', 'description' => 'View customers and tickets', 'is_system' => false],
            ['name' => 'customer', 'display_name' => 'Customer', 'description' => 'Self-service account', 'is_system' => true],
            ['name' => 'api-client', 'display_name' => 'API Client', 'description' => 'Programmatic access', 'is_system' => false],
        ];

        $moduleActions = [
            'users' => ['view', 'create', 'edit', 'delete', 'impersonate'],
            'roles' => ['view', 'create', 'edit', 'delete'],
            'events' => ['view', 'create', 'edit', 'delete', 'publish', 'cancel'],
            'tickets' => ['view', 'create', 'edit', 'delete', 'redeem', 'transfer'],
            'customers' => ['view', 'create', 'edit', 'delete', 'export', 'import'],
            'verifications' => ['view', 'review', 'approve', 'reject', 'flag', 're-request'],
            'campaigns' => ['view', 'create', 'edit', 'delete', 'activate', 'pause'],
            'checkins' => ['scan', 'view', 'override'],
            'reports' => ['view', 'generate', 'export', 'delete'],
            'notifications' => ['send', 'view', 'configure', 'templates'],
            'audit' => ['view', 'export'],
            'configs' => ['view', 'edit'],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(
                ['name' => $roleData['name']],
                $roleData
            );
        }

        $permissionIds = [];
        foreach ($moduleActions as $module => $actions) {
            foreach ($actions as $action) {
                $permission = Permission::firstOrCreate(
                    ['name' => "{$module}.{$action}"],
                    [
                        'display_name' => ucfirst($action) . ' ' . ucfirst($module),
                        'group' => $module,
                        'guard_name' => 'web',
                    ]
                );
                $permissionIds[] = $permission->id;
            }
        }

        $superAdmin = Role::where('name', 'super-admin')->first();
        $admin = Role::where('name', 'admin')->first();
        $verificationOfficer = Role::where('name', 'verification-officer')->first();
        $eventManager = Role::where('name', 'event-manager')->first();
        $checkinStaff = Role::where('name', 'checkin-staff')->first();
        $supportAgent = Role::where('name', 'support-agent')->first();
        $customer = Role::where('name', 'customer')->first();
        $apiClient = Role::where('name', 'api-client')->first();

        $superAdmin->permissions()->sync(Permission::all());

        $admin->permissions()->sync(
            Permission::whereIn('group', [
                'events', 'tickets', 'customers', 'verifications',
                'campaigns', 'checkins', 'reports', 'notifications', 'audit',
            ])->whereNotIn('name', [
                'users.delete', 'users.impersonate',
                'roles.delete', 'configs.edit',
            ])->pluck('id')
        );

        $verificationOfficer->permissions()->sync(
            Permission::whereIn('name', [
                'verifications.view', 'verifications.review',
                'verifications.approve', 'verifications.reject',
                'verifications.flag', 'customers.view',
                'checkins.view',
            ])->pluck('id')
        );

        $eventManager->permissions()->sync(
            Permission::whereIn('group', ['events', 'tickets', 'checkins'])
                ->whereNotIn('name', ['events.delete'])
                ->pluck('id')
        );

        $checkinStaff->permissions()->sync(
            Permission::whereIn('name', [
                'checkins.scan', 'checkins.view',
                'tickets.view', 'events.view',
            ])->pluck('id')
        );

        $supportAgent->permissions()->sync(
            Permission::whereIn('name', [
                'customers.view', 'tickets.view', 'events.view',
                'verifications.view',
            ])->pluck('id')
        );

        $customer->permissions()->sync([]);

        $apiClient->permissions()->sync(
            Permission::whereIn('name', [
                'events.view', 'tickets.view',
                'checkins.scan',
            ])->pluck('id')
        );
    }
}
