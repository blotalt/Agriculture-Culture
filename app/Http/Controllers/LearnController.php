<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Topic;

class LearnController extends Controller
{
    // The lesson whose fact cards the hub shows one at a time under "Did you know?".
    private const FUN_FACTS = 'fun-facts';

    // The Learn hub: a fun fact and a quick quiz up front, then every topic with its published lessons.
    public function index()
    {
        $topics = Topic::with(['lessons' => fn ($query) => $query->published()])
            ->orderBy('position')
            ->get();

        $facts = [];
        $quiz = [];
        foreach ($topics as $topic) {
            foreach ($topic->lessons as $lesson) {
                $link = ['title' => $lesson->title, 'href' => "/learn/{$topic->slug}/{$lesson->slug}"];

                if ($lesson->slug === self::FUN_FACTS && $lesson->layout === 'cards') {
                    foreach ($lesson->items ?? [] as $item) {
                        $facts[] = [
                            'icon' => $item['icon'] ?? null,
                            'title' => $item['title'],
                            'text' => $item['text'],
                            'lesson' => $link,
                        ];
                    }
                }

                foreach ($lesson->quiz ?? [] as $question) {
                    $quiz[] = $question + ['lesson' => $link];
                }
            }
        }

        return $this->render([
            'view' => 'hub',
            'topics' => $topics->map(fn (Topic $topic) => $this->topicData($topic))->all(),
            'facts' => $facts,
            'quiz' => $quiz,
        ]);
    }

    public function topic(Topic $topic)
    {
        $topic->load(['lessons' => fn ($query) => $query->published()]);

        return $this->render([
            'view' => 'topic',
            'topic' => $this->topicData($topic),
        ]);
    }

    public function lesson(Topic $topic, Lesson $lesson)
    {
        abort_unless($lesson->published, 404);

        $lesson->load('sources');
        $siblings = $topic->lessons()->published()->get(['id', 'slug', 'title']);
        $index = $siblings->search(fn ($sibling) => $sibling->id === $lesson->id);
        $neighbour = fn ($sibling) => $sibling ? ['slug' => $sibling->slug, 'title' => $sibling->title] : null;

        return $this->render([
            'view' => 'lesson',
            'topic' => ['slug' => $topic->slug, 'title' => $topic->title, 'icon' => $topic->icon],
            'lesson' => [
                'id' => $lesson->id,
                'slug' => $lesson->slug,
                'title' => $lesson->title,
                'summary' => $lesson->summary,
                'body' => $lesson->body,
                'layout' => $lesson->layout,
                'items' => $lesson->items ?? [],
                'quiz' => $lesson->quiz ?? [],
                'level' => $lesson->level,
                'sources' => $lesson->sources->map(fn ($source) => [
                    'title' => $source->title,
                    'publisher' => $source->publisher,
                    'url' => $source->url,
                ])->all(),
            ],
            'previous' => $neighbour($siblings->get($index - 1)),
            'next' => $neighbour($siblings->get($index + 1)),
        ]);
    }

    private function topicData(Topic $topic): array
    {
        return [
            'slug' => $topic->slug,
            'title' => $topic->title,
            'description' => $topic->description,
            'icon' => $topic->icon,
            'lessons' => $topic->lessons->map(fn (Lesson $lesson) => [
                'slug' => $lesson->slug,
                'title' => $lesson->title,
                'summary' => $lesson->summary,
                'level' => $lesson->level,
            ])->values()->all(),
        ];
    }

    private function render(array $data)
    {
        return view('learn', ['learn' => $data]);
    }
}
