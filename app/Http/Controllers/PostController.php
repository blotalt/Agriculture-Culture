<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Post;
use App\Services\ImageOptimizer;

class PostController extends Controller
{
    public function createPost(Request $request)
    {
        $incomingFields = $request->validate([
            'title' => 'required',
            'body' => 'required',
            'image' => 'nullable|image|max:2048',
        ]);

        $incomingFields['title'] = strip_tags($incomingFields['title']);
        $incomingFields['body'] = strip_tags($incomingFields['body']);
        $incomingFields['user_id'] = auth()->id();

        $incomingFields['isTrending'] = $request->has('isTrending');


    if ($request->hasFile('image')) {
        $incomingFields['image'] = app(ImageOptimizer::class)->store($request->file('image'), 'posts');
    }

        Post::create($incomingFields);

        return redirect('/dashboard');
    }
        public function news()
            {
                $posts = Post::with('user')->withCount('comments')->orderByDesc('isTrending')->latest()->paginate(9);
                return view('news', ['posts' => $posts]);
            }

    public function showEditScreen(Post $post)
    {
        if (! auth()->user()->canManage($post)) {
            return redirect('/');
        }

        return view('edit-post', ['post' => $post]);
    }

    public function updatePost(Post $post, Request $request)
    {
        if (! auth()->user()->canManage($post)) {
            return redirect('/dashboard');
        }

        $incomingFields = $request->validate([
            'title' => 'required',
            'body' => 'required',
             'image' => 'nullable|image|max:2048',
        ]);

        $incomingFields['title'] = strip_tags($incomingFields['title']);
        $incomingFields['body'] = strip_tags($incomingFields['body']);

         $incomingFields['isTrending'] = $request->has('isTrending');
         if ($request->hasFile('image')) {
        if ($post->image) { Storage::disk('public')->delete($post->image); }
        $incomingFields['image'] = app(ImageOptimizer::class)->store($request->file('image'), 'posts');
    }

        $post->update($incomingFields);

        return redirect('/dashboard');
    }

    public function deletePost(Post $post)
    {
        if (auth()->user()->canManage($post)) {
            if ($post->image) { Storage::disk('public')->delete($post->image); }
            $post->delete();
        }

        return redirect('/dashboard');
    }
}