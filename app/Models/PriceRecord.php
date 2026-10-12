<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PriceRecord extends Model
{
    protected $fillable = [
        'rice_variety',
        'province',
        'market',
        'price_per_kg',
        'recorded_on',
        'source',
    ];

    protected $casts = [
        'recorded_on' => 'date:Y-m-d',
        'price_per_kg' => 'float',
    ];

    // The most recent reading for the same market and variety before $date.
    public static function previousFor(string $variety, string $market, string $date): ?self
    {
        return static::where('rice_variety', $variety)
            ->where('market', $market)
            ->where('recorded_on', '<', $date)
            ->orderByDesc('recorded_on')
            ->first();
    }
}
