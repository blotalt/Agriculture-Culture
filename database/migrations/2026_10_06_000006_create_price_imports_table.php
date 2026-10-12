<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // One row per run of prices:import: where the data came from, when, and the
        // backup copy of the exact file that was downloaded.
        Schema::create('price_imports', function (Blueprint $table) {
            $table->id();
            $table->string('source');                       // 'wfp'
            $table->string('source_url', 1024)->nullable(); // the file that was downloaded
            $table->timestamp('source_updated_at')->nullable(); // when the publisher last changed it
            $table->string('sha256', 64);
            $table->unsignedBigInteger('bytes');
            $table->string('snapshot_path')->nullable();    // backup copy in storage/app/private
            $table->unsignedInteger('history_rows');
            $table->unsignedInteger('latest_rows');
            $table->date('latest_month')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_imports');
    }
};
