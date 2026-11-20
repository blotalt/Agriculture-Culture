<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\VarietyController;
use App\Http\Controllers\MarketPriceController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PriceAlertController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\LearnController;
use App\Http\Controllers\LearnAdminController;
use App\Models\MarketPrice;

/*
|--------------------------------------------------------------------------
| Public Pages
|--------------------------------------------------------------------------
*/

// The home page side rails show a ticker of the most recent prices.
$home = function () {
    return view('home', ['prices' => MarketPrice::forTicker()]);
};

Route::get('/', $home)->name('home');

Route::get('/home', $home);

Route::get('/learn', [LearnController::class, 'index'])->name('learn');
Route::get('/learn/{topic:slug}', [LearnController::class, 'topic'])->name('learn.topic');
Route::get('/learn/{topic:slug}/{lesson:slug}', [LearnController::class, 'lesson'])->name('learn.lesson');

// The old Rice Facts page now lives in Learn.
Route::permanentRedirect('/facts', '/learn/rice-in-cambodia/fun-facts');

Route::get('/about', function () {
    return view('about');
});

Route::get('/pricemarket', [MarketPriceController::class, 'index'])->name('pricemarket');
Route::get('/pricemarket/data.csv', [MarketPriceController::class, 'downloadData'])->name('pricemarket.data');
Route::get('/pricemarket/source-file', [MarketPriceController::class, 'downloadSource'])->name('pricemarket.source');

Route::get('/signup', function () {
    return view('signup');
})->name('register');

Route::get('/login', function () {
    return view('login');
})->name('login');

Route::post('/register', [UserController::class, 'register'])->name('register.store');
Route::post('/login', [UserController::class, 'login'])->name('login.submit');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');

Route::get('/locale/{locale}', [LocaleController::class, 'switch'])->name('locale.switch');

Route::get('/news', [PostController::class, 'news'])->name('news');
Route::get('/news/{id}', [NewsController::class, 'show'])->name('news.show');

Route::get('/search', [SearchController::class, 'index']);
Route::get('/search/suggest', [SearchController::class, 'suggest']);

Route::get('/variety', [VarietyController::class, 'index']);
Route::get('/variety/suggest', [VarietyController::class, 'suggest']);
Route::get('/variety/compare', [VarietyController::class, 'compare'])->name('variety.compare');
Route::get('/variety/recommend', [VarietyController::class, 'recommend'])->name('variety.recommend');

Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar');

/*
|--------------------------------------------------------------------------
| Signed-in users
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Posts
    Route::post('/create-post', [PostController::class, 'createPost'])->name('posts.store');
    Route::get('/edit-post/{post}', [PostController::class, 'showEditScreen'])->name('posts.edit');
    Route::put('/edit-post/{post}', [PostController::class, 'updatePost'])->name('posts.update');
    Route::delete('/delete-post/{post}', [PostController::class, 'deletePost'])->name('posts.destroy');

    // Comments and ratings
    Route::post('/news/{id}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    Route::post('/news/{id}/rating', [RatingController::class, 'store'])->name('ratings.store');

    // Reporting posts and comments for moderation
    Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');

    // Varieties
    Route::get('/manage-varieties', [VarietyController::class, 'manageScreen']);
    Route::post('/create-variety', [VarietyController::class, 'createVariety']);
    Route::get('/edit-variety/{variety}', [VarietyController::class, 'showEditScreen']);
    Route::put('/edit-variety/{variety}', [VarietyController::class, 'updateVariety']);
    Route::delete('/delete-variety/{variety}', [VarietyController::class, 'deleteVariety']);

    // Price alerts
    Route::get('/alerts', [PriceAlertController::class, 'index'])->name('alerts.index');
    Route::post('/alerts', [PriceAlertController::class, 'store'])->name('alerts.store');
    Route::delete('/alerts/{alert}', [PriceAlertController::class, 'destroy'])->name('alerts.destroy');
});

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'can:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/market-prices', [MarketPriceController::class, 'adminIndex'])->name('market-prices.index');
    Route::get('/market-prices/create', [MarketPriceController::class, 'create'])->name('market-prices.create');
    Route::post('/market-prices', [MarketPriceController::class, 'store'])->name('market-prices.store');
    Route::get('/market-prices/{marketPrice}/edit', [MarketPriceController::class, 'edit'])->name('market-prices.edit');
    Route::put('/market-prices/{marketPrice}', [MarketPriceController::class, 'update'])->name('market-prices.update');
    Route::delete('/market-prices/{marketPrice}', [MarketPriceController::class, 'destroy'])->name('market-prices.destroy');

    Route::get('/learn', [LearnAdminController::class, 'index'])->name('learn.index');
    Route::get('/learn/lessons/create', [LearnAdminController::class, 'create'])->name('learn.lessons.create');
    Route::post('/learn/lessons', [LearnAdminController::class, 'store'])->name('learn.lessons.store');
    Route::get('/learn/lessons/{lesson}/edit', [LearnAdminController::class, 'edit'])->name('learn.lessons.edit');
    Route::put('/learn/lessons/{lesson}', [LearnAdminController::class, 'update'])->name('learn.lessons.update');
    Route::delete('/learn/lessons/{lesson}', [LearnAdminController::class, 'destroy'])->name('learn.lessons.destroy');
    Route::post('/learn/topics', [LearnAdminController::class, 'storeTopic'])->name('learn.topics.store');
    Route::put('/learn/topics/{topic}', [LearnAdminController::class, 'updateTopic'])->name('learn.topics.update');
    Route::delete('/learn/topics/{topic}', [LearnAdminController::class, 'destroyTopic'])->name('learn.topics.destroy');

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::post('/reports/{report}/dismiss', [ReportController::class, 'dismiss'])->name('reports.dismiss');
    Route::post('/reports/{report}/remove', [ReportController::class, 'removeContent'])->name('reports.remove');
});
