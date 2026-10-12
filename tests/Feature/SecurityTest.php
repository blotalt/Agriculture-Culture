<?php

use App\Models\Comment;
use App\Models\MarketPrice;
use App\Models\Post;
use App\Models\User;

test('guests are sent to login from admin price pages', function () {
    $this->get('/admin/market-prices')->assertRedirect('/login');
    $this->post('/admin/market-prices', [])->assertRedirect('/login');
});

test('regular users cannot manage market prices', function () {
    $user = User::factory()->create();
    $price = marketPrice();

    $this->actingAs($user)->get('/admin/market-prices')->assertForbidden();
    $this->actingAs($user)->post('/admin/market-prices', [
        'rice_variety' => 'Fake', 'rice_type' => 'Fake', 'province' => 'Takeo', 'market' => 'X', 'price_per_kg' => 9,
    ])->assertForbidden();
    $this->actingAs($user)->delete("/admin/market-prices/{$price->id}")->assertForbidden();

    expect(MarketPrice::count())->toBe(1);
});

test('admins can manage market prices', function () {
    $this->actingAs(admin())->get('/admin/market-prices')->assertOk();

    $this->actingAs(admin())->post('/admin/market-prices', [
        'rice_variety' => 'Sen Kra Ob', 'rice_type' => 'Jasmine', 'province' => 'Takeo',
        'market' => 'Takeo Central', 'price_per_kg' => 0.6,
    ])->assertRedirect('/admin/market-prices');

    expect(MarketPrice::where('rice_variety', 'Sen Kra Ob')->exists())->toBeTrue();
});

test('the admin moderation queue is admin only', function () {
    $this->actingAs(User::factory()->create())->get('/admin/reports')->assertForbidden();
    $this->actingAs(admin())->get('/admin/reports')->assertOk();
});

test('guests cannot create, edit or delete posts', function () {
    $post = post(User::factory()->create());

    $this->post('/create-post', ['title' => 'x', 'body' => 'y'])->assertRedirect('/login');
    $this->put("/edit-post/{$post->id}", ['title' => 'x', 'body' => 'y'])->assertRedirect('/login');
    $this->delete("/delete-post/{$post->id}")->assertRedirect('/login');

    expect(Post::count())->toBe(1);
});

test('users cannot delete someone else\'s post', function () {
    $post = post(User::factory()->create());

    $this->actingAs(User::factory()->create())->delete("/delete-post/{$post->id}");

    expect(Post::find($post->id))->not->toBeNull();
});

test('guests cannot comment or rate', function () {
    $post = post(User::factory()->create());

    $this->post("/news/{$post->id}/comments", ['body' => 'hi'])->assertRedirect('/login');
    $this->post("/news/{$post->id}/rating", ['rating' => 5])->assertRedirect('/login');

    expect(Comment::count())->toBe(0);
});

test('commenting on a missing post is a 404, not a database error', function () {
    $this->actingAs(User::factory()->create())
        ->post('/news/999/comments', ['body' => 'hi'])
        ->assertNotFound();
});

test('logging out ends the session', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/logout')->assertRedirect('/');

    $this->assertGuest();
});
