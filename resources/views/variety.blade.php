@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="variety"
        data-total-count="{{ $totalCount }}"
        data-high-demand-count="{{ $highDemandCount }}"
        data-filters="{{ json_encode([
            'type' => request('type'),
            'sort' => request('sort'),
            'search' => request('search'),
        ], JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) }}"
        data-pagination="{{ json_encode(['current' => $varieties->currentPage(), 'last' => $varieties->lastPage()]) }}"
        data-varieties="{{ json_encode($varieties->items(), JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) }}">
    </div>
@endsection