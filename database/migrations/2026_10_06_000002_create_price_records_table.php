<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Every price reading over time. market_prices keeps only the latest one per market.
        Schema::create('price_records', function (Blueprint $table) {
            $table->id();
            $table->string('rice_variety');
            $table->string('province');
            $table->string('market');
            $table->decimal('price_per_kg', 8, 2);
            $table->date('recorded_on');
            $table->string('source')->nullable();
            $table->timestamps();

            $table->unique(['rice_variety', 'market', 'recorded_on']);
            $table->index(['province', 'recorded_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_records');
    }
};
