<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Evaluation;
use App\Models\Response;
use App\Models\Student;
use Illuminate\Http\Request;

class AdminDashboard extends Controller
{
    public function statistics($academicYearId, $semesterId)
    {
        $totalEmployees = Employee::where('tbl_employees.is_deleted', false)
            ->count();

        $totalStudents = Student::where('tbl_students.is_deleted', false)
            ->count();

        $totalResponders = Evaluation::distinct('tbl_evaluations.student_id')
            ->leftJoin('tbl_semesters', 'tbl_evaluations.semester_id', '=', 'tbl_semesters.semester_id')
            ->leftJoin('tbl_academic_years', 'tbl_semesters.academic_year_id', '=', 'tbl_academic_years.academic_year_id')
            ->where('tbl_academic_years.academic_year_id', $academicYearId)
            ->where('tbl_semesters.semester_id', $semesterId)
            ->where('tbl_evaluations.is_completed', false)
            ->count();

        $totalResponded = Evaluation::distinct('tbl_evaluations.student_id')
            ->leftJoin('tbl_semesters', 'tbl_evaluations.semester_id', '=', 'tbl_semesters.semester_id')
            ->leftJoin('tbl_academic_years', 'tbl_semesters.academic_year_id', '=', 'tbl_academic_years.academic_year_id')
            ->where('tbl_academic_years.academic_year_id', $academicYearId)
            ->where('tbl_semesters.semester_id', $semesterId)
            ->where('tbl_evaluations.is_completed', true)
            ->count();

        $totalPoor = Response::leftJoin('tbl_evaluations', 'tbl_responses.evaluation_id', '=', 'tbl_evaluations.evaluation_id')
            ->leftJoin('tbl_semesters', 'tbl_evaluations.semester_id', '=', 'tbl_semesters.semester_id')
            ->leftJoin('tbl_academic_years', 'tbl_semesters.academic_year_id', '=', 'tbl_academic_years.academic_year_id')
            ->where('tbl_academic_years.academic_year_id', $academicYearId)
            ->where('tbl_semesters.semester_id', $semesterId)
            ->where('tbl_responses.poor', true)
            ->count();

        $totalMediocre = Response::leftJoin('tbl_evaluations', 'tbl_responses.evaluation_id', '=', 'tbl_evaluations.evaluation_id')
            ->leftJoin('tbl_semesters', 'tbl_evaluations.semester_id', '=', 'tbl_semesters.semester_id')
            ->leftJoin('tbl_academic_years', 'tbl_semesters.academic_year_id', '=', 'tbl_academic_years.academic_year_id')
            ->where('tbl_academic_years.academic_year_id', $academicYearId)
            ->where('tbl_semesters.semester_id', $semesterId)
            ->where('tbl_responses.mediocre', true)
            ->count();

        $totalSatisfactory = Response::leftJoin('tbl_evaluations', 'tbl_responses.evaluation_id', '=', 'tbl_evaluations.evaluation_id')
            ->leftJoin('tbl_semesters', 'tbl_evaluations.semester_id', '=', 'tbl_semesters.semester_id')
            ->leftJoin('tbl_academic_years', 'tbl_semesters.academic_year_id', '=', 'tbl_academic_years.academic_year_id')
            ->where('tbl_academic_years.academic_year_id', $academicYearId)
            ->where('tbl_semesters.semester_id', $semesterId)
            ->where('tbl_responses.satisfactory', true)
            ->count();

        $totalGood = Response::leftJoin('tbl_evaluations', 'tbl_responses.evaluation_id', '=', 'tbl_evaluations.evaluation_id')
            ->leftJoin('tbl_semesters', 'tbl_evaluations.semester_id', '=', 'tbl_semesters.semester_id')
            ->leftJoin('tbl_academic_years', 'tbl_semesters.academic_year_id', '=', 'tbl_academic_years.academic_year_id')
            ->where('tbl_academic_years.academic_year_id', $academicYearId)
            ->where('tbl_semesters.semester_id', $semesterId)
            ->where('tbl_responses.good', true)
            ->count();

        $totalExcellent = Response::leftJoin('tbl_evaluations', 'tbl_responses.evaluation_id', '=', 'tbl_evaluations.evaluation_id')
            ->leftJoin('tbl_semesters', 'tbl_evaluations.semester_id', '=', 'tbl_semesters.semester_id')
            ->leftJoin('tbl_academic_years', 'tbl_semesters.academic_year_id', '=', 'tbl_academic_years.academic_year_id')
            ->where('tbl_academic_years.academic_year_id', $academicYearId)
            ->where('tbl_semesters.semester_id', $semesterId)
            ->where('tbl_responses.excellent', true)
            ->count();

        return response()->json([
            'totalEmployees' => $totalEmployees,
            'totalStudents' => $totalStudents,
            'totalResponders' => $totalResponders,
            'totalResponded' => $totalResponded,
            'totalPoor' => $totalPoor,
            'totalMediocre' => $totalMediocre,
            'totalSatisfactory' => $totalSatisfactory,
            'totalGood' => $totalGood,
            'totalExcellent' => $totalExcellent,
            'status' => 200
        ]);
    }
}
