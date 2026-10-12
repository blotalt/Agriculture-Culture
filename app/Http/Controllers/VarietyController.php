<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Variety;
use App\Services\ImageOptimizer;
use App\Support\Provinces;
use App\Support\VarietyFacts;
use Illuminate\Support\Facades\Storage;

class VarietyController extends Controller
{
    // public function index()
    // {
    //     $paginatedVarieties = Variety::latest()->paginate(10);
        
    //     $totalCount = Variety::count(); 
    //     $highDemandCount = Variety::where('demand', 'Very High')->orWhere('demand', 'High')->count();

    //     return view('variety', [
    //         'varieties' => $paginatedVarieties,
    //         'totalCount' => $totalCount,
    //         'highDemandCount' => $highDemandCount
    //     ]);
    // }


public function index(Request $request)
{
    $query = Variety::query();

    // Type filter (pills)
    if ($request->filled('type')) {
        $query->where('type', $request->type);
    }

    // Search (name, Khmer name, location)
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('khmer_name', 'like', "%{$search}%")
              ->orWhere('location', 'like', "%{$search}%");
        });
    }

    // Sort
    if ($request->sort === 'az') {
        $query->orderBy('name', 'asc');
    } elseif ($request->sort === 'za') {
        $query->orderBy('name', 'desc');
    } else {
        $query->latest();
    }

    $varieties = $query->paginate(9)->withQueryString();
    $allNames = Variety::orderBy('name')->pluck('name'); 

    $totalCount = Variety::count();
    $highDemandCount = Variety::whereIn('demand', ['Very High', 'High'])->count();

    return view('variety', [
        'varieties' => $varieties,
        'totalCount' => $totalCount,
        'highDemandCount' => $highDemandCount
    ]);
}

    // Side-by-side comparison of up to four varieties.
    public function compare(Request $request)
    {
        $ids = collect($request->input('ids', []))->map(fn ($id) => (int) $id)->filter()->unique()->take(4);

        $selected = Variety::whereIn('id', $ids)->get()
            ->map(fn (Variety $variety) => $this->present($variety))
            ->values();

        return view('variety-compare', [
            'selected' => $selected,
            'all' => Variety::orderBy('name')->get(['id', 'name', 'khmer_name', 'type']),
        ]);
    }

    // "What should I plant?" Ranks varieties for a season, province and priority.
    public function recommend(Request $request)
    {
        $filters = $request->validate([
            'season' => 'nullable|in:wet,dry',
            'province' => ['nullable', 'string', \Illuminate\Validation\Rule::in(array_column(Provinces::all(), 'name'))],
            'priority' => 'nullable|in:demand,yield,fast',
        ]);

        $results = [];

        if ($request->filled('season')) {
            $results = Variety::all()
                ->map(fn (Variety $variety) => $this->present($variety))
                ->filter(fn ($v) => in_array($filters['season'], $v['facts']['seasons'], true))
                ->map(function ($v) use ($filters) {
                    [$score, $reasons] = $this->score($v, $filters);
                    return $v + ['score' => $score, 'reasons' => $reasons];
                })
                ->sortByDesc('score')
                ->values()
                ->all();
        }

        return view('variety-recommend', [
            'results' => $results,
            'filters' => $filters + ['season' => null, 'province' => null, 'priority' => null],
            'provinces' => array_column(Provinces::all(), 'name'),
        ]);
    }

    private function present(Variety $variety): array
    {
        return [
            'id' => $variety->id,
            'name' => $variety->name,
            'khmer_name' => $variety->khmer_name,
            'type' => $variety->type,
            'location' => $variety->location,
            'description' => $variety->description,
            'yield' => $variety->yield,
            'cycle' => $variety->cycle,
            'harvest' => $variety->harvest,
            'season' => $variety->season,
            'demand' => $variety->demand,
            'image' => $variety->image,
            'facts' => VarietyFacts::for($variety),
            'calendar' => VarietyFacts::calendar($variety),
            'sources' => $variety->sources ?? [],
            'unconfirmed' => $variety->unconfirmedFacts(),
        ];
    }

    // Score out of 100, weighted toward the farmer's priority, with the reasons behind it.
    private function score(array $variety, array $filters): array
    {
        $facts = $variety['facts'];
        $priority = $filters['priority'] ?? 'demand';
        $reasons = [];

        $demand = $facts['demandScore'] / 4;                                   // 0..1
        $yield = $facts['yieldMid'] ? min($facts['yieldMid'] / 5, 1) : 0.5;     // 5 t/ha counts as top yield
        $speed = $facts['cycleMid'] ? max(0, min(1, (160 - $facts['cycleMid']) / 60)) : 0.5; // 100 days best, 160 worst

        $weights = match ($priority) {
            'yield' => ['demand' => 0.25, 'yield' => 0.55, 'speed' => 0.2],
            'fast' => ['demand' => 0.25, 'yield' => 0.2, 'speed' => 0.55],
            default => ['demand' => 0.55, 'yield' => 0.25, 'speed' => 0.2],
        };

        $score = $demand * $weights['demand'] + $yield * $weights['yield'] + $speed * $weights['speed'];

        if ($facts['demandScore'] >= 3) {
            $reasons[] = 'demand';
        }
        if ($facts['yieldMid'] && $facts['yieldMid'] >= 3.75) {
            $reasons[] = 'yield';
        }
        if ($facts['cycleMid'] && $facts['cycleMid'] <= 120) {
            $reasons[] = 'fast';
        }

        // A variety already grown in the farmer's province is a proven fit there.
        if (! empty($filters['province']) && Provinces::canonical($variety['location']) === $filters['province']) {
            $score += 0.15;
            $reasons[] = 'local';
        }

        return [(int) round(min($score, 1) * 100), $reasons];
    }

 public function suggest(Request $request)
    {
        $q = $request->q;

        if (!$q) {
            return response()->json([]);
        }

        $varieties = Variety::where('name', 'like', "%{$q}%")
            ->orWhere('khmer_name', 'like', "%{$q}%")
            ->orWhere('location', 'like', "%{$q}%")
            ->orWhere('type', 'like', "%{$q}%")
            ->limit(6)
            ->get(['name', 'type'])
            ->map(fn($v) => ['label' => $v->name, 'meta' => $v->type]);

        return response()->json($varieties);
    }

    public function manageScreen()
    {
        // Admins see every variety so they can moderate; users see their own.
        $query = auth()->user()->is_admin ? Variety::query() : Variety::where('user_id', auth()->id());
        $myVarieties = $query->latest()->get();
        return view('manage-varieties', ['myVarieties' => $myVarieties]);
    }

    public function createVariety(Request $request)
    {
        $incomingField = $request->validate([
            'name' => 'required|string|max:255',
            'khmer_name' => 'required|string|max:255',
            'type' => 'required',
            'location' => 'required',
            'description' => 'nullable',
            'yield' => 'required',
            'cycle' => 'required',
            'harvest' => 'nullable|string|max:50',
            'season' => 'required',
            'demand' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        $incomingField['name'] = strip_tags($incomingField['name']);
        $incomingField['khmer_name'] = strip_tags($incomingField['khmer_name']);
        $incomingField['location'] = strip_tags($incomingField['location']);
        $incomingField['description'] = isset($incomingField['description']) ? strip_tags($incomingField['description']) : null;
        $incomingField['harvest'] = isset($incomingField['harvest']) ? strip_tags($incomingField['harvest']) : null;
        $incomingField['user_id'] = auth()->id();
        $source = $this->validatedSource($request);

        if ($request->hasFile('image')) {
            $incomingField['image'] = app(ImageOptimizer::class)->store($request->file('image'), 'ricetypes');
        }

        $variety = new Variety($incomingField);
        $variety->addSource($source['source_title'] ?? null, $source['source_url'] ?? null, auth()->user()->name);
        $variety->save();
        return redirect('/variety')->with('success', 'Variety created successfully!');
    }

    public function showEditScreen(Variety $variety) {
        if (! auth()->user()->canManage($variety)) {
            abort(403);
        }
        return view('edit-variety', ['variety' => $variety]);
    }

    public function updateVariety(Variety $variety, Request $request) {
        if (! auth()->user()->canManage($variety)) { abort (403); }

        $incomingField = $request->validate([
            'name' => 'required',
            'khmer_name' => 'required',
            'type' => 'required',
            'location' => 'required',
            'description' => 'nullable',
            'yield' => 'required',
            'cycle' => 'required',
            'harvest' => 'nullable|string|max:50',
            'season' => 'required',
            'demand' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        $incomingField['name'] = strip_tags($incomingField['name']);
        $incomingField['khmer_name'] = strip_tags($incomingField['khmer_name']);
        $incomingField['location'] = strip_tags($incomingField['location']);
        $incomingField['description'] = isset($incomingField['description']) ? strip_tags($incomingField['description']) : null;
        $incomingField['harvest'] = isset($incomingField['harvest']) ? strip_tags($incomingField['harvest']) : null;
        $source = $this->validatedSource($request);

        if ($request->hasFile('image')) {
            if ($variety->image) { Storage::disk('public')->delete($variety->image); }
            $incomingField['image'] = app(ImageOptimizer::class)->store($request->file('image'), 'ricetypes');
        }

        // A source given in the form is added to the list; existing sources are kept.
        $variety->fill($incomingField);
        $variety->addSource($source['source_title'] ?? null, $source['source_url'] ?? null, auth()->user()->name);
        $variety->save();
        return redirect('/manage-varieties')->with('success', 'Variety updated successfully!');
    }

    private function validatedSource(Request $request): array
    {
        return $request->validate([
            'source_title' => 'nullable|string|max:255',
            'source_url' => 'nullable|url:http,https|max:1024',
        ]);
    }

    public function deleteVariety(Variety $variety) {
        if (! auth()->user()->canManage($variety)) { abort(403); }

        if ($variety->image) {
            Storage::disk('public')->delete($variety->image);
        }

        $variety->delete();
        return redirect('/manage-varieties')->with('success', 'Deleted.');
    }
}