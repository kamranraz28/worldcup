<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('campaign_type', 30);
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('reward_type', 30)->nullable();
            $table->decimal('reward_value', 10, 2)->nullable();
            $table->decimal('total_budget', 12, 2)->nullable();
            $table->unsignedInteger('total_participants')->default(0);
            $table->unsignedInteger('max_participants')->nullable();
            $table->json('rules')->nullable();
            $table->string('status', 20)->default('draft')->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'end_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
