<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->uuid('uuid')->unique();
            $table->string('verification_type', 30);
            $table->string('status', 20)->default('pending')->index();
            $table->string('document_front')->nullable();
            $table->string('document_back')->nullable();
            $table->string('selfie_image')->nullable();
            $table->json('ocr_data')->nullable();
            $table->decimal('confidence_score', 5, 2)->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->string('rejection_reason', 500)->nullable();
            $table->json('verification_metadata')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_verifications');
    }
};
