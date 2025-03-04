<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'tbl_employees';
    protected $primaryKey = 'employee_id';
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix_name',
        'position_id',
        'department_id',
        'is_deleted'
    ];

    public function evaluation_to_response(): HasMany
    {
        return $this->hasMany(Evaluation::class, 'employee_to_response_id', 'employee_id');
    }

    public function evaluation_to_evaluate(): HasMany
    {
        return $this->hasMany(Evaluation::class, 'employee_to_evaluate_id', 'employee_id');
    }
}
