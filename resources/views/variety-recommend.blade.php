@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="variety-recommend"
        data-results="{{ json_encode($results) }}"
        data-filters="{{ json_encode($filters) }}"
        data-provinces="{{ json_encode($provinces) }}">
    </div>
@endsection
