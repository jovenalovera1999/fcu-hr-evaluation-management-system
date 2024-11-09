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
use Illuminate\Support\Facades\DB;

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
                ->where('tbl_evaluations.is_student', true)
                ->where('tbl_evaluations.is_cancelled', false)
                ->where('tbl_evaluations.is_completed', false)
                ->where('tbl_students.student_id', $studentId)
                ->get();
        } else if ($employeeId) {
            $employees =
                Evaluation::select('tbl_evaluations.evaluation_id', 'tbl_employees.first_name', 'tbl_employees.middle_name', 'tbl_employees.last_name', 'tbl_employees.suffix_name', 'tbl_departments.department', 'tbl_positions.position')
                ->leftJoin('tbl_employees', 'tbl_evaluations.employee_to_evaluate_id', '=', 'tbl_employees.employee_id')
                ->leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
                ->leftJoin('tbl_positions', 'tbl_employees.position_id', '=', 'tbl_positions.position_id')
                ->where('tbl_evaluations.is_student', false)
                ->where('tbl_evaluations.is_cancelled', false)
                ->where('tbl_evaluations.is_completed', false)
                ->where('tbl_employees.employee_id', $employeeId)
                ->get();
        }


        return response()->json([
            'employees' => $employees,
            'status' => 200
        ]);
    }

    public function loadResults($semesterId)
    {
        // $results = Evaluation::select(
        //     'tbl_employees.employee_id',
        //     'tbl_employees.first_name',
        //     'tbl_employees.middle_name',
        //     'tbl_employees.last_name',
        //     'tbl_employees.suffix_name',
        //     'tbl_positions.position_id',
        //     'tbl_positions.position',
        //     'tbl_departments.department_id',
        //     'tbl_departments.department',
        //     'tbl_evaluations.evaluation_id',
        //     'tbl_evaluations.semester_id',
        //     'tbl_evaluations.is_completed',
        //     DB::raw('COUNT(CASE WHEN tbl_responses.poor = TRUE THEN 1 END) AS poor'),
        //     DB::raw('COUNT(CASE WHEN tbl_responses.mediocre = TRUE THEN 1 END) AS mediocre'),
        //     DB::raw('COUNT(CASE WHEN tbl_responses.satisfactory = TRUE THEN 1 END) AS satisfactory'),
        //     DB::raw('COUNT(CASE WHEN tbl_responses.good = TRUE THEN 1 END) AS good'),
        //     DB::raw('COUNT(CASE WHEN tbl_responses.excellent = TRUE THEN 1 END) AS excellent')
        // )
        //     ->leftJoin('tbl_employees', 'tbl_evaluations.employee_to_evaluate_id', '=', 'tbl_employees.employee_id')
        //     ->leftJoin('tbl_positions', 'tbl_employees.position_id', '=', 'tbl_positions.position_id')
        //     ->leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
        //     ->leftJoin('tbl_responses', 'tbl_evaluations.evaluation_id', '=', 'tbl_responses.evaluation_id')
        //     ->where('tbl_evaluations.semester_id', $semesterId)
        //     ->where('tbl_evaluations.is_completed', true)
        //     ->groupBy(
        //         'tbl_employees.employee_id',
        //         'tbl_employees.first_name',
        //         'tbl_employees.middle_name',
        //         'tbl_employees.last_name',
        //         'tbl_employees.suffix_name',
        //         'tbl_positions.position_id',
        //         'tbl_positions.position',
        //         'tbl_departments.department_id',
        //         'tbl_departments.department',
        //         'tbl_evaluations.evaluation_id',
        //         'tbl_evaluations.semester_id',
        //         'tbl_evaluations.is_completed',
        //     )
        //     ->get();

        $results = Evaluation::select(
            'tbl_employees.employee_id',
            'tbl_employees.first_name',
            'tbl_employees.last_name',
            'tbl_positions.position',
            'tbl_departments.department'
        )
            ->leftJoin('tbl_employees', 'tbl_evaluations.employee_to_evaluate_id', '=', 'tbl_employees.employee_id')
            ->leftJoin('tbl_positions', 'tbl_employees.position_id', '=', 'tbl_positions.position_id')
            ->leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
            ->where('tbl_evaluations.semester_id', $semesterId)
            ->where('tbl_evaluations.is_cancelled', false)
            ->where('tbl_evaluations.is_completed', true)
            ->distinct()
            ->get();

        return response()->json([
            'results' => $results,
            'status' => 200
        ]);
    }

    public function loadResponseSummary($employeeId, $semesterId)
    {
        $summary = Response::select(
            DB::raw('SUM(CASE WHEN tbl_responses.poor = TRUE THEN 1 ELSE 0 END) AS poor'),
            DB::raw('SUM(CASE WHEN tbl_responses.mediocre = TRUE THEN 1 ELSE 0 END) AS mediocre'),
            DB::raw('SUM(CASE WHEN tbl_responses.satisfactory = TRUE THEN 1 ELSE 0 END) AS satisfactory'),
            DB::raw('SUM(CASE WHEN tbl_responses.good = TRUE THEN 1 ELSE 0 END) AS good'),
            DB::raw('SUM(CASE WHEN tbl_responses.excellent = TRUE THEN 1 ELSE 0 END) AS excellent')
        )
            ->leftJoin('tbl_evaluations', 'tbl_responses.evaluation_id', '=', 'tbl_evaluations.evaluation_id')
            ->where('tbl_evaluations.employee_to_evaluate_id', $employeeId)
            ->where('tbl_evaluations.semester_id', $semesterId)
            ->first();

        return response()->json([
            'summary' => $summary,
            'status' => 200
        ]);
    }

    public function storeEvaluationsForStudents(Request $request)
    {
        $validated = $request->validate([
            'academic_year' => ['required'],
            'semester' => ['required'],
            'students_department' => ['required'],
            'course' => ['required'],
            'year_level' => ['required'],
            'students_section' => ['required'],
            'employees_department' => ['required'],
            'selectedEmployees' => ['array', 'min:1']
        ], [
            'students_department.required' => "The student's department field is required.",
            'employees_department.required' => "The employee's department field is required.",
            'selectedEmployees.min' => 'Select an employee at least 1.'
        ]);

        $students = Student::leftJoin('tbl_departments', 'tbl_students.department_id', '=', 'tbl_departments.department_id')
            ->leftJoin('tbl_courses', 'tbl_students.course_id', '=', 'tbl_courses.course_id')
            ->leftJoin('tbl_sections', 'tbl_students.section_id', '=', 'tbl_sections.section_id')
            ->where('tbl_departments.department_id', $validated['students_department'])
            ->where('tbl_courses.course_id', $validated['course'])
            ->where('tbl_students.year_level', $validated['year_level'])
            ->where('tbl_sections.section_id', $validated['students_section'])
            ->where('tbl_students.is_irregular', false)
            ->where('tbl_students.is_deleted', false)
            ->get();

        $questions = Question::where('tbl_questions.is_deleted', false)
            ->get();

        foreach ($students as $student) {
            foreach ($validated['selectedEmployees'] as $employee) {
                $evaluation = Evaluation::create([
                    'student_id' => $student->student_id,
                    'employee_to_evaluate_id' => $employee,
                    'semester_id' => $validated['semester'],
                    'is_student' => true
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

    public function sendEvaluationsForIrregularStudents(Request $request)
    {
        $validated = $request->validate([
            'academic_year' => ['required'],
            'semester' => ['required'],
            'employees_department' => ['required'],
            'selectedStudents' => ['array', 'min:1'],
            'selectedEmployees' => ['array', 'min:1']
        ], [
            'selectedStudents.min' => 'Select a student at least 1.',
            'selectedEmployees.min' => 'Select an employee at least 1.'
        ]);

        $questions = Question::where('tbl_questions.is_deleted', false)
            ->get();

        foreach ($validated['selectedStudents'] as $studentId) {
            foreach ($validated['selectedEmployees'] as $employeeId) {
                $evaluation = Evaluation::create([
                    'student_id' => $studentId,
                    'employee_to_evaluate_id' => $employeeId,
                    'semester_id' => $validated['semester'],
                    'is_student' => true
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
            ->where('tbl_employees.is_deleted', false)
            ->get();

        $questions = Question::where('tbl_questions.is_deleted', false)
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

    public function viewEmployeeSummaryRating()
    {
        $totalPoor = Response::leftJoin('tbl_evaluations', 'tbl_responses.evaluation_id', '=', 'tbl_evaluations.evaluation_id')
            ->leftJoin('tbl_employees', 'tbl_evaluations.employee_to_evaluate_id', '=', 'tbl_employees.employee_id')
            ->leftJoin('tbl_positions', 'tbl_employees.position_id', '=', 'tbl_positions.position_id')
            ->leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
            ->where('tbl_employees.first_name')
            ->count();
    }
}
