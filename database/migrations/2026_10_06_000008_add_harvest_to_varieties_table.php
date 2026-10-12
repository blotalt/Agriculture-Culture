<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('varieties', function (Blueprint $table) {
            // When the crop is harvested, e.g. "Nov - Jan", for varieties where this is known.
            // Photoperiod-sensitive varieties flower at a fixed time of year, so their harvest
            // can't be worked out from the sowing date plus the growing cycle.
            $table->string('harvest', 50)->nullable()->after('cycle');
        });
    }

    public function down(): void
    {
        Schema::table('varieties', function (Blueprint $table) {
            $table->dropColumn('harvest');
        });
    }
};
