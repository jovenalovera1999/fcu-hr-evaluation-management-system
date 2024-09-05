<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $table = 'tbl_questions';
    protected $primaryKey = 'question_id';
    protected $fillable = [
        'category_id',
        'question',
        'is_deleted'
    ];
}
