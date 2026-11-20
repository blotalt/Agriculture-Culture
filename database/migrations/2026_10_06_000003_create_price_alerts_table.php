<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('rice_variety')->nullable(); // null = any variety
            $table->string('province')->nullable();     // null = anywhere
            $table->string('direction');                // 'above' or 'below'
            $table->decimal('threshold', 8, 2);
            $table->boolean('notify_email')->default(true);
            $table->string('telegram_chat_id')->nullable();
            // The price we last told the user about, so the same reading isn't sent twice.
            $table->decimal('last_notified_price', 8, 2)->nullable();
            $table->timestamp('last_notified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_alerts');
    }
};
