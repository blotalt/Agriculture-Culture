@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="market-price-create"
        data-csrf="{{ csrf_token() }}">
    </div>
@endsection