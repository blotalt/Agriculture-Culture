<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class MarketPriceSeeder extends Seeder
{
    public function run(): void
    {
        // Real prices from WFP / HDX (needs internet). Re-run any time with: php artisan prices:import
        if ($this->command->call('prices:import') !== 0) {
            $this->command->warn('Price import failed; the Prices page will be empty until prices:import succeeds.');
        }
    }
}
