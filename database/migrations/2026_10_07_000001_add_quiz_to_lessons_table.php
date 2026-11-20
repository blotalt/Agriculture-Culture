<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            // Multiple-choice questions about the lesson: [{question, choices, answer, explain}],
            // where answer is the index of the right choice. The Learn hub's quick quiz draws on them.
            $table->json('quiz')->nullable()->after('items');
        });
    }

    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn('quiz');
        });
    }
};
