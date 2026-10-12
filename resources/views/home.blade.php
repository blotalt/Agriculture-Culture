@extends('layout')

@section('content')
<div id="react-app" data-page="welcome" data-prices="{{ json_encode($prices) }}"></div>
@endsection