<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function admin(): App\Models\User
{
    $user = App\Models\User::factory()->create();
    $user->forceFill(['is_admin' => true])->save();

    return $user;
}

function marketPrice(array $overrides = []): App\Models\MarketPrice
{
    return App\Models\MarketPrice::create($overrides + [
        'rice_variety' => 'Phka Rumduol',
        'rice_type' => 'Jasmine',
        'province' => 'Takeo',
        'market' => 'Takeo Central',
        'price_per_kg' => 0.50,
        'recorded_on' => '2026-09-01',
    ]);
}

function variety(array $overrides = []): App\Models\Variety
{
    return App\Models\Variety::create($overrides + [
        'name' => 'Phka Rumduol',
        'khmer_name' => 'ផ្ការំដួល',
        'type' => 'Jasmine',
        'location' => 'Battambang',
        'yield' => '3.5 - 4 t/ha',
        'cycle' => '130 - 140 days',
        'season' => 'Wet season',
        'demand' => 'Very High',
        'user_id' => App\Models\User::factory()->create()->id,
    ]);
}

function post(App\Models\User $author, array $overrides = []): App\Models\Post
{
    return App\Models\Post::create($overrides + [
        'title' => 'Rice prices rise in Takeo',
        'body' => 'Jasmine paddy prices climbed this week.',
        'user_id' => $author->id,
    ]);
}
