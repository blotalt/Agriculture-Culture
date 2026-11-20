<?php

namespace App\Http\Controllers;

use App\Models\Variety;
use App\Services\WeatherService;
use App\Support\Provinces;
use App\Support\VarietyFacts;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    // Seasonal planting calendar built from each variety's season and growing cycle.
    public function index(Request $request, WeatherService $weather)
    {
        $varieties = Variety::orderBy('name')->get()->map(fn (Variety $variety) => [
            'id' => $variety->id,
            'name' => $variety->name,
            'khmer_name' => $variety->khmer_name,
            'type' => $variety->type,
            'cycle' => $variety->cycle,
            'calendar' => VarietyFacts::calendar($variety),
        ]);

        $province = Provinces::find($request->query('province'))['name'] ?? 'Phnom Penh';

        return view('calendar', [
            'varieties' => $varieties,
            'province' => $province,
            'provinces' => array_column(Provinces::all(), 'name'),
            'forecast' => $weather->forecasts()[$province] ?? [],
        ]);
    }
}
