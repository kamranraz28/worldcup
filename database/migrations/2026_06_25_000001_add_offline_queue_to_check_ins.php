<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('check_ins', function (Blueprint $table) {
            $table->string('offline_queue_id', 100)->nullable()->after('device_id');
            $table->timestamp('synced_at')->nullable()->after('scanned_at');

            $table->index('offline_queue_id');
        });
    }

    public function down(): void
    {
        Schema::table('check_ins', function (Blueprint $table) {
            $table->dropIndex(['offline_queue_id']);
            $table->dropColumn(['offline_queue_id', 'synced_at']);
        });
    }
};
