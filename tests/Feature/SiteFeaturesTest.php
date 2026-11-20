<?php

use App\Models\Comment;
use App\Models\Post;
use App\Models\Rating;
use App\Models\Report;
use App\Models\User;
use App\Support\VarietyFacts;

// Language

test('switching to Khmer sets the page language', function () {
    $this->get('/locale/km')->assertRedirect()->assertCookie('locale', 'km');

    $this->withCookie('locale', 'km')->get('/about')
        ->assertOk()
        ->assertSee('<html lang="km">', false)
        ->assertSee('data-locale="km"', false);
});

test('unknown languages are rejected', function () {
    $this->get('/locale/fr')->assertNotFound();
});

// Dashboard (all numbers come from the backend)

test('the dashboard shows views, comments and ratings for the user\'s posts', function () {
    $user = User::factory()->create();
    $post = post($user);
    $post->forceFill(['views' => 12])->save();
    Comment::create(['post_id' => $post->id, 'user_id' => $user->id, 'body' => 'Nice']);
    Rating::create(['post_id' => $post->id, 'user_id' => User::factory()->create()->id, 'rating' => 4]);
    Rating::create(['post_id' => $post->id, 'user_id' => User::factory()->create()->id, 'rating' => 5]);

    $response = $this->actingAs($user)->get('/dashboard')->assertOk();

    $stats = $response->viewData('stats');
    expect($stats['views'])->toBe(12)
        ->and($stats['comments'])->toBe(1)
        ->and($stats['avgRating'])->toBe(4.5)
        ->and($response->viewData('site'))->toBeNull();
});

test('admins also get site-wide numbers', function () {
    $this->actingAs(admin())->get('/dashboard')->assertOk()->assertViewHas('site', fn ($site) => $site['users'] === 1);
});

test('a post view is counted once per visitor session', function () {
    $post = post(User::factory()->create());

    $this->get("/news/{$post->id}")->assertOk();
    $this->get("/news/{$post->id}")->assertOk();

    expect($post->fresh()->views)->toBe(1);
});

// News pagination

test('news posts beyond the first page are reachable', function () {
    $author = User::factory()->create();
    foreach (range(1, 11) as $i) {
        post($author, ['title' => "Post number {$i}"]);
    }

    $this->get('/news?page=2')->assertOk()->assertSee('&quot;current&quot;:2', false);
});

// Search

test('search matches every word across columns and filters by type', function () {
    variety(['name' => 'Sen Kra Ob', 'location' => 'Takeo']);
    variety(['name' => 'Phka Malis', 'location' => 'Prey Veng']);
    marketPrice(['market' => 'Takeo Central']);
    post(User::factory()->create(), ['title' => 'Harvest begins', 'body' => 'Farmers in Takeo start cutting jasmine.']);

    $response = $this->get('/search?q=jasmine+takeo')->assertOk();
    expect(array_column($response->viewData('varieties'), 'name'))->toBe(['Sen Kra Ob'])
        ->and($response->viewData('posts'))->toHaveCount(1);

    $prices = $this->get('/search?q=takeo&type=prices');
    expect($prices->viewData('prices'))->toHaveCount(1)
        ->and($prices->viewData('varieties'))->toHaveCount(0);
});

test('search suggestions come from real data', function () {
    variety(['name' => 'Sen Kra Ob']);
    marketPrice(['market' => 'Senmonorom']);

    $this->getJson('/search/suggest?q=sen')
        ->assertOk()
        ->assertJsonFragment(['label' => 'Sen Kra Ob', 'kind' => 'variety'])
        ->assertJsonFragment(['label' => 'Senmonorom', 'kind' => 'price']);
});

test('search treats % and _ literally', function () {
    variety(['name' => 'Sen Kra Ob']);

    expect($this->get('/search?q=%25')->viewData('varieties'))->toHaveCount(0);
});

// Varieties: compare, recommend, calendar

test('variety text is turned into numbers', function () {
    $facts = VarietyFacts::for(variety(['yield' => '3.5 - 4 t/ha', 'cycle' => '105 - 115 days', 'season' => 'Wet and dry season']));

    expect($facts['yieldMid'])->toBe(3.75)
        ->and($facts['cycleMin'])->toBe(105.0)
        ->and($facts['seasons'])->toBe(['wet', 'dry']);
});

test('the calendar puts the harvest after the growing cycle', function () {
    $calendar = VarietyFacts::calendar(variety(['cycle' => '130 - 140 days', 'season' => 'Wet season']));

    // Sown June-July (FAO), plus 130-140 days.
    expect($calendar)->toHaveCount(1)
        ->and($calendar[0]['sow'])->toBe([6, 7])
        ->and($calendar[0]['harvest'])->toBe([10, 11, 12]);
});

test('dry-season harvests wrap into the next year but never start before March', function () {
    $calendar = VarietyFacts::calendar(variety(['cycle' => '105 - 115 days', 'season' => 'Dry season']));

    // Sown November-January; a 105-day crop sown on 1 November would be ready in February,
    // but the dry-season harvest is March-May (FAO, FAO GIEWS).
    expect($calendar[0]['sow'])->toBe([11, 12, 1])
        ->and($calendar[0]['harvest'])->toBe([3, 4, 5]);
});

test('calendar rows without a source for the cycle are marked as estimates', function () {
    $unsourced = VarietyFacts::calendar(variety(['name' => 'Unsourced']));
    $sourced = VarietyFacts::calendar(variety(['name' => 'Sourced', 'sources' => [
        ['title' => 'A study', 'url' => 'https://example.org/study', 'confirms' => ['cycle']],
    ]]));

    expect($unsourced[0]['estimate'])->toBeTrue()
        ->and($sourced[0]['estimate'])->toBeFalse();
});

test('compare shows up to four varieties', function () {
    $ids = collect(range(1, 5))->map(fn ($i) => variety(['name' => "Variety {$i}"])->id);

    $response = $this->get('/variety/compare?'.http_build_query(['ids' => $ids->all()]))->assertOk();

    expect($response->viewData('selected'))->toHaveCount(4);
});

test('recommendations fit the season and follow the priority', function () {
    variety(['name' => 'Fast Rice', 'cycle' => '100 days', 'yield' => '3 t/ha', 'demand' => 'Medium', 'season' => 'Wet and dry season']);
    variety(['name' => 'Popular Rice', 'cycle' => '150 days', 'yield' => '3 t/ha', 'demand' => 'Very High', 'season' => 'Wet season']);

    $dry = $this->get('/variety/recommend?season=dry')->viewData('results');
    expect(collect($dry)->pluck('name')->all())->toBe(['Fast Rice']);

    $byDemand = $this->get('/variety/recommend?season=wet&priority=demand')->viewData('results');
    expect($byDemand[0]['name'])->toBe('Popular Rice');

    $bySpeed = $this->get('/variety/recommend?season=wet&priority=fast')->viewData('results');
    expect($bySpeed[0]['name'])->toBe('Fast Rice');
});

test('the planting calendar page loads for a province', function () {
    variety();

    $this->get('/calendar?province=Takeo')->assertOk()->assertViewHas('province', 'Takeo');
    $this->get('/calendar?province=Nowhere')->assertOk()->assertViewHas('province', 'Phnom Penh');
});

// Moderation

test('users can report a comment and admins can remove it', function () {
    $author = User::factory()->create();
    $post = post($author);
    $comment = Comment::create(['post_id' => $post->id, 'user_id' => $author->id, 'body' => 'Buy cheap pills']);

    $this->actingAs(User::factory()->create())
        ->post('/reports', ['type' => 'comment', 'id' => $comment->id, 'reason' => 'spam'])
        ->assertSessionHas('success');

    $report = Report::first();
    expect($report->reportable->is($comment))->toBeTrue();

    $this->actingAs(admin())->get('/admin/reports')->assertOk()->assertSee('Buy cheap pills');
    $this->actingAs(admin())->post("/admin/reports/{$report->id}/remove")->assertRedirect();

    expect(Comment::find($comment->id))->toBeNull()
        ->and($report->fresh()->status)->toBe('removed');
});

test('reporting the same item twice keeps one report', function () {
    $post = post(User::factory()->create());
    $reporter = User::factory()->create();

    $this->actingAs($reporter)->post('/reports', ['type' => 'post', 'id' => $post->id, 'reason' => 'spam']);
    $this->actingAs($reporter)->post('/reports', ['type' => 'post', 'id' => $post->id, 'reason' => 'misleading']);

    expect(Report::count())->toBe(1)->and(Report::first()->reason)->toBe('misleading');
});

test('dismissing a report keeps the content', function () {
    $post = post(User::factory()->create());
    $this->actingAs(User::factory()->create())->post('/reports', ['type' => 'post', 'id' => $post->id, 'reason' => 'other']);

    $this->actingAs(admin())->post('/admin/reports/'.Report::first()->id.'/dismiss');

    expect(Post::find($post->id))->not->toBeNull()->and(Report::first()->status)->toBe('dismissed');
});

test('only posts and comments can be reported', function () {
    $this->actingAs(User::factory()->create())
        ->post('/reports', ['type' => 'user', 'id' => 1, 'reason' => 'spam'])
        ->assertSessionHasErrors('type');
});
