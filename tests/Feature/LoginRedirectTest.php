<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Staff / admin login keeps working; the old customer portal and public
 * sign-up are gone, so no redirect may land on the deleted URLs.
 */
class LoginRedirectTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    private function userFor(string $roleName): User
    {
        $role = Role::where('name', $roleName)->firstOrFail();

        return User::factory()->create([
            'role_id' => $role->id,
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
    }

    public function test_admin_login_lands_on_the_dashboard(): void
    {
        $user = $this->userFor('super-admin');

        $this->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect('/dashboard');
    }

    public function test_checkin_staff_login_lands_on_the_scanner(): void
    {
        $user = $this->userFor('checkin-staff');

        $this->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect('/check-in');
    }

    public function test_customer_accounts_are_redirected_to_the_public_site(): void
    {
        $user = $this->userFor('customer');

        $this->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect('/');
    }

    public function test_login_page_stays_reachable_while_signed_in(): void
    {
        // A signed-in (e.g. customer) session must still be able to open the
        // staff login page instead of being bounced to the dashboard/home.
        $this->actingAs($this->userFor('customer'))
            ->get('/login')
            ->assertOk();
    }

    public function test_a_signed_in_user_can_switch_accounts_on_the_login_page(): void
    {
        $this->actingAs($this->userFor('customer'));

        $admin = $this->userFor('super-admin');

        $this->post('/login', ['email' => $admin->email, 'password' => 'password'])
            ->assertRedirect('/dashboard');

        $this->assertAuthenticatedAs($admin);
    }

    public function test_public_signup_has_been_removed(): void
    {
        $this->get('/register')->assertNotFound();
    }
}