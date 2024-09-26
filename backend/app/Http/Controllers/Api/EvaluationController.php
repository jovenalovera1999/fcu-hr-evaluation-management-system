<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Evaluation;
use App\Models\EvaluationForStudent;
use App\Models\Question;
use App\Models\Response;
use App\Models\Student;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    public function index($studentId, $employeeId)
    {
        $employees = '';

        if ($studentId) {
            $employees = Evaluation::select('tbl_evaluations.evaluation_id', 'tbl_employees.first_name', 'tbl_employees.middle_name', 'tbl_employees.last_name', 'tbl_employees.suffix_name', 'tbl_departments.department', 'tbl_positions.position')
                ->leftJoin('tbl_employees', 'tbl_evaluations.employee_to_evaluate_id', '=', 'tbl_employees.employee_id')
                ->leftJoin('tbl_students', 'tbl_evaluations.student_id', '=', 'tbl_students.student_id')
                ->leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
                ->leftJoin('tbl_positions', 'tbl_employees.position_id', '=', 'tbl_positions.position_id')
                ->where('tbl_evaluations.is_student', 1)
                ->where('tbl_evaluations.is_completed', 0)
                ->where('tbl_students.student_id', $studentId)
                ->get();
        } else if ($employeeId) {
            $employees = Evaluation::leftJoin('tbl_employees', 'tbl_evaluations.employee_to_evaluate_id', '=', 'tbl_employees.employee_id')
                ->leftJoin('tbl_students', 'tbl_evaluations.student_id', '=', 'tbl_students.student_id')
                ->where('tbl_evaluations.is_student', 1)
                ->where('tbl_evaluations.is_completed', 0)
                ->where('tbl_students.student_id', $employeeId)
                ->get();
        }


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
                    'academic_year_id' => $validated['academic_year'],
                    'is_student' => 1
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

    public function storeEvaluationsForEmployees(Request $request)
    {
        $validated = $request->validate([
            'academic_year' => ['required'],
            'department' => ['required'],
            'employees_department' => ['required'],
            'selectedEmployees' => ['array', 'min:1']
        ], [
            'employees_department.required' => "The employee's department field is required.",
            'selectedEmployees.min' => 'Select an employee at least 1.'
        ]);

        $employees = Employee::leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
            ->where('tbl_departments.department_id', $validated['department'])
            ->where('tbl_employees.is_deleted', 0)
            ->get();

        $questions = Question::where('tbl_questions.is_deleted', 0)
            ->get();

        foreach ($employees as $employee) {
            foreach ($validated['selectedEmployees'] as $selectedEmployee) {
                $evaluation = Evaluation::create([
                    'employee_to_response_id' => $employee->employee_id,
                    'employee_to_evaluate_id' => $selectedEmployee,
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
