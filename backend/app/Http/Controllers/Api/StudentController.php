<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::leftJoin('tbl_courses', 'tbl_students.course_id', '=', 'tbl_courses.course_id')
            ->leftJoin('tbl_departments', 'tbl_courses.department_id', '=', 'tbl_departments.department_id')
            ->where('tbl_students.is_deleted', 0)
            ->orderBy('tbl_students.last_name', 'asc')
            ->get();

        return response()->json([
            'status' => 200,
            'students' => $students
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'department' => ['required'],
            'course' => ['required'],
            'year_level' => ['required', 'numeric'],
            'username' => ['required', 'max:12'],
            'password' => ['required', 'max:15', 'confirmed'],
            'password_confirmation' => ['required']
        ]);

        $student = Student::create([
            'first_name' => strtoupper($validated['first_name']),
            'middle_name' => strtoupper($validated['middle_name']),
            'last_name' => strtoupper($validated['last_name']),
            'suffix_name' => strtoupper($validated['suffix_name']),
            'course_id' => $validated['course'],
            'year_level' => $validated['year_level']
        ]);

        User::create([
            'student_id' => $student->student_id,
            'username' => $validated['username'],
            'password' => bcrypt($validated['password'])
        ]);

        return response()->json([
            'status' => 200
        ]);
    }
}
