<?php

namespace App\Support;

use App\Models\Variety;

/**
 * Turns a variety's free-text fields ("3.5 - 4 t/ha", "130 - 140 days", "Wet and dry season")
 * into numbers, for comparing, ranking and the planting calendar.
 */
class VarietyFacts
{
    public const DEMAND_SCORE = ['Very High' => 4, 'High' => 3, 'Medium' => 2, 'Low' => 1];

    // Typical planting months in Cambodia, from FAO Rice Information Vol. 3 (2002), "Cambodia: cropping seasons":
    // main (wet) season planting June-July, dry season planting November-January.
    // https://www.fao.org/4/y4347e/y4347e0d.htm
    public const SOWING_MONTHS = [
        'wet' => [6, 7],
        'dry' => [11, 12, 1],
    ];

    // The dry-season harvest runs March-May: FAO gives April-May, and FAO GIEWS says it starts in March.
    // https://www.fao.org/4/j5649e/pays/cmb.htm
    public const DRY_HARVEST_MONTHS = [3, 4, 5];

    public static function for(Variety $variety): array
    {
        [$yieldMin, $yieldMax] = self::range($variety->yield);
        [$cycleMin, $cycleMax] = self::range($variety->cycle);

        return [
            'yieldMin' => $yieldMin,
            'yieldMax' => $yieldMax,
            'yieldMid' => $yieldMin !== null ? round(($yieldMin + $yieldMax) / 2, 2) : null,
            'cycleMin' => $cycleMin,
            'cycleMax' => $cycleMax,
            'cycleMid' => $cycleMin !== null ? (int) round(($cycleMin + $cycleMax) / 2) : null,
            'seasons' => self::seasons($variety->season),
            'demandScore' => self::DEMAND_SCORE[$variety->demand] ?? 0,
        ];
    }

    // "3.5 - 4 t/ha" => [3.5, 4.0]; "120 days" => [120.0, 120.0]; nothing numeric => [null, null]
    public static function range(?string $text): array
    {
        preg_match_all('/\d+(?:\.\d+)?/', (string) $text, $matches);
        $numbers = array_map('floatval', $matches[0]);

        if (! $numbers) {
            return [null, null];
        }

        return [min($numbers), max($numbers)];
    }

    // "Wet and dry season" => ['wet', 'dry']
    public static function seasons(?string $text): array
    {
        $text = strtolower((string) $text);
        $seasons = [];

        if (str_contains($text, 'wet') || str_contains($text, 'rain')) {
            $seasons[] = 'wet';
        }
        if (str_contains($text, 'dry')) {
            $seasons[] = 'dry';
        }

        return $seasons ?: ['wet'];
    }

    // Planting calendar rows: when to sow, and when the crop is ready, for each season the variety grows in.
    // A stated harvest ("Nov - Jan") is used for the main season; otherwise harvest is estimated
    // from the sowing months plus the growing cycle.
    // A row is an 'estimate' when no source backs the harvest months or the cycle they come from.
    public static function calendar(Variety $variety): array
    {
        $facts = self::for($variety);
        $cycleMin = $facts['cycleMin'] ?? 120;
        $cycleMax = $facts['cycleMax'] ?? 120;
        $stated = self::months($variety->harvest);
        $statedSeason = in_array('wet', $facts['seasons'], true) ? 'wet' : $facts['seasons'][0];
        // Null means a source exists but doesn't say what it covers, so treat everything as unconfirmed.
        $unconfirmed = $variety->unconfirmedFacts() ?? Variety::FACTS;

        return collect($facts['seasons'])->map(function (string $season) use ($cycleMin, $cycleMax, $stated, $statedSeason, $unconfirmed) {
            $sow = self::SOWING_MONTHS[$season];

            if ($stated && $season === $statedSeason) {
                return [
                    'season' => $season,
                    'sow' => $sow,
                    'harvest' => $stated,
                    'harvestStated' => true,
                    'estimate' => in_array('harvest', $unconfirmed, true),
                ];
            }

            // Harvest runs from the earliest sowing + shortest cycle to the latest sowing + longest cycle.
            $first = self::addDays($sow[0], 1, $cycleMin);
            $last = self::addDays(end($sow), 28, $cycleMax);
            $harvest = self::monthsBetween($first, $last);

            // A short dry-season cycle can't bring the harvest before March in practice.
            if ($season === 'dry') {
                $harvest = array_values(array_intersect($harvest, self::DRY_HARVEST_MONTHS)) ?: self::DRY_HARVEST_MONTHS;
            }

            return [
                'season' => $season,
                'sow' => $sow,
                'harvest' => $harvest,
                'harvestStated' => false,
                'estimate' => in_array('cycle', $unconfirmed, true),
            ];
        })->all();
    }

    // "Nov - Jan" => [11, 12, 1]; "October" => [10]; nothing recognisable => []
    public static function months(?string $text): array
    {
        preg_match_all('/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i', (string) $text, $matches);
        $found = array_map(fn ($m) => array_search(strtolower($m), ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'], true) + 1, $matches[1]);

        if (! $found) {
            return [];
        }

        return self::monthsBetween($found[0], end($found));
    }

    private static function addDays(int $month, int $day, float $days): int
    {
        return (int) now()->setDate(2026, $month, $day)->addDays((int) $days)->month;
    }

    // Inclusive list of months from $from to $to, wrapping past December.
    private static function monthsBetween(int $from, int $to): array
    {
        $months = [$from];

        while ($from !== $to && count($months) < 12) {
            $from = $from % 12 + 1;
            $months[] = $from;
        }

        return $months;
    }
}
