<?php

use App\Support\PhoneNumber;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->string('phone_normalized', 20)->nullable()->index()->after('phone');
        });

        // Backfill so pre-existing customers are immediately trackable.
        DB::table('customers')->orderBy('id')->chunkById(200, function ($rows) {
            foreach ($rows as $row) {
                $normalized = PhoneNumber::normalize($row->phone);

                DB::table('customers')->where('id', $row->id)->update([
                    'phone_normalized' => $normalized,
                ]);
            }
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropIndex(['phone_normalized']);
            $table->dropColumn('phone_normalized');
        });
    }
};