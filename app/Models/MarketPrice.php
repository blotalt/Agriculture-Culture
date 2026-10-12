<?php

namespace App\Models;

use App\Services\PriceAlertChecker;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class MarketPrice extends Model
{
    protected $fillable = [
        'rice_variety',
        'rice_type',
        'province',
        'market',
        'price_per_kg',
        'change_percent',
        'source',
        'recorded_on',
    ];

    protected $casts = [
        'recorded_on' => 'date:Y-m-d',
    ];

    protected static function booted(): void
    {
        // Change is always worked out from the price history, never typed in.
        static::saving(function (MarketPrice $price) {
            $price->recorded_on ??= now()->toDateString();

            $previous = PriceRecord::previousFor($price->rice_variety, $price->market, $price->recorded_on->toDateString());

            $price->change_percent = $previous && $previous->price_per_kg > 0
                ? round(($price->price_per_kg - $previous->price_per_kg) / $previous->price_per_kg * 100, 2)
                : 0;
        });

        static::saved(function (MarketPrice $price) {
            PriceRecord::updateOrCreate(
                [
                    'rice_variety' => $price->rice_variety,
                    'market' => $price->market,
                    'recorded_on' => $price->recorded_on->toDateString(),
                ],
                [
                    'province' => $price->province,
                    'price_per_kg' => $price->price_per_kg,
                    'source' => $price->source,
                ]
            );

            app(PriceAlertChecker::class)->check($price);
        });
    }

    /**
     * A varied set of recent prices for the home page ticker. Prices that moved come first, and a
     * variety or province only repeats once the others have had a turn.
     */
    public static function forTicker(int $count = 12): Collection
    {
        $pool = static::orderByDesc('recorded_on')
            ->orderByDesc('id')
            ->limit(60)
            ->get(['rice_variety', 'market', 'province', 'price_per_kg', 'change_percent'])
            ->unique(fn ($price) => $price->rice_variety.'|'.$price->market)
            ->sortByDesc(fn ($price) => (float) $price->change_percent !== 0.0)
            ->all();

        $picked = [];
        $varietyUses = [];
        $provinceUses = [];

        while (count($picked) < $count && $pool) {
            $bestKey = null;
            $bestScore = null;

            foreach ($pool as $key => $price) {
                // Repeating a variety costs more than repeating a province; ties keep the pool's order.
                $score = ($varietyUses[$price->rice_variety] ?? 0) * 100 + ($provinceUses[$price->province] ?? 0);
                if ($bestScore === null || $score < $bestScore) {
                    $bestKey = $key;
                    $bestScore = $score;
                }
            }

            $price = $pool[$bestKey];
            unset($pool[$bestKey]);
            $picked[] = $price;
            $varietyUses[$price->rice_variety] = ($varietyUses[$price->rice_variety] ?? 0) + 1;
            $provinceUses[$price->province] = ($provinceUses[$price->province] ?? 0) + 1;
        }

        return collect($picked);
    }
}
