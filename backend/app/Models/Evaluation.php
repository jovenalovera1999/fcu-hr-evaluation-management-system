<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $table = 'tbl_evaluations';
    protected $primaryKey = 'evaluation_id';
    protected $fillable = [
        'student_id',
        'employee_id',
        'academic_year_id',
        'is_completed'
    ];
}
