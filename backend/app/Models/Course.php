<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $table = 'tbl_courses';
    protected $primaryKey = 'course_id';
    protected $fillable = [
        'department_id',
        'course',
        'is_deleted'
    ];
}
