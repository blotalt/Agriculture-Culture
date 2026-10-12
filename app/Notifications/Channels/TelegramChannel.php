<?php

namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;

// Sends a notification through the Telegram Bot API (TELEGRAM_BOT_TOKEN in .env).
class TelegramChannel
{
    public function send(object $notifiable, Notification $notification): void
    {
        $message = $notification->toTelegram($notifiable);
        $token = config('services.telegram.bot_token');

        if (! $token || empty($message['chat_id'])) {
            return;
        }

        Http::timeout(10)
            ->post("https://api.telegram.org/bot{$token}/sendMessage", $message)
            ->throw();
    }
}
