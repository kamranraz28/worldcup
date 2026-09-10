<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('ticket_template_path')->nullable()->after('banner_image');
            $table->decimal('qr_x', 8, 2)->nullable()->after('ticket_template_path');
            $table->decimal('qr_y', 8, 2)->nullable()->after('qr_x');
            $table->decimal('qr_size', 8, 2)->nullable()->after('qr_y');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['ticket_template_path', 'qr_x', 'qr_y', 'qr_size']);
        });
    }
};
