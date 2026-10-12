<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Comment;

class Post extends Model
{
    protected $fillable = ['title', 'body', 'user_id', 'image', 'isTrending'];

    protected $casts = [
        'isTrending' => 'boolean',
        'views' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }
}
