<?php

namespace App\Http\Controllers;

use App\Models\MarketPrice;
use App\Models\PriceAlert;
use App\Support\Provinces;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PriceAlertController extends Controller
{
    public function index(Request $request)
    {
        return view('alerts', [
            'alerts' => $request->user()->priceAlerts()->latest()->get(),
            'varieties' => MarketPrice::distinct()->orderBy('rice_variety')->pluck('rice_variety'),
            'provinces' => array_column(Provinces::all(), 'name'),
            'telegramEnabled' => (bool) config('services.telegram.bot_token'),
            'telegramBot' => config('services.telegram.bot_username'),
        ]);
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'rice_variety' => 'nullable|string|max:255',
            'province' => ['nullable', 'string', Rule::in(array_column(Provinces::all(), 'name'))],
            'direction' => 'required|in:above,below',
            'threshold' => 'required|numeric|min:0|max:100',
            'notify_email' => 'nullable|boolean',
            'telegram_chat_id' => ['nullable', 'string', 'max:32', 'regex:/^-?\d+$/'],
        ]);

        $fields['notify_email'] = $request->boolean('notify_email');

        if (! $fields['notify_email'] && empty($fields['telegram_chat_id'])) {
            return back()->withErrors(['notify_email' => 'Choose email, Telegram, or both.'])->withInput();
        }

        if ($request->user()->priceAlerts()->count() >= 20) {
            return back()->withErrors(['threshold' => 'You can have up to 20 alerts.']);
        }

        $request->user()->priceAlerts()->create($fields);

        return redirect()->route('alerts.index')->with('success', 'Alert created.');
    }

    public function destroy(Request $request, PriceAlert $alert)
    {
        abort_unless($alert->user_id === $request->user()->id, 403);

        $alert->delete();

        return redirect()->route('alerts.index')->with('success', 'Alert removed.');
    }
}
