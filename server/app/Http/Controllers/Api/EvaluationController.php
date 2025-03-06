<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Evaluation;
use App\Models\EvaluationForStudent;
use App\Models\Question;
use App\Models\Response;
use App\Models\Student;
use Exception;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    public function index($studentId, $employeeId)
    {
        $employees = "";

        if ($studentId) {
            $employees = Evaluation::select(
                "tbl_evaluations.evaluation_id",
                "tbl_employees.first_name",
                "tbl_employees.middle_name",
                "tbl_employees.last_name",
                "tbl_employees.suffix_name",
                "tbl_departments.department",
                "tbl_positions.position"
            )
                ->leftJoin("tbl_employees", "tbl_evaluations.employee_to_evaluate_id", "=", "tbl_employees.employee_id")
                ->leftJoin("tbl_students", "tbl_evaluations.student_id", "=", "tbl_students.student_id")
                ->leftJoin("tbl_departments", "tbl_employees.department_id", "=", "tbl_departments.department_id")
                ->leftJoin("tbl_positions", "tbl_employees.position_id", "=", "tbl_positions.position_id")
                ->where("tbl_evaluations.is_student", true)
                ->where("tbl_evaluations.is_cancelled", false)
                ->where("tbl_evaluations.is_completed", false)
                ->where("tbl_students.student_id", $studentId)
                ->get();
        } else if ($employeeId) {
            $employees =
                Evaluation::select(
                    "tbl_evaluations.evaluation_id",
                    "evaluate.first_name",
                    "evaluate.middle_name",
                    "evaluate.last_name",
                    "evaluate.suffix_name",
                    "tbl_departments.department",
                    "tbl_positions.position"
                )
                ->leftJoin("tbl_employees as evaluate", "tbl_evaluations.employee_to_evaluate_id", "=", "evaluate.employee_id")
                ->leftJoin('tbl_employees as response', 'tbl_evaluations.employee_to_response_id', '=', 'response.employee_id')
                ->leftJoin("tbl_departments", "evaluate.department_id", "=", "tbl_departments.department_id")
                ->leftJoin("tbl_positions", "evaluate.position_id", "=", "tbl_positions.position_id")
                ->where("tbl_evaluations.is_student", false)
                ->where("tbl_evaluations.is_cancelled", false)
                ->where("tbl_evaluations.is_completed", false)
                ->where("response.employee_id", $employeeId)
                ->get();
        }

        return response()->json([
            "employees" => $employees,
            "status" => 200
        ]);
    }

    public function loadEvaluationsToCancel(Request $request)
    {
        $evaluations = '';

        if ($request->has('academicYearId') && $request->has('semesterId')) {
            $academicYearId = $request->input('academicYearId');
            $semesterId = $request->input('semesterId');

            $evaluations = $evaluations = Evaluation::with(['employee_to_response', 'employee_to_evaluate', 'semester.academic_year'])
                ->leftJoin('tbl_semesters', 'tbl_evaluations.semester_id', '=', 'tbl_semesters.semester_id')
                ->leftJoin('tbl_academic_years', 'tbl_semesters.academic_year_id', '=', 'tbl_academic_years.academic_year_id')
                ->where('tbl_academic_years.academic_year_id', $academicYearId)
                ->where('tbl_semesters.semester_id', $semesterId)
                ->where('tbl_evaluations.is_cancelled', false)
                ->whereNotNull('tbl_academic_years.academic_year')
                ->get();
        } else {
            $evaluations = Evaluation::with(['employee_to_response', 'employee_to_evaluate', 'semester.academic_year'])
                ->leftJoin('tbl_semesters', 'tbl_evaluations.semester_id', '=', 'tbl_semesters.semester_id')
                ->leftJoin('tbl_academic_years', 'tbl_semesters.academic_year_id', '=', 'tbl_academic_years.academic_year_id')
                ->where('tbl_evaluations.is_cancelled', false)
                ->whereNotNull('tbl_academic_years.academic_year')
                ->get();
        }

        return response()->json([
            'evaluations' => $evaluations
        ], 200);
    }

    public function storeEvaluationsForStudents(Request $request)
    {
        $validated = $request->validate([
            "academic_year" => ["required"],
            "semester" => ["required"],
            "students_department" => ["required"],
            "course" => ["required"],
            "year_level" => ["required"],
            "students_section" => ["required"],
            "employees_department" => ["required"],
            "selectedEmployees" => ["array", "min:1"]
        ], [
            "students_department.required" => "The student's department field is required.",
            "employees_department.required" => "The employee's department field is required.",
            "selectedEmployees.min" => "Select an employee at least 1."
        ]);

        $students = Student::where("tbl_students.department_id", $validated["students_department"])
            ->where("tbl_students.course_id", $validated["course"])
            ->where("tbl_students.year_level", $validated["year_level"])
            ->where("tbl_students.section_id", $validated["students_section"])
            ->where("tbl_students.is_irregular", false)
            ->where("tbl_students.is_deleted", false)
            ->get();

        $questions = Question::leftJoin('tbl_positions', 'tbl_questions.position_id', '=', 'tbl_positions.position_id')
            ->where('tbl_positions.position', strtoupper('student'))
            ->where("tbl_questions.is_deleted", false)
            ->get();

        foreach ($students as $student) {
            foreach ($validated["selectedEmployees"] as $employee) {
                $evaluation = Evaluation::create([
                    "student_id" => $student->student_id,
                    "employee_to_evaluate_id" => $employee,
                    "semester_id" => $validated["semester"],
                    "is_student" => true
                ]);

                foreach ($questions as $question) {
                    Response::create([
                        "evaluation_id" => $evaluation->evaluation_id,
                        "question_id" => $question->question_id
                    ]);
                }
            }
        }

        return response()->json([
            "message" => 'EVALUATION SUCCESSFULLY SENT TO REGULAR STUDENTS.'
        ], 200);
    }

    public function sendEvaluationsForIrregularStudents(Request $request)
    {
        $validated = $request->validate([
            "academic_year" => ["required"],
            "semester" => ["required"],
            "employees_department" => ["required"],
            "selectedStudents" => ["array", "min:1"],
            "selectedEmployees" => ["array", "min:1"]
        ], [
            "selectedStudents.min" => "Select a student at least 1.",
            "selectedEmployees.min" => "Select an employee at least 1."
        ]);

        $questions = Question::leftJoin('tbl_positions', 'tbl_questions.position_id', '=', 'tbl_positions.position_id')
            ->where('tbl_positions.position', strtoupper('student'))
            ->where("tbl_questions.is_deleted", false)
            ->get();

        foreach ($validated["selectedStudents"] as $studentId) {
            foreach ($validated["selectedEmployees"] as $employeeId) {
                $evaluation = Evaluation::create([
                    "student_id" => $studentId,
                    "employee_to_evaluate_id" => $employeeId,
                    "semester_id" => $validated["semester"],
                    "is_student" => true
                ]);

                foreach ($questions as $question) {
                    Response::create([
                        "evaluation_id" => $evaluation->evaluation_id,
                        "question_id" => $question->question_id
                    ]);
                }
            }
        }

        return response()->json([
            "status" => 200
        ]);
    }

    public function storeEvaluationsForEmployees(Request $request)
    {
        $validated = $request->validate([
            "academic_year" => ["required"],
            'semester' => ['required'],
            "department" => ["required"],
            "employees_department" => ["required"],
            "selectedEmployees" => ["array", "min:1"]
        ], [
            "employees_department.required" => "The employee's department field is required.",
            "selectedEmployees.min" => "Select an employee at least 1."
        ]);

        $employees = Employee::leftJoin("tbl_departments", "tbl_employees.department_id", "=", "tbl_departments.department_id")
            ->where("tbl_departments.department_id", $validated["department"])
            ->where("tbl_employees.is_deleted", false)
            ->get();

        $questions = Question::leftJoin('tbl_positions', 'tbl_questions.position_id', '=', 'tbl_positions.position_id')
            ->where('tbl_positions.position', '!=', strtoupper('student'))
            ->where("tbl_questions.is_deleted", false)
            ->get();

        foreach ($employees as $employee) {
            foreach ($validated["selectedEmployees"] as $selectedEmployee) {
                $evaluation = Evaluation::create([
                    "employee_to_response_id" => $employee->employee_id,
                    "employee_to_evaluate_id" => $selectedEmployee,
                    "semester_id" => $validated["semester"]
                ]);

                foreach ($questions as $question) {
                    Response::create([
                        "evaluation_id" => $evaluation->evaluation_id,
                        "question_id" => $question->question_id
                    ]);
                }
            }
        }

        return response()->json([
            "status" => 200
        ]);
    }

    public function viewEmployeeSummaryRating()
    {
        $totalPoor = Response::leftJoin("tbl_evaluations", "tbl_responses.evaluation_id", "=", "tbl_evaluations.evaluation_id")
            ->leftJoin("tbl_employees", "tbl_evaluations.employee_to_evaluate_id", "=", "tbl_employees.employee_id")
            ->leftJoin("tbl_positions", "tbl_employees.position_id", "=", "tbl_positions.position_id")
            ->leftJoin("tbl_departments", "tbl_employees.department_id", "=", "tbl_departments.department_id")
            ->where("tbl_employees.first_name")
            ->count();
    }

    public function updateEvaluationToCancelled($semesterId, $academicYearId)
    {
        $evaluations = Evaluation::leftJoin('tbl_semesters', 'tbl_semesters.semester_id', '=', 'tbl_evaluations.semester_id')
            ->leftJoin('tbl_academic_years', 'tbl_semesters.academic_year_id', '=', 'tbl_academic_years.academic_year_id')
            ->where('tbl_semesters.semester_id', $semesterId)
            ->where('tbl_academic_years.academic_year_id', $academicYearId)
            ->get();

        foreach ($evaluations as $evaluation) {
            $evaluation->update([
                'is_cancelled' => true
            ]);
        }

        return response()->json([
            'message' => 'EVALUATIONS HAS BEEN CANCELLED.'
        ], 200);
    }
}
