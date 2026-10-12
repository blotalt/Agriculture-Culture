@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="market-prices-admin"
        data-csrf="{{ csrf_token() }}"
        data-prices='{{ json_encode($prices->map(function ($price) { return [
            "id" => $price->id,
            "rice_variety" => $price->rice_variety,
            "rice_type" => $price->rice_type,
            "province" => $price->province,
            "market" => $price->market,
            "price_per_kg" => (float) $price->price_per_kg,
            "change_percent" => (float) $price->change_percent,
        ]; })->all()) }}'>
    </div>
@endsection