@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="dashboard"
        data-csrf="{{ csrf_token() }}"
        data-posts='@json($posts->map(function ($post) { return [
            "id" => $post->id,
            "title" => $post->title,
            "body" => $post->body,
            "image" => $post->image,
            "isTrending" => (bool) $post->isTrending,
            "user" => ["name" => $post->user?->name ?? "Unknown user"],
        ]; })->all())'>
    </div>
@endsection