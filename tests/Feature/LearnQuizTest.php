<?php

use App\Models\Lesson;
use App\Models\Topic;

function learnTopic(): Topic
{
    return Topic::create(['slug' => 'rice-in-cambodia', 'title' => 'Rice in Cambodia']);
}

function quizQuestion(string $question): array
{
    return ['question' => $question, 'choices' => ['Rice', 'Fish'], 'answer' => 0, 'explain' => null];
}

test('the learn hub leads with fun facts and a quiz from published lessons', function () {
    $topic = learnTopic();
    Lesson::create([
        'topic_id' => $topic->id,
        'slug' => 'fun-facts',
        'title' => 'Fun Facts',
        'layout' => 'cards',
        'items' => [['icon' => '🍚', 'title' => 'Eat rice', 'text' => 'Eating means eating rice.[1]', 'details' => 'More.']],
        'quiz' => [quizQuestion('What do you eat?')],
    ]);
    Lesson::create([
        'topic_id' => $topic->id,
        'slug' => 'draft',
        'title' => 'Draft',
        'published' => false,
        'quiz' => [quizQuestion('Not ready yet?')],
    ]);

    $learn = $this->get('/learn')->assertOk()->viewData('learn');

    expect($learn['facts'])->toBe([[
        'icon' => '🍚',
        'title' => 'Eat rice',
        'text' => 'Eating means eating rice.[1]',
        'lesson' => ['title' => 'Fun Facts', 'href' => '/learn/rice-in-cambodia/fun-facts'],
    ]])
        ->and(array_column($learn['quiz'], 'question'))->toBe(['What do you eat?'])
        ->and($learn['quiz'][0]['lesson']['href'])->toBe('/learn/rice-in-cambodia/fun-facts');
});

test('a lesson page brings its own quiz for the last page of the book', function () {
    $topic = learnTopic();
    Lesson::create(['topic_id' => $topic->id, 'slug' => 'fun-facts', 'title' => 'Fun Facts', 'quiz' => [quizQuestion('What do you eat?')]]);

    $learn = $this->get('/learn/rice-in-cambodia/fun-facts')->assertOk()->viewData('learn');

    expect(array_column($learn['lesson']['quiz'], 'question'))->toBe(['What do you eat?']);
});

test('admins write quiz questions as choice boxes and a right answer', function () {
    $topic = learnTopic();

    $this->actingAs(admin())->post('/admin/learn/lessons', [
        'topic_id' => $topic->id,
        'title' => 'Rice Souls',
        'layout' => 'article',
        'level' => 'beginner',
        'published' => '1',
        'quiz' => [[
            'question' => 'How many souls does a rice plant have?',
            'choice1' => 'Seven',
            'choice2' => 'One',
            'choice3' => '',
            'choice4' => 'Nineteen',
            'answer' => '4',
            'explain' => 'Nineteen, like a person.',
        ]],
        'sources' => [['title' => 'Calling the Souls', 'url' => 'https://example.com/souls']],
    ])->assertRedirect('/admin/learn')->assertSessionHasNoErrors();

    // The empty box is dropped, so "Nineteen" is now the third choice.
    $lesson = Lesson::firstWhere('slug', 'rice-souls');
    expect($lesson->quiz)->toBe([[
        'question' => 'How many souls does a rice plant have?',
        'choices' => ['Seven', 'One', 'Nineteen'],
        'answer' => 2,
        'explain' => 'Nineteen, like a person.',
    ]]);

    // And the edit form shows it as boxes again.
    $form = $this->get("/admin/learn/lessons/{$lesson->id}/edit")->assertOk()->viewData('lesson');
    expect($form['quiz'][0])->toMatchArray(['choice1' => 'Seven', 'choice2' => 'One', 'choice3' => 'Nineteen', 'choice4' => '', 'answer' => '3']);
});

test('a quiz answer must point at a filled-in choice', function () {
    $topic = learnTopic();

    $this->actingAs(admin())->post('/admin/learn/lessons', [
        'topic_id' => $topic->id,
        'title' => 'Rice Souls',
        'layout' => 'article',
        'level' => 'beginner',
        'quiz' => [['question' => 'How many?', 'choice1' => 'Seven', 'choice2' => 'Nineteen', 'answer' => '4']],
    ])->assertSessionHasErrors('quiz.0.answer');

    expect(Lesson::count())->toBe(0);
});
