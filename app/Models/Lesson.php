<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    public const LAYOUTS = ['article', 'cards', 'timeline'];

    // Parts of the rice plant and grain a fact card can point to; cards with one get a pin on the lesson's diagram.
    public const DIAGRAM_PARTS = ['root', 'stem', 'tiller', 'leaf', 'panicle', 'flower', 'hull', 'bran', 'germ', 'endosperm'];

    protected $fillable = [
        'topic_id',
        'slug',
        'title',
        'summary',
        'body',
        'layout',
        'items',
        'quiz',
        'level',
        'position',
        'published',
    ];

    protected function casts(): array
    {
        return [
            'items' => 'array',
            'quiz' => 'array',
            'published' => 'boolean',
        ];
    }

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    public function sources(): HasMany
    {
        return $this->hasMany(LessonSource::class)->orderBy('position');
    }

    public function scopePublished(Builder $query): void
    {
        $query->where('published', true);
    }
}
