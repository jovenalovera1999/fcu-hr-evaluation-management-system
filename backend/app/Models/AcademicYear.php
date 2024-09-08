<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory;

    protected $table = 'tbl_academic_years';
    protected $primaryKey = 'academic_year_id';
    protected $fillable = [
        'academic_year',
        'is_deleted'
    ];
}
