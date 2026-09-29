<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Cleans up the removed Customer Verification (KYC) and Blacklist features.
 *
 * The original create-table migrations for these features have been deleted,
 * so fresh installs never create them. This guarded migration only runs for
 * databases that were migrated before the removal, dropping the obsolete
 * tables and columns in place.
 */
return new class extends Migration
{
    public function up(): void
    {
        foreach (['customer_verifications', 'verification_logs', 'blacklisted_customers'] as $table) {
            if (Schema::hasTable($table)) {
                Schema::drop($table);
            }
        }

        if (Schema::hasTable('customers')) {
            Schema::table('customers', function (Blueprint $table) {
                if (Schema::hasColumn('customers', 'is_verified')) {
                    $table->dropColumn('is_verified');
                }
                if (Schema::hasColumn('customers', 'verified_at')) {
                    $table->dropColumn('verified_at');
                }
            });
        }

        if (Schema::hasTable('events')) {
            Schema::table('events', function (Blueprint $table) {
                if (Schema::hasColumn('events', 'requires_verification')) {
                    $table->dropColumn('requires_verification');
                }
            });
        }
    }

    public function down(): void
    {
        // The feature is being removed permanently; no restore path is provided.
    }
};