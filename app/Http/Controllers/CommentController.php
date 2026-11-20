<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, $id)
{
    $request->validate([
        'body' => 'required|string|max:1000'
    ]);

    Comment::create([
        'post_id' => Post::findOrFail($id)->id,
        'user_id' => auth()->id(),
        'body' => $request->body
    ]);

    return back();
}
    public function destroy(Comment $comment)
{
    if (! auth()->user()->canManage($comment)) {
        return back();
    }

    $comment->delete();

    return back();
}

public function update(Request $request, Comment $comment)
{
    if (! auth()->user()->canManage($comment)) {
        return back();
    }

    $request->validate([
        'body' => 'required'
    ]);

    $comment->update([
        'body' => trim($request->body)
    ]);

    return back();
}
}