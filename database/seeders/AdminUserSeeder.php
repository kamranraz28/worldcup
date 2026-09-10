<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $superAdminRole = Role::where('name', 'super-admin')->first();
        $adminRole = Role::where('name', 'admin')->first();

        User::firstOrCreate(
            ['email' => 'superadmin@synergyinterface.com'],
            [
                'uuid' => \Illuminate\Support\Str::uuid(),
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'role_id' => $superAdminRole->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@synergyinterface.com'],
            [
                'uuid' => \Illuminate\Support\Str::uuid(),
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $checkinStaffRole = Role::where('name', 'checkin-staff')->first();

        User::firstOrCreate(
            ['email' => 'scanner@synergyinterface.com'],
            [
                'uuid' => \Illuminate\Support\Str::uuid(),
                'name' => 'Scanner',
                'password' => Hash::make('password'),
                'role_id' => $checkinStaffRole->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
