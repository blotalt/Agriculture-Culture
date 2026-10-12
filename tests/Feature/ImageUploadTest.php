<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(fn () => Storage::fake('public'));

test('large uploaded images are resized and saved as WebP', function () {
    if (! function_exists('imagewebp')) {
        $this->markTestSkipped('GD with WebP support is not installed.');
    }

    $this->actingAs(User::factory()->create())->post('/create-post', [
        'title' => 'Harvest photo',
        'body' => 'Fields in Takeo.',
        'image' => UploadedFile::fake()->image('field.jpg', 3000, 2000),
    ])->assertRedirect('/dashboard');

    $path = Post::first()->image;
    expect($path)->toEndWith('.webp');

    [$width, $height] = getimagesizefromstring(Storage::disk('public')->get($path));
    expect($width)->toBe(1600)->and($height)->toBe(1067);
});

test('extremely large images are stored as uploaded instead of being decoded', function () {
    $optimizer = new App\Services\ImageOptimizer;

    // Only the PNG header: it claims 6000 x 5000 (30 megapixels), which is all the size check reads.
    $ihdr = 'IHDR'.pack('NN', 6000, 5000)."\x08\x02\x00\x00\x00";
    $png = "\x89PNG\r\n\x1a\n".pack('N', 13).$ihdr.pack('N', crc32($ihdr)).pack('N', 0).'IEND'.pack('N', crc32('IEND'));
    $file = UploadedFile::fake()->createWithContent('huge.png', $png);

    $path = $optimizer->store($file, 'posts');

    expect($path)->toEndWith('.png');
    Storage::disk('public')->assertExists($path);
});

test('replacing a post image deletes the old file', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->post('/create-post', [
        'title' => 'Photo', 'body' => 'Body', 'image' => UploadedFile::fake()->image('a.jpg', 400, 300),
    ]);
    $post = Post::first();
    $old = $post->image;

    $this->actingAs($user)->put("/edit-post/{$post->id}", [
        'title' => 'Photo', 'body' => 'Body', 'image' => UploadedFile::fake()->image('b.jpg', 400, 300),
    ]);

    Storage::disk('public')->assertMissing($old);
    Storage::disk('public')->assertExists($post->fresh()->image);
});
