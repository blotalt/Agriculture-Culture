<?php

namespace App\Console\Commands;

use App\Models\MarketPrice;
use App\Models\PriceImport;
use App\Models\PriceRecord;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

/**
 * Imports real retail rice prices for Cambodia from the WFP food price dataset on HDX.
 * Data: AMO-MAFF / WFP, licensed CC BY-IGO (attribution required, shown on the Prices page).
 * https://data.humdata.org/dataset/wfp-food-prices-for-cambodia
 *
 * Every run is recorded in price_imports, and a gzipped copy of the exact file that was
 * downloaded is kept in storage/app/private/imports/wfp (one copy per distinct file), as a
 * backup and as evidence of what the published data said.
 */
class ImportMarketPrices extends Command
{
    protected $signature = 'prices:import {--file= : Read a local CSV instead of downloading}';

    protected $description = 'Import the latest monthly rice prices per market from WFP / HDX';

    private const DATASET_API = 'https://data.humdata.org/api/3/action/package_show?id=wfp-food-prices-for-cambodia';

    public const SNAPSHOT_DIR = 'imports/wfp';

    public function handle(): int
    {
        [$csv, $sourceUrl, $sourceUpdatedAt] = $this->option('file')
            ? [@file_get_contents($this->option('file')), null, null]
            : $this->download();

        if (! $csv) {
            $this->error('Could not read the price data.');
            return self::FAILURE;
        }

        // date => market => row, retail rice only
        $byMonth = [];
        $lines = preg_split('/\r\n|\n/', trim($csv));
        $header = str_getcsv(array_shift($lines), escape: '');

        foreach ($lines as $line) {
            $row = str_getcsv($line, escape: '');
            if (count($row) !== count($header)) continue;
            $row = array_combine($header, $row);

            if (stripos($row['commodity'], 'rice') === false || $row['pricetype'] !== 'Retail' || $row['unit'] !== 'KG') continue;

            $byMonth[$row['date']][$row['market_id']] = $row;
        }

        if (! $byMonth) {
            $this->error('No retail rice prices found in the data.');
            return self::FAILURE;
        }

        ksort($byMonth);
        $latestDate = array_key_last($byMonth);
        $latest = $byMonth[$latestDate];
        $snapshot = $this->backup($csv);

        DB::transaction(function () use ($byMonth, $latest, $latestDate, $csv, $snapshot, $sourceUrl, $sourceUpdatedAt) {
            // Keep every month as history, for charts and trends.
            $history = [];
            foreach ($byMonth as $date => $markets) {
                foreach ($markets as $row) {
                    $history[] = [
                        'rice_variety' => 'Mixed Rice',
                        'province' => $row['admin1'],
                        'market' => $row['market'],
                        'price_per_kg' => $row['usdprice'],
                        'recorded_on' => $date,
                        'source' => 'wfp',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
            foreach (array_chunk($history, 500) as $chunk) {
                PriceRecord::upsert($chunk, ['rice_variety', 'market', 'recorded_on'], ['province', 'price_per_kg', 'source', 'updated_at']);
            }

            // The latest month becomes the current price list; the change column is
            // worked out by MarketPrice from the history saved above.
            MarketPrice::where('source', 'wfp')->delete();

            foreach ($latest as $row) {
                MarketPrice::create([
                    'rice_variety' => 'Mixed Rice',
                    'rice_type' => 'Low quality, retail',
                    'province' => $row['admin1'],
                    'market' => $row['market'],
                    'price_per_kg' => $row['usdprice'],
                    'source' => 'wfp',
                    'recorded_on' => $latestDate,
                ]);
            }

            PriceImport::create([
                'source' => 'wfp',
                'source_url' => $sourceUrl,
                'source_updated_at' => $sourceUpdatedAt,
                'sha256' => hash('sha256', $csv),
                'bytes' => strlen($csv),
                'snapshot_path' => $snapshot,
                'history_rows' => count($history),
                'latest_rows' => count($latest),
                'latest_month' => $latestDate,
            ]);

            $this->line('Saved '.count($history).' monthly prices to the history.');
        });

        $this->info('Imported '.count($latest)." market prices for {$latestDate}.");
        $this->line("Backup copy of the source file: storage/app/private/{$snapshot}");

        return self::SUCCESS;
    }

    // Keep a gzipped copy of the downloaded file. Identical files are stored once.
    private function backup(string $csv): string
    {
        $sha = hash('sha256', $csv);
        $disk = Storage::disk('local');

        $existing = PriceImport::where('sha256', $sha)->whereNotNull('snapshot_path')->latest('id')->value('snapshot_path');
        if ($existing && $disk->exists($existing)) {
            return $existing;
        }

        $path = self::SNAPSHOT_DIR.'/wfp_food_prices_khm_'.now()->format('Y-m-d_His').'.csv.gz';
        $disk->put($path, gzencode($csv, 9));

        return $path;
    }

    /** @return array{0: ?string, 1: ?string, 2: ?Carbon} the CSV, its URL, and when HDX last updated it */
    private function download(): array
    {
        $this->line('Looking up the latest WFP dataset on HDX...');

        $resources = Http::timeout(60)->get(self::DATASET_API)->json('result.resources', []);
        $resource = collect($resources)->first(fn ($r) => str_ends_with($r['url'] ?? '', 'wfp_food_prices_khm.csv'));

        if (! $resource) {
            return [null, null, null];
        }

        $this->line('Downloading prices...');

        $response = Http::timeout(180)->get($resource['url']);
        $updated = ! empty($resource['last_modified']) ? Carbon::parse($resource['last_modified'], 'UTC') : null;

        return [$response->successful() ? $response->body() : null, $resource['url'], $updated];
    }
}
