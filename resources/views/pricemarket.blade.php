@extends('layout')

@section('content')
    <div id="react-app" data-page="pricemarket" data-prices='@json($prices)'></div>
@endsection