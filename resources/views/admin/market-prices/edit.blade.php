@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="market-price-edit"
        data-csrf="{{ csrf_token() }}"
        data-market-price='{{ json_encode([
            "id" => $marketPrice->id,
            "rice_variety" => $marketPrice->rice_variety,
            "rice_type" => $marketPrice->rice_type,
            "province" => $marketPrice->province,
            "market" => $marketPrice->market,
            "price_per_kg" => (float) $marketPrice->price_per_kg,
            "recorded_on" => $marketPrice->recorded_on?->toDateString(),
        ]) }}'>
    </div>
@endsection