<?php

use App\Models\PriceRecord;
use App\Services\PriceInsights;

test('saving a price records it in the history', function () {
    marketPrice(['price_per_kg' => 0.50, 'recorded_on' => '2026-08-01']);

    expect(PriceRecord::count())->toBe(1)
        ->and(PriceRecord::first()->price_per_kg)->toBe(0.5);
});

test('the change percent is calculated from the previous reading', function () {
    marketPrice(['price_per_kg' => 0.50, 'recorded_on' => '2026-08-01']);
    $latest = marketPrice(['price_per_kg' => 0.55, 'recorded_on' => '2026-09-01']);

    expect((float) $latest->change_percent)->toBe(10.0);
});

test('a typed-in change percent is ignored', function () {
    $this->actingAs(admin())->post('/admin/market-prices', [
        'rice_variety' => 'Phka Rumduol', 'rice_type' => 'Jasmine', 'province' => 'Takeo',
        'market' => 'Takeo Central', 'price_per_kg' => 0.5, 'change_percent' => 99,
    ]);

    expect((float) App\Models\MarketPrice::first()->change_percent)->toBe(0.0);
});

test('editing a price on the same day updates that day in the history', function () {
    $price = marketPrice(['price_per_kg' => 0.50, 'recorded_on' => '2026-09-01']);
    $price->update(['price_per_kg' => 0.52]);

    expect(PriceRecord::count())->toBe(1)
        ->and(PriceRecord::first()->price_per_kg)->toBe(0.52);
});

test('a price without a date is recorded as today', function () {
    $price = App\Models\MarketPrice::create([
        'rice_variety' => 'Phka Rumduol', 'rice_type' => 'Jasmine', 'province' => 'Takeo',
        'market' => 'Takeo Central', 'price_per_kg' => 0.5,
    ]);

    expect($price->recorded_on->toDateString())->toBe(now()->toDateString());
});

test('insights give monthly averages and province trends', function () {
    marketPrice(['market' => 'A', 'price_per_kg' => 0.40, 'recorded_on' => '2025-09-10']);
    marketPrice(['market' => 'A', 'price_per_kg' => 0.50, 'recorded_on' => '2026-08-10']);
    marketPrice(['market' => 'A', 'price_per_kg' => 0.60, 'recorded_on' => '2026-09-10']);
    marketPrice(['market' => 'B', 'province' => 'Siemreap', 'price_per_kg' => 0.40, 'recorded_on' => '2026-09-10']);

    $insights = app(PriceInsights::class)->forPage();

    expect(collect($insights['national'])->firstWhere('month', '2026-09')['avg'])->toBe(0.5);

    $takeo = collect($insights['provinces'])->firstWhere('name', 'Takeo');
    expect($takeo['change1m'])->toBe(20.0)
        ->and($takeo['change12m'])->toBe(50.0);

    // "Siemreap" in the data is matched to the standard "Siem Reap".
    expect(collect($insights['provinces'])->firstWhere('name', 'Siem Reap')['markets'])->toBe(1)
        ->and(array_keys($insights['byProvince']))->toContain('Siem Reap');
});

test('the prices page shows history, map data and weather', function () {
    Http::fake(['api.open-meteo.com/*' => Http::response(collect(config('provinces'))->map(fn () => [
        'daily' => [
            'time' => ['2026-10-06'], 'weather_code' => [61], 'temperature_2m_max' => [32],
            'temperature_2m_min' => [24], 'precipitation_sum' => [5], 'precipitation_probability_max' => [80],
        ],
    ])->all())]);

    marketPrice(['recorded_on' => '2026-08-01']);
    marketPrice(['recorded_on' => '2026-09-01', 'price_per_kg' => 0.55]);

    $this->get('/pricemarket')
        ->assertOk()
        ->assertSee('data-insights', false)
        ->assertSee('2026-09', false)
        ->assertSee('rainChance', false);
});

test('the prices page still works when the weather service is down', function () {
    marketPrice();

    $this->get('/pricemarket')->assertOk();
});
