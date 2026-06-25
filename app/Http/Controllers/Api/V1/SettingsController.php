<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\SettingsService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class SettingsController extends Controller
{
    private $settingsService;

    public function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    public function index()
    {
        return response()->json([
            'settings' => $this->settingsService->all(),
            'definitions' => $this->settingsService->getGroupDefinitions(),
        ]);
    }

    public function show(string $group)
    {
        $definitions = $this->settingsService->getGroupDefinitions();

        if (!isset($definitions[$group])) {
            return response()->json(['error' => 'Invalid settings group.'], 404);
        }

        return response()->json([
            'group' => $group,
            'definition' => $definitions[$group],
            'settings' => $this->settingsService->getGroup($group),
        ]);
    }

    public function update(Request $request, string $group)
    {
        $definitions = $this->settingsService->getGroupDefinitions();

        if (!isset($definitions[$group])) {
            return response()->json(['error' => 'Invalid settings group.'], 404);
        }

        try {
            $this->settingsService->updateGroup($group, $request->input('settings', []));
            return response()->json(['message' => 'Settings saved successfully.']);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
