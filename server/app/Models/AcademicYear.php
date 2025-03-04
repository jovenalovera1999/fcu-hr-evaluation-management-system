<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademicYear extends Model
{
    use HasFactory;

    protected $table = 'tbl_academic_years';
    protected $primaryKey = 'academic_year_id';
    protected $fillable = [
        'academic_year',
        'is_deleted'
    ];

    public function semester(): HasMany
    {
        return $this->hasMany(Semester::class, 'academic_year_id', 'academic_year_id');
    }
}
