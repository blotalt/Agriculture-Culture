<?php

use App\Models\PriceImport;
use App\Models\PriceRecord;
use App\Models\User;
use App\Models\Variety;
use Illuminate\Support\Facades\Storage;

// A tiny WFP-format file: two months for two markets, plus a non-rice row that must be ignored.
function wfpCsv(): string
{
    return implode("\n", [
        'date,admin1,admin2,market,market_id,latitude,longitude,category,commodity,commodity_id,unit,priceflag,pricetype,currency,price,usdprice',
        '2026-02-15,Siemreap,Kralanh,Kralanh,1,13.6,103.4,cereals and tubers,"Rice (mixed, low quality)",52,KG,actual,Retail,KHR,2000,0.50',
        '2026-02-15,Takeo,Doun Kaev,Takeo,2,11.0,104.8,cereals and tubers,"Rice (mixed, low quality)",52,KG,actual,Retail,KHR,1960,0.49',
        '2026-03-15,Siemreap,Kralanh,Kralanh,1,13.6,103.4,cereals and tubers,"Rice (mixed, low quality)",52,KG,actual,Retail,KHR,2200,0.55',
        '2026-03-15,Takeo,Doun Kaev,Takeo,2,11.0,104.8,cereals and tubers,"Rice (mixed, low quality)",52,KG,actual,Retail,KHR,1960,0.49',
        '2026-03-15,Takeo,Doun Kaev,Takeo,2,11.0,104.8,pulses and nuts,"Beans (mung)",60,KG,actual,Retail,KHR,6000,1.50',
    ])."\n";
}

function importFixture(): void
{
    $path = tempnam(sys_get_temp_dir(), 'wfp');
    file_put_contents($path, wfpCsv());
    test()->artisan('prices:import', ['--file' => $path])->assertSuccessful();
    unlink($path);
}

beforeEach(fn () => Storage::fake('local'));

test('each import is recorded with a backup copy of the exact file', function () {
    importFixture();

    $import = PriceImport::sole();
    expect($import->sha256)->toBe(hash('sha256', wfpCsv()))
        ->and($import->history_rows)->toBe(4)
        ->and($import->latest_rows)->toBe(2)
        ->and($import->latest_month->toDateString())->toBe('2026-03-15');

    Storage::disk('local')->assertExists($import->snapshot_path);
    expect(gzdecode(Storage::disk('local')->get($import->snapshot_path)))->toBe(wfpCsv());
});

test('importing the same file again keeps one backup copy', function () {
    importFixture();
    importFixture();

    expect(PriceImport::count())->toBe(2)
        ->and(PriceImport::distinct()->count('snapshot_path'))->toBe(1)
        ->and(Storage::disk('local')->files('imports/wfp'))->toHaveCount(1);
});

test('the data download contains every price in the history', function () {
    importFixture();

    $csv = $this->get('/pricemarket/data.csv')
        ->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8')
        ->streamedContent();

    $lines = array_values(array_filter(explode("\n", $csv)));
    expect($lines)->toHaveCount(1 + PriceRecord::count())
        ->and($lines[0])->toBe('date,province,market,rice,price_usd_per_kg,source')
        ->and($csv)->toContain('2026-03-15,"Siem Reap",Kralanh,"Rice (mixed, low quality), retail",0.55');
});

test('the data download can be limited to one province, under any spelling', function () {
    importFixture();

    $csv = $this->get('/pricemarket/data.csv?province=Siemreap')->assertOk()->streamedContent();

    expect($csv)->toContain('Siem Reap')->not->toContain('Takeo');
});

test('the original file download is byte-for-byte what was imported', function () {
    importFixture();

    $file = $this->get('/pricemarket/source-file')->assertOk()->streamedContent();

    expect(hash('sha256', $file))->toBe(PriceImport::sole()->sha256);
});

test('the original file download is a 404 before any import', function () {
    $this->get('/pricemarket/source-file')->assertNotFound();
});

test('the prices page tells readers where the data comes from', function () {
    importFixture();

    $this->get('/pricemarket')
        ->assertOk()
        ->assertViewHas('insights', fn ($insights) => $insights['provenance']['records'] === 4
            && $insights['provenance']['markets'] === 2
            && $insights['provenance']['hasBackup'] === true
            && $insights['provenance']['sha256'] === hash('sha256', wfpCsv()));
});

// Variety sources

test('facts without a source are listed as unconfirmed', function () {
    $variety = variety(['sources' => [
        ['title' => 'IRRI News', 'url' => 'https://news.irri.org/x', 'confirms' => ['yield', 'type']],
    ]]);

    expect($variety->unconfirmedFacts())->toBe(['location', 'cycle', 'harvest', 'season', 'demand'])
        ->and(variety(['name' => 'No sources'])->unconfirmedFacts())->toBe(Variety::FACTS);
});

test('a source given when creating a variety is saved', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/create-variety', [
        'name' => 'Phka Romeat', 'khmer_name' => 'ផ្ការំដេង', 'type' => 'Jasmine', 'location' => 'Battambang',
        'yield' => '3 t/ha', 'cycle' => '130 days', 'season' => 'Wet season', 'demand' => 'High',
        'image' => Illuminate\Http\UploadedFile::fake()->image('r.jpg', 50, 50),
        'source_title' => 'CARDI release note', 'source_url' => 'https://cardi.org.kh/example',
    ])->assertRedirect('/variety');

    $source = Variety::where('name', 'Phka Romeat')->sole()->sources[0];
    expect($source['title'])->toBe('CARDI release note')
        ->and($source['url'])->toBe('https://cardi.org.kh/example')
        ->and($source['added_by'])->toBe($user->name)
        ->and($source['confirms'])->toBeNull();
});

test('editing a variety adds a source and keeps the existing ones', function () {
    $variety = variety(['sources' => [['title' => 'IRRI News', 'url' => 'https://news.irri.org/x', 'confirms' => ['yield']]]]);
    $owner = $variety->user;

    $this->actingAs($owner)->put("/edit-variety/{$variety->id}", $variety->only(['name', 'khmer_name', 'type', 'location', 'yield', 'cycle', 'season', 'demand']) + [
        'source_title' => 'Phnom Penh Post article', 'source_url' => 'https://phnompenhpost.com/example',
    ])->assertRedirect('/manage-varieties');

    expect(collect($variety->fresh()->sources)->pluck('title')->all())->toBe(['IRRI News', 'Phnom Penh Post article']);
});

test('source links must be web addresses', function () {
    $variety = variety();

    $this->actingAs($variety->user)->put("/edit-variety/{$variety->id}", $variety->only(['name', 'khmer_name', 'type', 'location', 'yield', 'cycle', 'season', 'demand']) + [
        'source_url' => 'javascript:alert(1)',
    ])->assertSessionHasErrors('source_url');
});

test('the compare page shows sources and unconfirmed facts', function () {
    $variety = variety(['sources' => [['title' => 'IRRI News', 'url' => 'https://news.irri.org/x', 'confirms' => ['yield']]]]);

    $this->get("/variety/compare?ids[]={$variety->id}")
        ->assertOk()
        ->assertViewHas('selected', fn ($selected) => $selected[0]['sources'][0]['title'] === 'IRRI News'
            && ! in_array('yield', $selected[0]['unconfirmed'], true));
});

// Stated harvest months

test('harvest months are read from text like "Nov - Jan"', function () {
    expect(App\Support\VarietyFacts::months('Nov - Jan'))->toBe([11, 12, 1])
        ->and(App\Support\VarietyFacts::months('October'))->toBe([10])
        ->and(App\Support\VarietyFacts::months(null))->toBe([]);
});

test('a stated harvest replaces the estimate in the planting calendar', function () {
    $stated = App\Support\VarietyFacts::calendar(variety(['harvest' => 'Nov - Jan', 'season' => 'Wet season']));
    $estimated = App\Support\VarietyFacts::calendar(variety(['name' => 'Other', 'season' => 'Wet season']));

    expect($stated[0]['harvest'])->toBe([11, 12, 1])
        ->and($stated[0]['harvestStated'])->toBeTrue()
        ->and($estimated[0]['harvestStated'])->toBeFalse();
});
