<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Semester extends Model
{
    use HasFactory;

    protected $table = 'tbl_semesters';
    protected $primaryKey = 'semester_id';
    protected $fillable = [
        'semester',
        'academic_year_id',
        'is_deleted'
    ];

    public function academic_year(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id', 'academic_year_id');
    }

    public function evaluation(): HasMany
    {
        return $this->hasMany(Evaluation::class, 'semester_id', 'semester_id');
    }
}
