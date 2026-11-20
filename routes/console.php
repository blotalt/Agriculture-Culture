<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Admin rights are only granted from the command line, never through the website.
Artisan::command('app:make-admin {name} {--revoke}', function (string $name) {
    $user = \App\Models\User::where('name', $name)->first();

    if (! $user) {
        $this->error("No user named '{$name}'.");
        return 1;
    }

    $user->is_admin = ! $this->option('revoke');
    $user->save();

    $this->info($user->is_admin ? "{$name} is now an admin." : "{$name} is no longer an admin.");
})->purpose('Grant (or --revoke) admin rights for a user');

// Fetch fresh weather in the background so page loads never wait on Open-Meteo.
Artisan::command('weather:refresh', function (\App\Services\WeatherService $weather) {
    $count = count($weather->refresh());
    $count ? $this->info("Forecasts for {$count} provinces.") : $this->warn("Open-Meteo unreachable; kept the cached forecasts.");
})->purpose('Refresh the cached 7-day weather forecasts');

// Runs with `php artisan schedule:work` (or a cron entry calling schedule:run every minute).
Schedule::command('prices:import')->weeklyOn(1, '06:00')->withoutOverlapping();
Schedule::command('weather:refresh')->everyThreeHours();
