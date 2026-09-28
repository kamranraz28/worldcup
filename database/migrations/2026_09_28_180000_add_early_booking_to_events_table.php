<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->decimal('early_booking_price', 10, 2)->nullable()->after('ticket_price');
            $table->dateTime('early_booking_deadline')->nullable()->after('registration_deadline');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['early_booking_price', 'early_booking_deadline']);
        });
    }
};
