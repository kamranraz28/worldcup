<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    private $settingsService;

    public function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    public function index()
    {
        $this->authorize('view', \App\Models\SystemConfig::class);

        $definitions = $this->settingsService->getGroupDefinitions();
        $settings = [];

        foreach ($definitions as $group => $definition) {
            $settings[$group] = $this->settingsService->getGroup($group);
        }

        return Inertia::render('Admin/Settings', [
            'definitions' => $definitions,
            'settings' => $settings,
        ]);
    }

    public function update(Request $request, string $group)
    {
        $this->authorize('edit', \App\Models\SystemConfig::class);

        $definitions = $this->settingsService->getGroupDefinitions();

        if (!isset($definitions[$group])) {
            return redirect()->back()->with('error', 'Invalid settings group.');
        }

        $values = $request->input('settings', []);

        try {
            $this->settingsService->updateGroup($group, $values);
            return redirect()->back()->with('success', $definitions[$group]['label'] . ' settings saved successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->with('error', 'Validation failed. Please check your inputs.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to save settings: ' . $e->getMessage());
        }
    }

    public function testSmtp()
    {
        $this->authorize('edit', \App\Models\SystemConfig::class);

        $result = $this->settingsService->testSmtp();

        return response()->json($result);
    }

    public function testSms()
    {
        $this->authorize('edit', \App\Models\SystemConfig::class);

        $result = $this->settingsService->testSms();

        return response()->json($result);
    }

    public function toggleMaintenance(Request $request)
    {
        $this->authorize('edit', \App\Models\SystemConfig::class);

        $enabled = $request->input('enabled', false);
        $this->settingsService->toggleMaintenance($enabled);

        return redirect()->back()->with('success', 'Maintenance mode ' . ($enabled ? 'enabled' : 'disabled') . '.');
    }
}
