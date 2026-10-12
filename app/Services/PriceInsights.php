<?php

namespace App\Services;

use App\Models\MarketPrice;
use App\Models\PriceRecord;
use App\Support\Provinces;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Price history summaries for the Prices page: monthly averages over time,
 * and a per-province snapshot with trends for the map.
 */
class PriceInsights
{
    public function __construct(private int $months = 36)
    {
    }

    public function forPage(): array
    {
        $records = $this->recentRecords();

        return [
            'national' => $this->monthlyAverages($records),
            'byProvince' => $records->groupBy('province_name')
                ->map(fn ($rows) => $this->monthlyAverages($rows))
                ->all(),
            'provinces' => $this->provinceSummary($records),
        ];
    }

    private function recentRecords(): Collection
    {
        $latest = PriceRecord::max('recorded_on');

        if (! $latest) {
            return collect();
        }

        $from = Carbon::parse($latest)->startOfMonth()->subMonths($this->months - 1);

        return PriceRecord::where('recorded_on', '>=', $from)
            ->orderBy('recorded_on')
            ->get()
            ->each(function (PriceRecord $record) {
                $record->month = $record->recorded_on->format('Y-m');
                $record->province_name = Provinces::canonical($record->province);
            });
    }

    // [['month' => '2026-01', 'avg' => 0.48, 'markets' => 21], ...]
    private function monthlyAverages(Collection $records): array
    {
        return $records->groupBy('month')
            ->map(fn ($rows, $month) => [
                'month' => $month,
                'avg' => round($rows->avg('price_per_kg'), 3),
                'markets' => $rows->pluck('market')->unique()->count(),
            ])
            ->sortKeys()
            ->values()
            ->all();
    }

    // Every province, with its latest average price and how it moved over 1 and 12 months.
    private function provinceSummary(Collection $records): array
    {
        $current = MarketPrice::all()->groupBy(fn ($price) => Provinces::canonical($price->province));
        $history = $records->groupBy('province_name');

        return collect(Provinces::all())->map(function (array $province) use ($current, $history) {
            $prices = $current->get($province['name'], collect());
            $series = collect($this->monthlyAverages($history->get($province['name'], collect())));
            $avg = $prices->isNotEmpty() ? round($prices->avg('price_per_kg'), 3) : null;

            return [
                'name' => $province['name'],
                'km' => $province['km'],
                'lat' => $province['lat'],
                'lng' => $province['lng'],
                'avg' => $avg,
                'min' => $prices->isNotEmpty() ? (float) $prices->min('price_per_kg') : null,
                'max' => $prices->isNotEmpty() ? (float) $prices->max('price_per_kg') : null,
                'markets' => $prices->count(),
                'change1m' => $this->changeOver($series, 1),
                'change12m' => $this->changeOver($series, 12),
            ];
        })->all();
    }

    // Percent change between the latest month and the month $months before it, if both exist.
    private function changeOver(Collection $series, int $months): ?float
    {
        $last = $series->last();

        if (! $last) {
            return null;
        }

        $target = Carbon::createFromFormat('Y-m', $last['month'])->startOfMonth()->subMonths($months)->format('Y-m');
        $before = $series->firstWhere('month', $target);

        if (! $before || $before['avg'] <= 0) {
            return null;
        }

        return round(($last['avg'] - $before['avg']) / $before['avg'] * 100, 1);
    }
}
