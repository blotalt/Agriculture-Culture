<?php

namespace App\Http\Controllers;

use App\Models\MarketPrice;
use App\Models\PriceImport;
use App\Models\PriceRecord;
use App\Services\PriceInsights;
use App\Services\WeatherService;
use App\Support\Provinces;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MarketPriceController extends Controller
{
    public const DATASET_URL = 'https://data.humdata.org/dataset/wfp-food-prices-for-cambodia';

    public function index(PriceInsights $insights, WeatherService $weather)
    {
        $prices = MarketPrice::orderBy('province')->orderBy('market')->get()
            ->each(fn (MarketPrice $price) => $price->setAttribute('province_name', Provinces::canonical($price->province)));

        return view('pricemarket', [
            'prices' => $prices,
            'insights' => $insights->forPage() + ['provenance' => $this->provenance()],
            'weather' => $weather->forecasts(),
        ]);
    }

    // Every price in the history, as CSV, so anyone can check the numbers on the page.
    // ?province= limits it to one province (any known spelling).
    public function downloadData(Request $request)
    {
        $province = Provinces::find($request->query('province'))['name'] ?? null;
        $name = 'khmerrice-rice-prices'.($province ? '-'.str($province)->slug() : '').'-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($province) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['date', 'province', 'market', 'rice', 'price_usd_per_kg', 'source'], escape: '');

            foreach (PriceRecord::orderBy('recorded_on')->orderBy('province')->orderBy('market')->cursor() as $record) {
                $standard = Provinces::canonical($record->province);
                if ($province && $standard !== $province) {
                    continue;
                }

                fputcsv($out, [
                    $record->recorded_on->toDateString(),
                    $standard,
                    $record->market,
                    $record->source === 'wfp' ? 'Rice (mixed, low quality), retail' : $record->rice_variety,
                    number_format($record->price_per_kg, 2, '.', ''),
                    $record->source === 'wfp' ? 'WFP / AMO-MAFF via HDX (CC BY-IGO)' : 'Entered by a KhmerRice admin',
                ], escape: '');
            }

            fclose($out);
        }, $name, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    // The original WFP file exactly as it was downloaded at the latest import (the backup copy).
    public function downloadSource()
    {
        $import = PriceImport::whereNotNull('snapshot_path')->latest('id')->first();
        $disk = Storage::disk('local');

        abort_unless($import && $disk->exists($import->snapshot_path), 404);

        $path = $disk->path($import->snapshot_path);

        return response()->streamDownload(function () use ($path) {
            $gz = gzopen($path, 'rb');
            while (! gzeof($gz)) {
                echo gzread($gz, 65536);
            }
            gzclose($gz);
        }, basename($import->snapshot_path, '.gz'), ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    // Where the numbers on the Prices page come from, for the "Sources" box.
    private function provenance(): array
    {
        $import = PriceImport::latest('id')->first();

        return [
            'datasetUrl' => self::DATASET_URL,
            'fileUrl' => $import?->source_url,
            'importedAt' => $import?->created_at?->toIso8601String(),
            'sourceUpdatedAt' => $import?->source_updated_at?->toIso8601String(),
            'sha256' => $import?->sha256,
            'hasBackup' => (bool) ($import?->snapshot_path && Storage::disk('local')->exists($import->snapshot_path)),
            'records' => PriceRecord::count(),
            'markets' => PriceRecord::distinct()->count('market'),
            'from' => PriceRecord::min('recorded_on'),
            'to' => PriceRecord::max('recorded_on'),
            'manual' => MarketPrice::whereNull('source')->count(),
        ];
    }

    public function adminIndex()
    {
        $prices = MarketPrice::latest()->paginate(10);
        return view('admin.market-prices.index', compact('prices'));
    }

    public function create()
    {
        return view('admin.market-prices.create');
    }

    public function store(Request $request)
    {
        MarketPrice::create($this->validated($request));

        return redirect()->route('admin.market-prices.index')
            ->with('success', 'Price added successfully!');
    }

    public function edit(MarketPrice $marketPrice)
    {
        return view('admin.market-prices.edit', compact('marketPrice'));
    }

    public function update(Request $request, MarketPrice $marketPrice)
    {
        $marketPrice->update($this->validated($request));

        return redirect()->route('admin.market-prices.index')
            ->with('success', 'Price updated successfully!');
    }

    public function destroy(MarketPrice $marketPrice)
    {
        $marketPrice->delete();

        return redirect()->route('admin.market-prices.index')
            ->with('success', 'Price deleted successfully!');
    }

    // The change column is worked out from the price history, so it is not accepted here.
    private function validated(Request $request): array
    {
        return $request->validate([
            'rice_variety' => 'required|string|max:255',
            'rice_type' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'market' => 'required|string|max:255',
            'price_per_kg' => 'required|numeric|min:0',
            'recorded_on' => 'nullable|date|before_or_equal:today',
        ]);
    }
}
