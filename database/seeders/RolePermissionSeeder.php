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
            ['name' => 'checkin-staff', 'display_name' => 'Scanning Staff', 'description' => 'Scan and verify tickets at venue', 'is_system' => false],
            ['name' => 'customer', 'display_name' => 'Customer', 'description' => 'Self-service account', 'is_system' => true],
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
        $checkinStaff = Role::where('name', 'checkin-staff')->first();
        $customer = Role::where('name', 'customer')->first();

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

        $checkinStaff->permissions()->sync(
            Permission::whereIn('name', [
                'checkins.scan', 'checkins.view',
                'tickets.view', 'events.view',
            ])->pluck('id')
        );

        $customer->permissions()->sync([]);
    }
}
