<?php

use App\Models\PriceAlert;
use App\Models\User;
use App\Notifications\PriceAlertTriggered;
use Illuminate\Support\Facades\Notification;

function alertFor(User $user, array $overrides = []): PriceAlert
{
    return $user->priceAlerts()->create($overrides + [
        'rice_variety' => 'Phka Rumduol',
        'province' => 'Takeo',
        'direction' => 'above',
        'threshold' => 0.60,
        'notify_email' => true,
    ]);
}

test('users can create and list alerts', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/alerts', [
        'rice_variety' => 'Phka Rumduol', 'province' => 'Takeo', 'direction' => 'below',
        'threshold' => 0.45, 'notify_email' => 1,
    ])->assertRedirect('/alerts');

    expect($user->priceAlerts()->count())->toBe(1);
    $this->actingAs($user)->get('/alerts')->assertOk()->assertSee('0.45', false);
});

test('an alert needs at least one way to be notified', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/alerts', ['direction' => 'above', 'threshold' => 0.5])
        ->assertSessionHasErrors('notify_email');

    expect(PriceAlert::count())->toBe(0);
});

test('alerts reject unknown provinces', function () {
    $this->actingAs(User::factory()->create())
        ->post('/alerts', ['province' => 'Atlantis', 'direction' => 'above', 'threshold' => 1, 'notify_email' => 1])
        ->assertSessionHasErrors('province');
});

test('users cannot delete someone else\'s alert', function () {
    $alert = alertFor(User::factory()->create());

    $this->actingAs(User::factory()->create())->delete("/alerts/{$alert->id}")->assertForbidden();

    expect(PriceAlert::count())->toBe(1);
});

test('a matching price notifies the user once', function () {
    Notification::fake();
    $user = User::factory()->create();
    alertFor($user);

    marketPrice(['price_per_kg' => 0.65]);

    Notification::assertSentToTimes($user, PriceAlertTriggered::class, 1);

    // Saving the same price again does not repeat the alert.
    App\Models\MarketPrice::first()->touch();
    Notification::assertSentToTimes($user, PriceAlertTriggered::class, 1);
});

test('prices that do not meet the alert are ignored', function () {
    Notification::fake();
    $user = User::factory()->create();
    alertFor($user);

    marketPrice(['price_per_kg' => 0.55]);                             // below the 0.60 target
    marketPrice(['price_per_kg' => 0.90, 'province' => 'Kampot']);     // another province
    marketPrice(['price_per_kg' => 0.90, 'rice_variety' => 'Sen Kra Ob']);

    Notification::assertNothingSent();
});

test('province spellings are matched', function () {
    Notification::fake();
    $user = User::factory()->create();
    alertFor($user, ['province' => 'Siem Reap', 'rice_variety' => null]);

    marketPrice(['province' => 'Siemreap', 'price_per_kg' => 0.7]);

    Notification::assertSentTo($user, PriceAlertTriggered::class);
});

test('telegram is used only when a bot token is configured', function () {
    $user = User::factory()->create();
    $alert = alertFor($user, ['notify_email' => false, 'telegram_chat_id' => '12345']);
    $notification = new PriceAlertTriggered($alert, marketPrice(['price_per_kg' => 0.1]));

    config(['services.telegram.bot_token' => null]);
    expect($notification->via($user))->toBe([]);

    config(['services.telegram.bot_token' => 'test-token']);
    expect($notification->via($user))->toBe([App\Notifications\Channels\TelegramChannel::class]);
});

test('a failing notification does not stop the price from saving', function () {
    config(['services.telegram.bot_token' => 'test-token']);
    Http::fake(['api.telegram.org/*' => Http::response(['ok' => false], 400)]);
    alertFor(User::factory()->create(), ['notify_email' => false, 'telegram_chat_id' => '12345']);

    $price = marketPrice(['price_per_kg' => 0.9]);

    expect($price->exists)->toBeTrue();
});
