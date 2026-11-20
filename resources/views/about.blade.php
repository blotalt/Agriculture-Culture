@php
    $teamMembers = [
        ['name' => 'Chhayhour Ly', 'role' => 'Leader', 'location' => 'Phnom Penh', 'image' => 'chhayhour.jpg'],
        ['name' => 'Molinza Chum', 'role' => 'Frontend', 'location' => 'Phnom Penh', 'image' => 'molinza.jpg'],
        ['name' => 'Longly Chea', 'role' => 'Frontend', 'location' => 'Phnom Penh', 'image' => 'longly.png'],
        ['name' => 'Chattra Hean', 'role' => 'BackEnd', 'location' => 'Phnom Penh', 'image' => 'chaktra.jpg'],
        ['name' => 'Syphanna Kong', 'role' => 'Backend', 'location' => 'Phnom Penh', 'image' => 'phanna.jpg'],
        ['name' => 'Kunvitourichard Hou', 'role' => 'QA/QC', 'location' => 'Phnom Penh', 'image' => 'vitou.jpg'],
        ['name' => 'Sharif Shefiy', 'role' => 'QA/QC', 'location' => 'Phnom Penh', 'image' => 'sharif.jpeg'],
    ];
@endphp

@extends('layout')

@section('content')
    <div id="react-app" data-page="about" data-team='{{ json_encode($teamMembers) }}'></div>
@endsection