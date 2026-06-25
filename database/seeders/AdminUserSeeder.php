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
        $verificationOfficerRole = Role::where('name', 'verification-officer')->first();
        $eventManagerRole = Role::where('name', 'event-manager')->first();

        User::firstOrCreate(
            ['email' => 'superadmin@toffee.com'],
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
            ['email' => 'admin@toffee.com'],
            [
                'uuid' => \Illuminate\Support\Str::uuid(),
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'verification@toffee.com'],
            [
                'uuid' => \Illuminate\Support\Str::uuid(),
                'name' => 'Verification Officer',
                'password' => Hash::make('password'),
                'role_id' => $verificationOfficerRole->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'events@toffee.com'],
            [
                'uuid' => \Illuminate\Support\Str::uuid(),
                'name' => 'Event Manager',
                'password' => Hash::make('password'),
                'role_id' => $eventManagerRole->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
