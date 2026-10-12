<?php

namespace App\Services;

use App\Models\MarketPrice;
use App\Models\PriceAlert;
use App\Notifications\PriceAlertTriggered;
use Throwable;

class PriceAlertChecker
{
    // Notify everyone whose alert this price meets, once per new price.
    public function check(MarketPrice $price): int
    {
        $sent = 0;

        PriceAlert::with('user')->get()
            ->filter(fn (PriceAlert $alert) => $alert->matches($price))
            ->each(function (PriceAlert $alert) use ($price, &$sent) {
                if ($alert->last_notified_price !== null && abs($alert->last_notified_price - (float) $price->price_per_kg) < 0.001) {
                    return;
                }

                try {
                    $alert->user->notify(new PriceAlertTriggered($alert, $price));
                } catch (Throwable $e) {
                    // A broken mail or Telegram setup must never stop a price from being saved.
                    report($e);
                    return;
                }

                $alert->forceFill([
                    'last_notified_price' => $price->price_per_kg,
                    'last_notified_at' => now(),
                ])->save();

                $sent++;
            });

        return $sent;
    }
}
