@extends('layout')

@section('content')
    <div id="react-app" data-page="learn" data-learn="{{ json_encode($learn) }}"></div>
@endsection
