<?php

use App\Models\Lesson;
use App\Models\Topic;

test('admins can pin a fact card to a part of the rice diagram', function () {
    $topic = Topic::create(['slug' => 'how-rice-grows', 'title' => 'How Rice Grows']);

    $this->actingAs(admin())->post('/admin/learn/lessons', [
        'topic_id' => $topic->id,
        'title' => 'Inside the Rice Plant',
        'layout' => 'cards',
        'level' => 'beginner',
        'published' => '1',
        'items' => [
            ['icon' => '🌱', 'title' => 'Roots', 'text' => 'Roots hold the plant up.[1]', 'part' => 'root'],
            ['icon' => '🍚', 'title' => 'Eating rice', 'text' => 'Not on the diagram.[1]', 'part' => ''],
        ],
        'sources' => [['title' => 'Rice anatomy', 'url' => 'https://example.com/anatomy']],
    ])->assertRedirect('/admin/learn')->assertSessionHasNoErrors();

    $items = Lesson::where('title', 'Inside the Rice Plant')->firstOrFail()->items;

    expect($items[0]['part'])->toBe('root')
        ->and($items[1]['part'] ?? null)->toBeNull();
});

test('a fact card can only point at a known part of the diagram', function () {
    $topic = Topic::create(['slug' => 'how-rice-grows', 'title' => 'How Rice Grows']);

    $this->actingAs(admin())->post('/admin/learn/lessons', [
        'topic_id' => $topic->id,
        'title' => 'Inside the Rice Plant',
        'layout' => 'cards',
        'level' => 'beginner',
        'items' => [['title' => 'Wings', 'text' => 'Rice has no wings.', 'part' => 'wing']],
    ])->assertSessionHasErrors('items.0.part');
});
