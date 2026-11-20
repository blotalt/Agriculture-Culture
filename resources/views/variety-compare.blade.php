@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="variety-compare"
        data-selected="{{ json_encode($selected) }}"
        data-all="{{ json_encode($all) }}">
    </div>
@endsection
