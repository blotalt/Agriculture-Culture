<?php

namespace App\Models;

use App\Support\Provinces;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceAlert extends Model
{
    protected $fillable = [
        'rice_variety',
        'province',
        'direction',
        'threshold',
        'notify_email',
        'telegram_chat_id',
    ];

    protected $casts = [
        'threshold' => 'float',
        'last_notified_price' => 'float',
        'notify_email' => 'boolean',
        'last_notified_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function matches(MarketPrice $price): bool
    {
        if ($this->rice_variety && strcasecmp($this->rice_variety, $price->rice_variety) !== 0) {
            return false;
        }

        if ($this->province && Provinces::canonical($this->province) !== Provinces::canonical($price->province)) {
            return false;
        }

        $value = (float) $price->price_per_kg;

        return $this->direction === 'above' ? $value >= $this->threshold : $value <= $this->threshold;
    }
}
