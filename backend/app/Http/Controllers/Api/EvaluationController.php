<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\EvaluationForStudent;
use App\Models\Question;
use App\Models\Response;
use App\Models\Student;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    public function index()
    {
        $employees = Evaluation::leftJoin('tbl_employees', 'tbl_evaluations.employee_to_evaluate_id', '=', 'tbl_employees.employee_id')
            ->where('tbl_evaluations.is_completed', 0)
            ->get();

        return response()->json([
            'employees' => $employees,
            'status' => 200
        ]);
    }

    public function storeEvaluationsForStudents(Request $request)
    {
        $validated = $request->validate([
            'academic_year' => ['required'],
            'students_department' => ['required'],
            'course' => ['required'],
            'year_level' => ['required'],
            'employees_department' => ['required'],
            'selectedEmployees' => ['array', 'min:1']
        ], [
            'students_department.required' => "The student's department field is required.",
            'employees_department.required' => "The employee's department field is required.",
            'selectedEmployees.min' => 'Select an employee at least 1.'
        ]);

        $students = Student::leftJoin('tbl_courses', 'tbl_students.course_id', '=', 'tbl_courses.course_id')
            ->leftJoin('tbl_departments', 'tbl_courses.department_id', '=', 'tbl_departments.department_id')
            ->where('tbl_departments.department_id', $validated['students_department'])
            ->where('tbl_courses.course_id', $validated['course'])
            ->where('tbl_students.year_level', $validated['year_level'])
            ->where('tbl_students.is_deleted', 0)
            ->get();

        $questions = Question::where('tbl_questions.is_deleted', 0)
            ->get();

        foreach ($students as $student) {
            foreach ($validated['selectedEmployees'] as $employee) {
                $evaluation = Evaluation::create([
                    'student_id' => $student->student_id,
                    'employee_to_evaluate_id' => $employee,
                    'academic_year_id' => $validated['academic_year']
                ]);

                foreach ($questions as $question) {
                    Response::create([
                        'evaluation_id' => $evaluation->evaluation_id,
                        'question_id' => $question->question_id
                    ]);
                }
            }
        }

        return response()->json([
            'status' => 200
        ]);
    }
}
