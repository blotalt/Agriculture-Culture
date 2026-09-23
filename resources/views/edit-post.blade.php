@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="edit-post"
        data-post='@json([
            "id" => $post->id,
            "title" => $post->title,
            "body" => $post->body,
            "image" => $post->image,
            "isTrending" => (bool) $post->isTrending,
        ])'
        data-csrf="{{ csrf_token() }}">
    </div>
@endsection