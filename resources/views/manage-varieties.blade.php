@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="manage-varieties"
        data-csrf="{{ csrf_token() }}"
        data-my-varieties='{{ json_encode($myVarieties->map(function ($item) { return [
            "id" => $item->id,
            "name" => $item->name,
            "khmer_name" => $item->khmer_name,
            "type" => $item->type,
            "location" => $item->location,
            "description" => $item->description,
            "yield" => $item->yield,
            "cycle" => $item->cycle,
            "season" => $item->season,
            "demand" => $item->demand,
            "image" => $item->image,
        ]; })->all()) }}'>
    </div>
@endsection