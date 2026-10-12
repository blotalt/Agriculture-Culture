<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Variety extends Model
{
    // The facts shown for each variety that a source can confirm.
    public const FACTS = ['type', 'location', 'yield', 'cycle', 'harvest', 'season', 'demand'];

    protected $fillable = [
        'name',
        'khmer_name',
        'type',
        'location',
        'description',
        'yield',
        'cycle',
        'harvest',
        'season',
        'demand',
        'image',
        'sources',
        'user_id'
    ];

    protected $casts = [
        // [{title, publisher, date, url, confirms: [...facts] | null, added_by}]
        'sources' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Facts that no source backs up. Null when a contributor added a source without
     * saying which facts it covers, so we can't tell.
     */
    public function unconfirmedFacts(): ?array
    {
        $sources = collect($this->sources ?? []);

        if ($sources->contains(fn ($source) => ! is_array($source['confirms'] ?? null))) {
            return null;
        }

        return array_values(array_diff(self::FACTS, $sources->pluck('confirms')->flatten()->all()));
    }

    // Add a source given in the create/edit form, unless the same link or title is already listed.
    public function addSource(?string $title, ?string $url, string $addedBy): void
    {
        $title = trim(strip_tags((string) $title));
        $url = trim((string) $url);

        if ($title === '' && $url === '') {
            return;
        }

        $sources = collect($this->sources ?? []);
        $duplicate = $sources->contains(fn ($s) => ($url !== '' && ($s['url'] ?? null) === $url) || ($title !== '' && ($s['title'] ?? null) === $title));

        if (! $duplicate) {
            $this->sources = $sources->push([
                'title' => $title !== '' ? $title : $url,
                'url' => $url !== '' ? $url : null,
                'confirms' => null,
                'added_by' => $addedBy,
                'date' => now()->toDateString(),
            ])->all();
        }
    }
}
