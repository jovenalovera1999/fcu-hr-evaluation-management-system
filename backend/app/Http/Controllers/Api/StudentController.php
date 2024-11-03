<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function loadIrregularStudentsByPage()
    {
        $students = Student::leftJoin('tbl_courses', 'tbl_students.course_id', '=', 'tbl_courses.course_id')
            ->leftJoin('tbl_departments', 'tbl_courses.department_id', '=', 'tbl_departments.department_id')
            ->leftJoin('tbl_sections', 'tbl_students.section_id', '=', 'tbl_sections.section_id')
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orderBy('tbl_students.last_name', 'asc')
            ->orderBy('tbl_students.first_name', 'asc')
            ->orderBy('tbl_students.middle_name', 'asc')
            ->orderBy('tbl_students.suffix_name', 'asc')
            ->orderBy('tbl_courses.course', 'asc')
            ->orderBy('tbl_sections.section', 'asc')
            ->orderBy('tbl_students.student_no', 'asc')
            ->paginate(10);

        return response()->json([
            'students' => $students,
            'status' => 200
        ]);
    }

    public function loadIrregularStudentsByPageAndSearch(Request $request)
    {
        $search = $request->input('search');
        $students =
            Student::leftJoin('tbl_courses', 'tbl_students.course_id', '=', 'tbl_courses.course_id')
            ->leftJoin('tbl_departments', 'tbl_courses.department_id', '=', 'tbl_departments.department_id')
            ->leftJoin('tbl_sections', 'tbl_students.section_id', '=', 'tbl_sections.section_id')
            ->where('tbl_students.student_no', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_students.first_name', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_students.middle_name', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_students.last_name', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_students.suffix_name', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_departments.department', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_courses.course', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_sections.section', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orderBy('tbl_students.last_name', 'asc')
            ->orderBy('tbl_students.first_name', 'asc')
            ->orderBy('tbl_students.middle_name', 'asc')
            ->orderBy('tbl_students.suffix_name', 'asc')
            ->orderBy('tbl_courses.course', 'asc')
            ->orderBy('tbl_sections.section', 'asc')
            ->orderBy('tbl_students.student_no', 'asc')
            ->paginate(10);

        return response()->json([
            'students' => $students,
            'status' => 200
        ]);
    }

    public function loadIrregularStudentIds()
    {
        $studentIds = Student::select('tbl_students.student_id')
            ->leftJoin('tbl_courses', 'tbl_students.course_id', '=', 'tbl_courses.course_id')
            ->leftJoin('tbl_departments', 'tbl_courses.department_id', '=', 'tbl_departments.department_id')
            ->leftJoin('tbl_sections', 'tbl_students.section_id', '=', 'tbl_sections.section_id')
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orderBy('tbl_students.last_name', 'asc')
            ->orderBy('tbl_students.first_name', 'asc')
            ->orderBy('tbl_students.middle_name', 'asc')
            ->orderBy('tbl_students.suffix_name', 'asc')
            ->orderBy('tbl_courses.course', 'asc')
            ->orderBy('tbl_sections.section', 'asc')
            ->orderBy('tbl_students.student_no', 'asc')
            ->get();

        return response()->json([
            'studentIds' => $studentIds,
            'status' => 200
        ]);
    }

    public function loadIrregularStudentIdsBySearch(Request $request)
    {
        $search = $request->input('search');
        $studentIds = Student::select('tbl_students.student_id')
            ->leftJoin('tbl_courses', 'tbl_students.course_id', '=', 'tbl_courses.course_id')
            ->leftJoin('tbl_departments', 'tbl_courses.department_id', '=', 'tbl_departments.department_id')
            ->leftJoin('tbl_sections', 'tbl_students.section_id', '=', 'tbl_sections.section_id')
            ->where('tbl_students.student_no', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_students.first_name', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_students.middle_name', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_students.last_name', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_students.suffix_name', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_departments.department', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_courses.course', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orWhere('tbl_sections.section', 'like', "%{$search}%")
            ->where('tbl_students.is_irregular', true)
            ->where('tbl_students.is_deleted', false)
            ->orderBy('tbl_students.last_name', 'asc')
            ->orderBy('tbl_students.first_name', 'asc')
            ->orderBy('tbl_students.middle_name', 'asc')
            ->orderBy('tbl_students.suffix_name', 'asc')
            ->orderBy('tbl_courses.course', 'asc')
            ->orderBy('tbl_sections.section', 'asc')
            ->orderBy('tbl_students.student_no', 'asc')
            ->get();

        return response()->json([
            'studentIds' => $studentIds,
            'status' => 200
        ]);
    }

    public function loadStudentsByYearLevelAndDepartment($yearLevel, $departmentId)
    {
        $students = Student::leftJoin('tbl_courses', 'tbl_students.course_id', '=', 'tbl_courses.course_id')
            ->leftJoin('tbl_departments', 'tbl_students.department_id', '=', 'tbl_departments.department_id')
            ->leftJoin('tbl_sections', 'tbl_students.section_id', '=', 'tbl_sections.section_id')
            // ->leftJoin('tbl_users.student_id', 'tbl_students.student_id', '=', 'tbl_users.student_id')
            ->where('tbl_students.department_id', $departmentId)
            ->where('tbl_students.year_level', $yearLevel)
            ->where('tbl_students.is_deleted', false)
            ->orderBy('tbl_students.last_name', 'asc')
            ->orderBy('tbl_students.first_name', 'asc')
            ->orderBy('tbl_students.middle_name', 'asc')
            ->orderBy('tbl_students.suffix_name', 'asc')
            ->orderBy('tbl_courses.course', 'asc')
            ->orderBy('tbl_sections.section', 'asc')
            ->orderBy('tbl_students.student_no', 'asc')
            ->get();

        return response()->json([
            'students' => $students,
            'status' => 200
        ]);
    }

    public function getStudent($studentId)
    {
        $student = Student::leftJoin('tbl_departments', 'tbl_students.department_id', '=', 'tbl_departments.department_id')
            ->leftJoin('tbl_courses', 'tbl_students.course_id', '=', 'tbl_courses.course_id')
            ->leftJoin('tbl_sections', 'tbl_students.section_id', '=', 'tbl_sections.section_id')
            ->find($studentId);

        return response()->json([
            'status' => 200,
            'student' => $student
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_no' => ['required'],
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'department' => ['required'],
            'course' => ['required'],
            'year_level' => ['required', 'numeric'],
            'section' => ['required'],
            'password' => ['required', 'max:15', 'confirmed'],
            'password_confirmation' => ['required'],
            'irregular' => ['nullable']
        ]);

        $student = Student::create([
            'student_no' => strtoupper($validated['student_no']),
            'first_name' => strtoupper($validated['first_name']),
            'middle_name' => strtoupper($validated['middle_name']),
            'last_name' => strtoupper($validated['last_name']),
            'suffix_name' => strtoupper($validated['suffix_name']),
            'department_id' => $validated['department'],
            'course_id' => $validated['course'],
            'year_level' => $validated['year_level'],
            'section_id' => $validated['section'],
            'is_irregular' => ($validated['irregular']) ? true : false
        ]);

        $user = User::create([
            'student_id' => $student->student_id,
            'username' => strtoupper($validated['student_no']),
            'password' => bcrypt(strtoupper($validated['password'])),
            'is_student' => true
        ]);

        $token = $user->createToken('StudentToken')->plainTextToken;

        return response()->json([
            'token' => $token,
            'status' => 200
        ]);
    }

    public function updateStudent(Request $request, $studentId)
    {
        $validated = $request->validate([
            'student_no' => ['required'],
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'department' => ['required'],
            'course' => ['required'],
            'year_level' => ['required', 'numeric'],
            'section' => ['required'],
            'irregular' => ['nullable']
        ]);

        $student = Student::find($studentId);

        $user = User::where('tbl_users.student_id', $studentId)
            ->first();

        $student->update([
            'student_no' => strtoupper($validated['student_no']),
            'first_name' => strtoupper($validated['first_name']),
            'middle_name' => strtoupper($validated['middle_name']),
            'last_name' => strtoupper($validated['last_name']),
            'suffix_name' => strtoupper($validated['suffix_name']),
            'department_id' => $validated['department'],
            'course_id' => $validated['course'],
            'year_level' => $validated['year_level'],
            'section_id' => $validated['section'],
            'is_irregular' => ($validated['irregular']) ? true : false
        ]);

        $user->update([
            'username' => strtoupper($validated['student_no'])
        ]);

        return response()->json([
            'student' => $student,
            'status' => 200
        ]);
    }

    public function deleteStudent($studentId)
    {
        $student = Student::find($studentId);
        $user = User::where('tbl_users.student_id', $studentId)
            ->first();

        $student->update([
            'is_deleted' => true
        ]);

        $user->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'status' => 200
        ]);
    }
}
