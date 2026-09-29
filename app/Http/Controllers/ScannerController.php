<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScannerRequest;
use App\Http\Requests\UpdateScannerRequest;
use App\Models\Event;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ScannerController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);

        $roleId = Role::where('name', 'checkin-staff')->value('id');

        $query = User::query()
            ->where('role_id', $roleId)
            ->with(['assignedEvents:id,uuid,title,start_date,venue_name'])
            ->withCount('assignedEvents')
            ->latest();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if (($filters['status'] ?? '') === 'active') {
            $query->where('is_active', true);
        } elseif (($filters['status'] ?? '') === 'inactive') {
            $query->where('is_active', false);
        }

        $scanners = $query->paginate($request->integer('per_page', 15))->withQueryString()
            ->through(fn (User $scanner) => [
                'uuid' => $scanner->uuid,
                'name' => $scanner->name,
                'email' => $scanner->email,
                'phone' => $scanner->phone,
                'is_active' => $scanner->is_active,
                'last_login_at' => $scanner->last_login_at,
                'events_count' => $scanner->assigned_events_count,
                'events' => $scanner->assignedEvents->map(fn (Event $e) => [
                    'uuid' => $e->uuid,
                    'title' => $e->title,
                    'venue_name' => $e->venue_name,
                ]),
            ]);

        return Inertia::render('Scanners/Index', [
            'scanners' => $scanners,
            'filters' => $filters,
            'stats' => [
                'total' => User::where('role_id', $roleId)->count(),
                'active' => User::where('role_id', $roleId)->where('is_active', true)->count(),
                'inactive' => User::where('role_id', $roleId)->where('is_active', false)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Scanners/Create', [
            'events' => $this->eventOptions(),
        ]);
    }

    public function store(StoreScannerRequest $request): RedirectResponse
    {
        $roleId = Role::where('name', 'checkin-staff')->value('id');

        $scanner = DB::transaction(function () use ($request, $roleId) {
            $scanner = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'role_id' => $roleId,
                'is_active' => $request->boolean('is_active', true),
                'email_verified_at' => now(),
            ]);

            $scanner->assignedEvents()->sync($request->input('event_ids', []));

            return $scanner;
        });

        return redirect()
            ->route('scanners.index')
            ->with('flash', ['success' => "Scanner {$scanner->name} created successfully."]);
    }

    public function edit(User $scanner): Response
    {
        $scanner->load('assignedEvents:id');

        return Inertia::render('Scanners/Edit', [
            'scanner' => [
                'uuid' => $scanner->uuid,
                'name' => $scanner->name,
                'email' => $scanner->email,
                'phone' => $scanner->phone,
                'is_active' => $scanner->is_active,
                'event_ids' => $scanner->assignedEvents->pluck('id')->values(),
            ],
            'events' => $this->eventOptions(),
        ]);
    }

    public function update(UpdateScannerRequest $request, User $scanner): RedirectResponse
    {
        DB::transaction(function () use ($request, $scanner) {
            $data = $request->only(['name', 'email', 'phone']);
            $data['is_active'] = $request->boolean('is_active', true);

            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            $scanner->update($data);
            $scanner->assignedEvents()->sync($request->input('event_ids', []));
        });

        return redirect()
            ->route('scanners.index')
            ->with('flash', ['success' => "Scanner {$scanner->name} updated successfully."]);
    }

    public function toggle(User $scanner): RedirectResponse
    {
        $scanner->update(['is_active' => !$scanner->is_active]);

        return redirect()->back()->with('flash', [
            'success' => $scanner->is_active ? 'Scanner activated.' : 'Scanner deactivated.',
        ]);
    }

    public function destroy(User $scanner): RedirectResponse
    {
        $scanner->delete();

        return redirect()->route('scanners.index')->with('flash', ['success' => 'Scanner deleted.']);
    }

    private function eventOptions()
    {
        return Event::query()
            ->orderByDesc('start_date')
            ->get(['id', 'uuid', 'title', 'start_date', 'venue_name', 'status']);
    }
}
