<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Response extends Model
{
    use HasFactory;

    protected $table = 'tbl_responses';
    protected $primaryKey = 'response_id';
    protected $fillable = [
        'evaluation_id',
        'question_id',
        'poor',
        'mediocre',
        'satisfactory',
        'good',
        'excellent',
        'is_deleted'
    ];
}
