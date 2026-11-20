@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="calendar"
        data-varieties="{{ json_encode($varieties) }}"
        data-province="{{ $province }}"
        data-provinces="{{ json_encode($provinces) }}"
        data-forecast="{{ json_encode($forecast) }}">
    </div>
@endsection
