<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $fields = $request->validate([
            'type' => ['required', Rule::in(array_keys(Report::TYPES))],
            'id' => 'required|integer',
            'reason' => ['required', Rule::in(Report::REASONS)],
            'details' => 'nullable|string|max:500',
        ]);

        $model = Report::TYPES[$fields['type']]::findOrFail($fields['id']);

        // One report per user per item; reporting again just updates the reason.
        $request->user()->hasMany(Report::class)->updateOrCreate(
            ['reportable_type' => $model->getMorphClass(), 'reportable_id' => $model->id],
            ['reason' => $fields['reason'], 'details' => isset($fields['details']) ? strip_tags($fields['details']) : null]
        );

        return back()->with('success', 'Thanks — an admin will review this.');
    }

    public function index()
    {
        $reports = Report::with(['user', 'reportable'])
            ->where('status', 'open')
            ->oldest()
            ->get()
            ->map(fn (Report $report) => [
                'id' => $report->id,
                'type' => array_search($report->reportable_type, Report::TYPES, true) ?: 'item',
                'reason' => $report->reason,
                'details' => $report->details,
                'reporter' => $report->user?->name ?? 'Unknown user',
                'created_at' => $report->created_at->diffForHumans(),
                'content' => $this->describe($report->reportable),
            ]);

        return view('admin.reports', ['reports' => $reports]);
    }

    public function dismiss(Request $request, Report $report)
    {
        $report->resolve($request->user(), 'dismissed');

        return back()->with('success', 'Report dismissed.');
    }

    // Delete the reported item and close every open report about it.
    public function removeContent(Request $request, Report $report)
    {
        $item = $report->reportable;

        if ($item instanceof Post && $item->image) {
            Storage::disk('public')->delete($item->image);
        }

        Report::where('reportable_type', $report->reportable_type)
            ->where('reportable_id', $report->reportable_id)
            ->where('status', 'open')
            ->get()
            ->each->resolve($request->user(), 'removed');

        $item?->delete();

        return back()->with('success', 'Content removed.');
    }

    private function describe($item): ?array
    {
        return match (true) {
            $item instanceof Post => [
                'title' => $item->title,
                'body' => $item->body,
                'url' => "/news/{$item->id}",
            ],
            $item instanceof Comment => [
                'title' => 'Comment by '.($item->user?->name ?? 'Unknown user'),
                'body' => $item->body,
                'url' => "/news/{$item->post_id}",
            ],
            default => null,
        };
    }
}
