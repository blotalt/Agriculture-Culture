@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="pricemarket"
        data-prices="{{ json_encode($prices) }}"
        data-insights="{{ json_encode($insights) }}"
        data-weather="{{ json_encode($weather) }}"
        data-province="{{ request('province') }}">
    </div>
@endsection
