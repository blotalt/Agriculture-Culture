<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\MarketPrice;
use App\Models\Post;
use App\Models\Variety;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    public const TYPES = ['all', 'varieties', 'news', 'prices', 'lessons'];

    // Renders the search page, or returns the same results as JSON for the page's AJAX requests.
    public function index(Request $request)
    {
        $q = trim((string) $request->q);
        $type = in_array($request->type, self::TYPES, true) ? $request->type : 'all';

        $results = ['q' => $q, 'type' => $type] + $this->results($q, $type);

        if ($request->wantsJson()) {
            return response()->json($results);
        }

        return view('search', $results);
    }

    private function results(string $q, string $type): array
    {
        $varieties = collect();
        $posts = collect();
        $prices = collect();
        $lessons = collect();

        if ($q !== '') {
            if (in_array($type, ['all', 'lessons'], true)) {
                $lessons = $this->matchingLessons($q)->with('topic:id,slug,title')->limit(30)->get();
            }

            if (in_array($type, ['all', 'varieties'], true)) {
                $varieties = $this->matching(Variety::query(), ['name', 'khmer_name', 'location', 'type', 'description'], $q)
                    ->limit(30)->get();
            }

            if (in_array($type, ['all', 'news'], true)) {
                $posts = $this->matching(Post::query(), ['title', 'body'], $q)->latest()->limit(30)->get();
            }

            if (in_array($type, ['all', 'prices'], true)) {
                $prices = $this->matching(MarketPrice::query(), ['rice_variety', 'rice_type', 'province', 'market'], $q)
                    ->orderBy('province')->limit(30)->get();
            }
        }

        return [
            'varieties' => $varieties->map(fn ($rice) => [
                'id' => $rice->id,
                'name' => $rice->name,
                'khmer_name' => $rice->khmer_name,
                'type' => $rice->type,
                'location' => $rice->location,
            ])->all(),
            'posts' => $posts->map(fn ($post) => [
                'id' => $post->id,
                'title' => $post->title,
                'body' => $post->body,
            ])->all(),
            'prices' => $prices->map(fn ($price) => [
                'id' => $price->id,
                'rice_variety' => $price->rice_variety,
                'province' => $price->province,
                'market' => $price->market,
                'price_per_kg' => (float) $price->price_per_kg,
                'change_percent' => (float) $price->change_percent,
            ])->all(),
            'lessons' => $lessons->map(fn (Lesson $lesson) => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'topic' => $lesson->topic->title,
                'url' => "/learn/{$lesson->topic->slug}/{$lesson->slug}",
                // Card and timeline lessons keep most of their text in items.
                'body' => trim(implode(' ', array_filter([
                    $lesson->summary,
                    $lesson->body,
                    ...array_column($lesson->items ?? [], 'text'),
                    ...array_column($lesson->items ?? [], 'details'),
                ]))),
            ])->all(),
        ];
    }

    // Lessons match on their text and on the text inside their fact cards or timeline stages.
    private function matchingLessons(string $q): Builder
    {
        return $this->matching(
            Lesson::query()->published(),
            ['title', 'summary', 'body', DB::raw('CAST(items AS CHAR)')],
            $q,
        );
    }

    public function suggest(Request $request)
    {
        $q = trim((string) $request->q);

        if ($q === '') {
            return response()->json([]);
        }

        $varieties = $this->matching(Variety::query(), ['name', 'khmer_name', 'type', 'location'], $q)
            ->limit(4)
            ->get(['name', 'type'])
            ->map(fn ($v) => ['label' => $v->name, 'meta' => $v->type, 'kind' => 'variety']);

        $posts = $this->matching(Post::query(), ['title'], $q)
            ->limit(3)
            ->get(['title'])
            ->map(fn ($p) => ['label' => $p->title, 'meta' => 'News', 'kind' => 'news']);

        $places = $this->matching(MarketPrice::query(), ['province', 'market'], $q)
            ->limit(3)
            ->get(['market', 'province'])
            ->map(fn ($m) => ['label' => $m->market, 'meta' => $m->province, 'kind' => 'price']);

        $lessons = $this->matchingLessons($q)
            ->limit(2)
            ->get(['title'])
            ->map(fn ($l) => ['label' => $l->title, 'meta' => 'Lesson', 'kind' => 'lesson']);

        return response()->json($varieties->concat($lessons)->concat($posts)->concat($places)->values());
    }

    // Every word must appear in at least one of the columns, so "jasmine takeo" finds Sen Kra Ob.
    // Columns may be names or DB::raw() expressions.
    private function matching(Builder $query, array $columns, string $q): Builder
    {
        $words = array_slice(preg_split('/\s+/', $q, -1, PREG_SPLIT_NO_EMPTY), 0, 5);

        foreach ($words as $word) {
            $like = '%'.addcslashes($word, '%_\\').'%';
            $query->where(function (Builder $inner) use ($columns, $like) {
                foreach ($columns as $column) {
                    $inner->orWhere($column, 'like', $like);
                }
            });
        }

        return $query;
    }
}
