@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="edit-variety"
        data-csrf="{{ csrf_token() }}"
        data-variety='{{ json_encode([
            "id" => $variety->id,
            "name" => $variety->name,
            "khmer_name" => $variety->khmer_name,
            "type" => $variety->type,
            "location" => $variety->location,
            "description" => $variety->description,
            "yield" => $variety->yield,
            "cycle" => $variety->cycle,
            "harvest" => $variety->harvest,
            "season" => $variety->season,
            "demand" => $variety->demand,
            "sources" => $variety->sources ?? [],
        ]) }}'>
    </div>
@endsection