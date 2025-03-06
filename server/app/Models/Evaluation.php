<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    use HasFactory;

    protected $table = 'tbl_evaluations';
    protected $primaryKey = 'evaluation_id';
    protected $fillable = [
        'student_id',
        'employee_to_response_id',
        'employee_to_evaluate_id',
        'semester_id',
        'is_student',
        'is_cancelled',
        'is_completed'
    ];

    public function employee_to_response(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_to_response_id', 'employee_id');
    }

    public function employee_to_evaluate(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_to_evaluate_id', 'employee_id');
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'semester_id', 'semester_id');
    }
}
