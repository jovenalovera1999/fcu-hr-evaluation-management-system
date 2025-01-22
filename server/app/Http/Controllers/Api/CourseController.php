<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index($departmentId)
    {

        $courses = Course::where('tbl_courses.department_id', $departmentId)
            ->orderBy('course', 'asc')
            ->get();

        return response()->json([
            'courses' => $courses,
            'status' => 200
        ]);
    }
}
