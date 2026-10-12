<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PriceImport extends Model
{
    protected $fillable = [
        'source',
        'source_url',
        'source_updated_at',
        'sha256',
        'bytes',
        'snapshot_path',
        'history_rows',
        'latest_rows',
        'latest_month',
    ];

    protected $casts = [
        'source_updated_at' => 'datetime',
        'latest_month' => 'date:Y-m-d',
    ];
}
