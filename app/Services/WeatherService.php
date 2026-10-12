<?php

namespace App\Services;

use App\Support\Provinces;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * 7-day forecasts for every province from Open-Meteo (free, no API key).
 * One request covers all provinces; results are cached for three hours.
 */
class WeatherService
{
    private const URL = 'https://api.open-meteo.com/v1/forecast';

    // Bump when the shape of a day or the number of days changes, so stale cached forecasts aren't served.
    private const CACHE_KEY = 'weather.forecasts.v3';

    private const DAYS = 7;

    // province name => [['date' => '2026-10-06', 'max' => 32.1, 'min' => 24.0, 'rain' => 4.2, 'rainChance' => 70, 'code' => 61, 'wind' => 18.5], ...]
    public function forecasts(): array
    {
        $cached = Cache::get(self::CACHE_KEY);

        if ($cached !== null) {
            return $cached;
        }

        $forecasts = $this->fetch();

        // Retry sooner after a failure so a short outage doesn't hide the weather for hours.
        Cache::put(self::CACHE_KEY, $forecasts, $forecasts ? now()->addHours(3) : now()->addMinutes(10));

        return $forecasts;
    }

    // Fetch now; keep the previous forecasts if Open-Meteo is unreachable.
    public function refresh(): array
    {
        $forecasts = $this->fetch();

        if ($forecasts) {
            Cache::put(self::CACHE_KEY, $forecasts, now()->addHours(4));
        }

        return $forecasts;
    }

    private function fetch(): array
    {
        $provinces = Provinces::all();

        try {
            $response = Http::timeout(8)->get(self::URL, [
                'latitude' => implode(',', array_column($provinces, 'lat')),
                'longitude' => implode(',', array_column($provinces, 'lng')),
                'daily' => 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
                'timezone' => 'Asia/Phnom_Penh',
                'forecast_days' => self::DAYS,
            ]);
        } catch (Throwable $e) {
            report($e);
            return [];
        }

        if (! $response->successful()) {
            return [];
        }

        // A single location comes back as an object, several as a list.
        $locations = array_is_list($response->json()) ? $response->json() : [$response->json()];
        $forecasts = [];

        foreach ($provinces as $i => $province) {
            $daily = $locations[$i]['daily'] ?? null;

            if (! $daily) {
                continue;
            }

            $forecasts[$province['name']] = collect($daily['time'])->map(fn ($date, $d) => [
                'date' => $date,
                'max' => $daily['temperature_2m_max'][$d] ?? null,
                'min' => $daily['temperature_2m_min'][$d] ?? null,
                'rain' => $daily['precipitation_sum'][$d] ?? null,
                'rainChance' => $daily['precipitation_probability_max'][$d] ?? null,
                'code' => $daily['weather_code'][$d] ?? null,
                'wind' => $daily['wind_speed_10m_max'][$d] ?? null, // km/h
            ])->all();
        }

        return $forecasts;
    }
}
