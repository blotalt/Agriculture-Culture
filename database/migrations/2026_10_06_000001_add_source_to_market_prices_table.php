<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('market_prices', function (Blueprint $table) {
            // null = entered by an admin; 'wfp' = imported by prices:import
            $table->string('source')->nullable()->after('change_percent');
            $table->date('recorded_on')->nullable()->after('source');
        });
    }

    public function down(): void
    {
        Schema::table('market_prices', function (Blueprint $table) {
            $table->dropColumn(['source', 'recorded_on']);
        });
    }
};
