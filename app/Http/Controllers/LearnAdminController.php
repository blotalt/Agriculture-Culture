<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class LearnAdminController extends Controller
{
    public const LEVELS = ['beginner', 'intermediate', 'advanced'];

    // Which item fields each layout keeps.
    private const ITEM_FIELDS = [
        'cards' => ['icon', 'title', 'text', 'details', 'part'],
        'timeline' => ['phase', 'days', 'title', 'text'],
    ];

    public function index()
    {
        $topics = Topic::with(['lessons' => fn ($query) => $query->withCount('sources')])
            ->orderBy('position')
            ->get()
            ->map(fn (Topic $topic) => [
                'id' => $topic->id,
                'slug' => $topic->slug,
                'title' => $topic->title,
                'description' => $topic->description,
                'icon' => $topic->icon,
                'position' => $topic->position,
                'lessons' => $topic->lessons->map(fn (Lesson $lesson) => [
                    'id' => $lesson->id,
                    'slug' => $lesson->slug,
                    'title' => $lesson->title,
                    'layout' => $lesson->layout,
                    'level' => $lesson->level,
                    'published' => $lesson->published,
                    'sources_count' => $lesson->sources_count,
                ])->all(),
            ])
            ->all();

        return view('admin.learn.index', ['topics' => $topics]);
    }

    /*
    |--------------------------------------------------------------------------
    | Lessons
    |--------------------------------------------------------------------------
    */

    public function create(Request $request)
    {
        $lesson = new Lesson([
            'topic_id' => $request->integer('topic') ?: Topic::orderBy('position')->value('id'),
            'layout' => 'article',
            'level' => 'beginner',
            'published' => true,
        ]);

        return $this->form($lesson);
    }

    public function store(Request $request)
    {
        $lesson = new Lesson;
        $this->save($request, $lesson);

        return redirect()->route('admin.learn.index')->with('success', 'Lesson created.');
    }

    public function edit(Lesson $lesson)
    {
        return $this->form($lesson->load('sources'));
    }

    public function update(Request $request, Lesson $lesson)
    {
        $this->save($request, $lesson);

        return redirect()->route('admin.learn.index')->with('success', 'Lesson saved.');
    }

    public function destroy(Lesson $lesson)
    {
        $lesson->delete();

        return redirect()->route('admin.learn.index')->with('success', 'Lesson deleted.');
    }

    private function form(Lesson $lesson)
    {
        $data = [
            'id' => $lesson->id,
            'topic_id' => $lesson->topic_id,
            'title' => $lesson->title ?? '',
            'slug' => $lesson->slug ?? '',
            'summary' => $lesson->summary ?? '',
            'body' => $lesson->body ?? '',
            'layout' => $lesson->layout,
            'level' => $lesson->level,
            'position' => $lesson->position,
            'published' => (bool) $lesson->published,
            'items' => $lesson->items ?? [],
            'quiz' => array_map(fn ($question) => $this->quizRow($question), $lesson->quiz ?? []),
            'sources' => $lesson->exists
                ? $lesson->sources->map->only(['title', 'publisher', 'url'])->all()
                : [],
        ];

        // After a failed save, show what the admin typed rather than the stored lesson.
        $old = session()->getOldInput();
        if ($old) {
            $data = array_merge($data, array_intersect_key($old, $data), [
                'published' => (bool) ($old['published'] ?? false),
                'items' => array_values($old['items'] ?? []),
                'quiz' => array_values($old['quiz'] ?? []),
                'sources' => array_values($old['sources'] ?? []),
            ]);
        }

        return view('admin.learn.lesson-form', [
            'lesson' => $data,
            'topics' => Topic::orderBy('position')->get(['id', 'title'])->all(),
            'levels' => self::LEVELS,
            'layouts' => Lesson::LAYOUTS,
        ]);
    }

    private function save(Request $request, Lesson $lesson): void
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'title' => 'required|string|max:255',
            'slug' => [
                'nullable', 'alpha_dash', 'max:255',
                Rule::unique('lessons')->where('topic_id', $request->input('topic_id'))->ignore($lesson->id),
            ],
            'summary' => 'nullable|string|max:500',
            'body' => 'nullable|string|max:20000',
            'layout' => ['required', Rule::in(Lesson::LAYOUTS)],
            'level' => ['required', Rule::in(self::LEVELS)],
            'position' => 'nullable|integer|min:0|max:1000',
            'items' => 'nullable|array|max:50',
            'items.*.icon' => 'nullable|string|max:16',
            'items.*.phase' => 'nullable|string|max:100',
            'items.*.days' => 'nullable|string|max:100',
            'items.*.title' => 'required|string|max:255',
            'items.*.text' => 'required|string|max:2000',
            'items.*.details' => 'nullable|string|max:2000',
            'items.*.part' => ['nullable', Rule::in(Lesson::DIAGRAM_PARTS)],
            'quiz' => 'nullable|array|max:30',
            'quiz.*.question' => 'required|string|max:300',
            'quiz.*.choice1' => 'required|string|max:200',
            'quiz.*.choice2' => 'required|string|max:200',
            'quiz.*.choice3' => 'nullable|string|max:200',
            'quiz.*.choice4' => 'nullable|string|max:200',
            'quiz.*.answer' => 'required|integer|between:1,4',
            'quiz.*.explain' => 'nullable|string|max:1000',
            // Every published lesson must say where its facts come from.
            'sources' => 'required_if_accepted:published|array|max:50',
            'sources.*.title' => 'required|string|max:255',
            'sources.*.publisher' => 'nullable|string|max:255',
            'sources.*.url' => 'required|url:http,https|max:2048',
        ], [
            'sources.required_if_accepted' => 'A published lesson needs at least one source.',
        ]);

        $fields = self::ITEM_FIELDS[$validated['layout']] ?? null;
        $items = $fields
            ? array_map(fn ($item) => array_intersect_key($item, array_flip($fields)), array_values($validated['items'] ?? []))
            : null;
        $sources = array_values($validated['sources'] ?? []);
        $quiz = $this->quizFromRows(array_values($validated['quiz'] ?? []));

        $this->checkCitations($validated['body'] ?? '', $items ?? [], count($sources));

        DB::transaction(function () use ($request, $lesson, $validated, $items, $quiz, $sources) {
            $lesson->fill([
                'topic_id' => $validated['topic_id'],
                'title' => $validated['title'],
                'slug' => ($validated['slug'] ?? null) ?: $this->uniqueSlug($validated['title'], $validated['topic_id'], $lesson->id),
                'summary' => $validated['summary'] ?? null,
                'body' => $validated['body'] ?? null,
                'layout' => $validated['layout'],
                'items' => $items,
                'quiz' => $quiz ?: null,
                'level' => $validated['level'],
                // New lessons go to the end of their topic unless a position is given.
                'position' => $validated['position']
                    ?? ($lesson->exists ? $lesson->position : (int) Lesson::where('topic_id', $validated['topic_id'])->max('position') + 1),
                'published' => $request->boolean('published'),
            ])->save();

            $lesson->sources()->delete();
            foreach ($sources as $index => $source) {
                $lesson->sources()->create($source + ['position' => $index + 1]);
            }
        });
    }

    // The form edits each quiz question as one row with four choice boxes and the number of the right one.
    private function quizRow(array $question): array
    {
        $row = ['question' => $question['question'], 'answer' => (string) ($question['answer'] + 1), 'explain' => $question['explain'] ?? ''];
        foreach (range(1, 4) as $n) {
            $row["choice{$n}"] = $question['choices'][$n - 1] ?? '';
        }

        return $row;
    }

    // Back from form rows to stored questions: empty choice boxes are dropped and the answer
    // becomes the index of the right choice among the ones left.
    private function quizFromRows(array $rows): array
    {
        return array_map(function (array $row, int $index) {
            $choices = [];
            $answer = null;
            foreach (range(1, 4) as $n) {
                $choice = trim($row["choice{$n}"] ?? '');
                if ($choice === '') {
                    continue;
                }
                if ($n === (int) $row['answer']) {
                    $answer = count($choices);
                }
                $choices[] = $choice;
            }

            if ($answer === null) {
                throw ValidationException::withMessages([
                    "quiz.{$index}.answer" => 'Question '.($index + 1).': the right answer points at an empty choice.',
                ]);
            }

            return [
                'question' => $row['question'],
                'choices' => $choices,
                'answer' => $answer,
                'explain' => ($row['explain'] ?? null) ?: null,
            ];
        }, $rows, array_keys($rows));
    }

    // A [n] citation must point at one of the lesson's sources.
    private function checkCitations(string $body, array $items, int $sourceCount): void
    {
        $texts = array_merge([$body], array_column($items, 'text'), array_column($items, 'details'));
        preg_match_all('/\[(\d+)\]/', implode(' ', $texts), $matches);
        $highest = $matches[1] ? max(array_map('intval', $matches[1])) : 0;

        if ($highest > $sourceCount) {
            throw ValidationException::withMessages([
                'sources' => "The lesson cites [{$highest}] but only has {$sourceCount} source(s).",
            ]);
        }
    }

    private function uniqueSlug(string $title, int $topicId, ?int $ignoreId): string
    {
        $base = Str::slug($title) ?: 'lesson';
        $slug = $base;

        for ($n = 2; Lesson::where('topic_id', $topicId)->where('slug', $slug)->where('id', '!=', $ignoreId ?? 0)->exists(); $n++) {
            $slug = "{$base}-{$n}";
        }

        return $slug;
    }

    /*
    |--------------------------------------------------------------------------
    | Topics
    |--------------------------------------------------------------------------
    */

    public function storeTopic(Request $request)
    {
        $validated = $this->validatedTopic($request);
        Topic::create(array_merge($validated, [
            'slug' => ($validated['slug'] ?? null) ?: $this->uniqueTopicSlug($validated['title']),
            'position' => $validated['position'] ?? (Topic::max('position') + 1),
        ]));

        return redirect()->route('admin.learn.index')->with('success', 'Topic created.');
    }

    public function updateTopic(Request $request, Topic $topic)
    {
        $validated = $this->validatedTopic($request, $topic);
        $topic->update(array_merge($validated, [
            'slug' => ($validated['slug'] ?? null) ?: $topic->slug,
            'position' => $validated['position'] ?? $topic->position,
        ]));

        return redirect()->route('admin.learn.index')->with('success', 'Topic saved.');
    }

    public function destroyTopic(Topic $topic)
    {
        if ($topic->lessons()->exists()) {
            return redirect()->route('admin.learn.index')
                ->withErrors(['topic' => 'Move or delete this topic\'s lessons before deleting it.']);
        }

        $topic->delete();

        return redirect()->route('admin.learn.index')->with('success', 'Topic deleted.');
    }

    private function validatedTopic(Request $request, ?Topic $topic = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'slug' => ['nullable', 'alpha_dash', 'max:255', Rule::unique('topics')->ignore($topic?->id)],
            'description' => 'nullable|string|max:500',
            'icon' => 'nullable|string|max:16',
            'position' => 'nullable|integer|min:0|max:1000',
        ]);
    }

    private function uniqueTopicSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'topic';
        $slug = $base;

        for ($n = 2; Topic::where('slug', $slug)->exists(); $n++) {
            $slug = "{$base}-{$n}";
        }

        return $slug;
    }
}
