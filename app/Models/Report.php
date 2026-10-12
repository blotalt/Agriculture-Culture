<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Report extends Model
{
    public const REASONS = ['spam', 'offensive', 'misleading', 'other'];

    // Short names used in forms, mapped to the models that can be reported.
    public const TYPES = [
        'post' => Post::class,
        'comment' => Comment::class,
    ];

    protected $fillable = ['reportable_type', 'reportable_id', 'reason', 'details'];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    public function reportable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function resolve(User $admin, string $status): void
    {
        $this->forceFill([
            'status' => $status,
            'resolved_by' => $admin->id,
            'resolved_at' => now(),
        ])->save();
    }
}
