<?php

namespace Database\Seeders;

use App\Services\SettingsService;
use Illuminate\Database\Seeder;

class SystemConfigSeeder extends Seeder
{
    private $settingsService;

    public function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    public function run(): void
    {
        $this->settingsService->seedDefaults();
    }
}
