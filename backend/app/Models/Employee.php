<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'department_id'
    ];
}
