@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="learn-admin"
        data-csrf="{{ csrf_token() }}"
        data-topics="{{ json_encode($topics) }}">
    </div>
@endsection
