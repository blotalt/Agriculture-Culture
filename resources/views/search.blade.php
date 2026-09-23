@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="search"
        data-q="{{ $q ?? '' }}"
        data-search-varieties='@json($varieties->map(function ($rice) { return [
            "id" => $rice->id,
            "name" => $rice->name,
            "type" => $rice->type,
            "location" => $rice->location,
        ]; })->all())'
        data-search-posts='@json($posts->map(function ($post) { return [
            "id" => $post->id,
            "title" => $post->title,
            "body" => $post->body,
        ]; })->all())'>
    </div>
@endsection