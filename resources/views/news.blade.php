@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="news"
        data-pagination="{{ json_encode([
            'current' => $posts->currentPage(),
            'last' => $posts->lastPage(),
            'total' => $posts->total(),
        ]) }}"
        data-posts="{{ json_encode(
            collect($posts->items())->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'body' => $post->body,
                    'image' => $post->image,
                    'isTrending' => (bool) $post->isTrending,
                    'views' => (int) $post->views,
                    'comments' => (int) $post->comments_count,
                    'user' => ['name' => $post->user?->name ?? 'Unknown user'],
                    'date' => $post->created_at?->format('M d, Y') ?? '',
                ];
            })->all(),
            JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
        ) }}">
    </div>
@endsection
