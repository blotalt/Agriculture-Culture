<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Rating;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function show(Request $request, $id)
    {
        $post = Post::with(['user', 'comments.user'])->findOrFail($id);

        // Count each visitor once per session, so refreshing doesn't inflate views.
        $seen = $request->session()->get('viewed_posts', []);
        if (! in_array($post->id, $seen, true)) {
            $post->increment('views');
            $request->session()->push('viewed_posts', $post->id);
        }

        // CURRENT USER RATING (for the star fill)
        $post->userRating = auth()->check()
            ? Rating::where('post_id', $post->id)->where('user_id', auth()->id())->value('rating')
            : 0;

        // AVERAGE RATING (for display)
        $post->avgRating = Rating::where('post_id', $post->id)->avg('rating');

        return view('news.show', compact('post'));
    }
}
