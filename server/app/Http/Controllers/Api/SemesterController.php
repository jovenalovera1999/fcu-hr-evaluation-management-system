<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Semester;
use Illuminate\Http\Request;

class SemesterController extends Controller
{
    public function loadSemestersByAcademicYear($academicYearId)
    {
        $semesters = Semester::where('tbl_semesters.academic_year_id', $academicYearId)
            ->where('tbl_semesters.is_deleted', false)
            ->get();

        return response()->json([
            'semesters' => $semesters,
            'status' => 200
        ]);
    }

    public function fetchSemester($semesterId)
    {
        $semester = Semester::find($semesterId);

        return response()->json([
            'semester' => $semester
        ], 200);
    }
}
