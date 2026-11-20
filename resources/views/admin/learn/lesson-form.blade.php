@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="learn-lesson-form"
        data-csrf="{{ csrf_token() }}"
        data-lesson="{{ json_encode($lesson) }}"
        data-topics="{{ json_encode($topics) }}"
        data-levels="{{ json_encode($levels) }}"
        data-layouts="{{ json_encode($layouts) }}">
    </div>
@endsection
