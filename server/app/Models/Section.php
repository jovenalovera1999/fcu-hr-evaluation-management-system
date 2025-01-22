<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $table = 'tbl_sections';
    protected $primaryKey = 'section_id';
    protected $fillable = [
        'course_id',
        'section',
        'is_deleted'
    ];
}
