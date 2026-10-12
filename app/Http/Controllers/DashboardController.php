<?php

namespace App\Http\Controllers;

use App\Models\MarketPrice;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use App\Models\Variety;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $posts = $user->usersCoolPosts()
            ->with('user')
            ->withCount(['comments', 'ratings'])
            ->withAvg('ratings', 'rating')
            ->orderByDesc('isTrending')
            ->latest()
            ->get();

        $rated = $posts->where('ratings_count', '>', 0);

        $stats = [
            'posts' => $posts->count(),
            'trending' => $posts->where('isTrending', true)->count(),
            'views' => (int) $posts->sum('views'),
            'comments' => (int) $posts->sum('comments_count'),
            // Average over every rating received, not an average of per-post averages.
            'avgRating' => $rated->sum('ratings_count')
                ? round($rated->sum(fn ($p) => $p->ratings_avg_rating * $p->ratings_count) / $rated->sum('ratings_count'), 1)
                : null,
            'topPost' => $posts->sortByDesc('views')->first()?->only(['id', 'title', 'views']),
        ];

        $site = $user->is_admin ? [
            'users' => User::count(),
            'posts' => Post::count(),
            'varieties' => Variety::count(),
            'prices' => MarketPrice::count(),
            'openReports' => Report::where('status', 'open')->count(),
        ] : null;

        $popular = Post::with('user')
            ->withAvg('ratings', 'rating')
            ->orderByDesc('views')
            ->limit(5)
            ->get()
            ->map(fn (Post $post) => [
                'id' => $post->id,
                'title' => $post->title,
                'views' => $post->views,
                'rating' => $post->ratings_avg_rating ? round($post->ratings_avg_rating, 1) : null,
                'author' => $post->user?->name ?? 'Unknown user',
            ]);

        return view('dashboard', compact('posts', 'stats', 'site', 'popular'));
    }
}
