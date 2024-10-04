<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index()
    {
        $academicYears = AcademicYear::orderBy('academic_year', 'desc')
            ->get();

        return response()->json([
            'academicYears' => $academicYears,
            'status' => 200
        ]);
    }
}
