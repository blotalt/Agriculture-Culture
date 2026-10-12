<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public const SUPPORTED = ['en', 'km'];

    // Remembered in a cookie (not the session) so the choice survives logging out.
    public function switch(Request $request, string $locale)
    {
        abort_unless(in_array($locale, self::SUPPORTED, true), 404);

        return redirect()->back(fallback: '/')
            ->withCookie(cookie()->forever('locale', $locale));
    }
}
