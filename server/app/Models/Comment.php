<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $table = 'tbl_comments';
    protected $primaryKey = 'comment_id';
    protected $fillable = [
        'evaluation_id',
        'comment',
        'is_deleted'
    ];
}
