@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="market-price-edit"
        data-csrf="{{ csrf_token() }}"
        data-market-price='@json([
            "id" => $marketPrice->id,
            "rice_variety" => $marketPrice->rice_variety,
            "rice_type" => $marketPrice->rice_type,
            "province" => $marketPrice->province,
            "market" => $marketPrice->market,
            "price_per_kg" => (float) $marketPrice->price_per_kg,
            "change_percent" => (float) $marketPrice->change_percent,
        ])'>
    </div>
@endsection