@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="news-detail"
        data-csrf="{{ csrf_token() }}"
        data-user-id="{{ auth()->id() ?? 0 }}"
        data-post='@json([
            "id" => $post->id,
            "title" => $post->title,
            "body" => $post->body,
            "image" => $post->image,
            "created_at" => $post->created_at->format('M d, Y'),
            "avgRating" => (float) ($post->avgRating ?? 0),
            "userRating" => (float) ($post->userRating ?? 0),
            "user" => ["name" => $post->user?->name ?? "Unknown user"],
            "comments" => $post->comments->map(function ($comment) { return [
                "id" => $comment->id,
                "body" => $comment->body,
                "user_id" => $comment->user_id,
                "created_at" => $comment->created_at->diffForHumans(),
                "user" => ["name" => $comment->user?->name ?? "User"],
            ]; })->values()->all(),
        ])'>
    </div>
@endsection