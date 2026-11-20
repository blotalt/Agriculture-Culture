@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="admin-reports"
        data-csrf="{{ csrf_token() }}"
        data-reports="{{ json_encode($reports) }}">
    </div>
@endsection
