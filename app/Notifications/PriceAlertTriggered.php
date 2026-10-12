<?php

namespace App\Notifications;

use App\Models\MarketPrice;
use App\Models\PriceAlert;
use App\Notifications\Channels\TelegramChannel;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PriceAlertTriggered extends Notification
{
    public function __construct(public PriceAlert $alert, public MarketPrice $price)
    {
    }

    public function via(object $notifiable): array
    {
        $channels = [];

        if ($this->alert->notify_email) {
            $channels[] = 'mail';
        }

        if ($this->alert->telegram_chat_id && config('services.telegram.bot_token')) {
            $channels[] = TelegramChannel::class;
        }

        return $channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Rice price alert: '.$this->price->rice_variety.' in '.$this->price->province)
            ->greeting('Hello '.$notifiable->name.',')
            ->line($this->summary())
            ->action('View market prices', url('/pricemarket'))
            ->line('You can change or remove this alert on your Price Alerts page.');
    }

    public function toTelegram(object $notifiable): array
    {
        return [
            'chat_id' => $this->alert->telegram_chat_id,
            'text' => "🌾 KhmerRice price alert\n".$this->summary()."\n".url('/pricemarket'),
        ];
    }

    private function summary(): string
    {
        $word = $this->alert->direction === 'above' ? 'above' : 'below';

        return sprintf(
            '%s at %s (%s) is now $%s/kg, %s your alert of $%s/kg.',
            $this->price->rice_variety,
            $this->price->market,
            $this->price->province,
            number_format((float) $this->price->price_per_kg, 2),
            $word,
            number_format($this->alert->threshold, 2)
        );
    }
}
