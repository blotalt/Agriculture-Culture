@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="search"
        data-q="{{ $q ?? '' }}"
        data-type="{{ $type }}"
        data-search-varieties="{{ json_encode($varieties) }}"
        data-search-posts="{{ json_encode($posts) }}"
        data-search-prices="{{ json_encode($prices) }}"
        data-search-lessons="{{ json_encode($lessons) }}">
    </div>
@endsection
