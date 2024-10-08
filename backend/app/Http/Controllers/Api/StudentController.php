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
            ->where('tbl_students.is_deleted', false)
            ->orderBy('tbl_students.last_name', 'asc')
            ->orderBy('tbl_students.first_name', 'asc')
            ->orderBy('tbl_students.middle_name', 'asc')
            ->orderBy('tbl_students.suffix_name', 'asc')
            ->orderBy('tbl_departments.department', 'asc')
            ->orderBy('tbl_courses.course', 'asc')
            ->orderBy('tbl_students.year_level', 'asc')
            ->get();

        return response()->json([
            'students' => $students,
            'status' => 200
        ]);
    }

    public function indexByYearLevelAndDepartment($yearLevel, $departmentId)
    {
        $students = Student::leftJoin('tbl_courses', 'tbl_students.course_id', '=', 'tbl_courses.course_id')
            ->leftJoin('tbl_departments', 'tbl_students.department_id', '=', 'tbl_departments.department_id')
            ->where('tbl_students.year_level', $yearLevel)
            ->where('tbl_students.department_id', $departmentId)
            ->where('tbl_students.is_deleted', false)
            ->orderBy('tbl_courses.course', 'asc')
            ->orderBy('tbl_students.last_name', 'asc')
            ->orderBy('tbl_students.first_name', 'asc')
            ->orderBy('tbl_students.middle_name', 'asc')
            ->orderBy('tbl_students.suffix_name', 'asc')
            ->orderBy('tbl_departments.department', 'asc')
            ->orderBy('tbl_courses.course', 'asc')
            ->orderBy('tbl_students.year_level', 'asc')
            ->get();

        return response()->json([
            'students' => $students,
            'status' => 200
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
            'department_id' => $validated['department'],
            'course_id' => $validated['course'],
            'year_level' => $validated['year_level']
        ]);

        $user = User::create([
            'student_id' => $student->student_id,
            'username' => strtoupper($validated['username']),
            'password' => bcrypt(strtoupper($validated['password'])),
            'is_student' => true
        ]);

        $token = $user->createToken('StudentToken')->plainTextToken;

        return response()->json([
            'token' => $token,
            'status' => 200
        ]);
    }
}
