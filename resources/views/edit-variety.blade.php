@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="edit-variety"
        data-csrf="{{ csrf_token() }}"
        data-variety='@json([
            "id" => $variety->id,
            "name" => $variety->name,
            "khmer_name" => $variety->khmer_name,
            "type" => $variety->type,
            "location" => $variety->location,
            "description" => $variety->description,
            "yield" => $variety->yield,
            "cycle" => $variety->cycle,
            "season" => $variety->season,
            "demand" => $variety->demand,
        ])'>
    </div>
@endsection