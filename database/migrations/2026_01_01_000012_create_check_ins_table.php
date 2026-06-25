<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('check_ins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->cascadeOnDelete();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('scanned_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('scan_method', 10)->default('qr');
            $table->string('device_id', 100)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->json('location_data')->nullable();
            $table->boolean('is_valid')->default(true);
            $table->string('validation_message')->nullable();
            $table->timestamp('scanned_at');
            $table->timestamps();

            $table->index(['event_id', 'scanned_at']);
            $table->unique('ticket_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('check_ins');
    }
};
