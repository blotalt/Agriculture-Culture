<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The Learn section: topics hold lessons, and every lesson lists the sources it cites.
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('icon', 16)->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained()->cascadeOnDelete();
            $table->string('slug');
            $table->string('title');
            $table->text('summary')->nullable();
            $table->longText('body')->nullable();
            $table->string('layout')->default('article'); // article, cards, timeline
            $table->json('items')->nullable(); // fact cards or timeline stages, depending on layout
            $table->string('level')->default('beginner'); // beginner, intermediate, advanced
            $table->unsignedInteger('position')->default(0);
            $table->boolean('published')->default(true);
            $table->timestamps();

            $table->unique(['topic_id', 'slug']);
        });

        Schema::create('lesson_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('publisher')->nullable();
            $table->string('url', 2048);
            $table->unsignedInteger('position')->default(0); // [1], [2]… in the lesson text
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_sources');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('topics');
    }
};
