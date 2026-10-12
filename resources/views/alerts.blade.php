@extends('layout')

@section('content')
    <div
        id="react-app"
        data-page="alerts"
        data-csrf="{{ csrf_token() }}"
        data-alerts="{{ json_encode($alerts->map(fn ($alert) => [
            'id' => $alert->id,
            'rice_variety' => $alert->rice_variety,
            'province' => $alert->province,
            'direction' => $alert->direction,
            'threshold' => $alert->threshold,
            'notify_email' => $alert->notify_email,
            'telegram' => (bool) $alert->telegram_chat_id,
            'last_notified_at' => $alert->last_notified_at?->diffForHumans(),
        ])->all()) }}"
        data-options="{{ json_encode([
            'varieties' => $varieties,
            'provinces' => $provinces,
            'telegramEnabled' => $telegramEnabled,
            'telegramBot' => $telegramBot,
        ]) }}"
        data-errors="{{ json_encode($errors->all()) }}"
        data-old="{{ json_encode(collect(old())->except('_token')) }}">
    </div>
@endsection
