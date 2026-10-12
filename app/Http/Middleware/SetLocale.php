<?php

namespace App\Http\Middleware;

use App\Http\Controllers\LocaleController;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->cookie('locale');

        if (in_array($locale, LocaleController::SUPPORTED, true)) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
