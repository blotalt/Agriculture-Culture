@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="dashboard"
        data-csrf="{{ csrf_token() }}"
        data-stats="{{ json_encode($stats) }}"
        data-site="{{ json_encode($site) }}"
        data-popular="{{ json_encode($popular) }}"
        data-posts="{{ json_encode($posts->map(function ($post) { return [
            "id" => $post->id,
            "title" => $post->title,
            "body" => $post->body,
            "image" => $post->image,
            "isTrending" => (bool) $post->isTrending,
            "views" => (int) $post->views,
            "comments" => (int) $post->comments_count,
            "rating" => $post->ratings_avg_rating ? round($post->ratings_avg_rating, 1) : null,
            "ratings" => (int) $post->ratings_count,
            "user" => ["name" => $post->user?->name ?? "Unknown user"],
        ]; })->all()) }}">
    </div>
@endsection
