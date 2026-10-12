<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Rating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function store(Request $request, $id)
{
    $request->validate([
        'rating' => 'required|integer|min:1|max:5'
    ]);

    Rating::updateOrCreate(
        [
            'post_id' => Post::findOrFail($id)->id,
            'user_id' => auth()->id()
        ],
        [
            'rating' => $request->rating
        ]
    );

    return back()->with('success', 'Rating saved');
}
}