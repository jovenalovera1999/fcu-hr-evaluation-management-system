<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Evaluation;
use App\Models\Student;
use Illuminate\Http\Request;

class AdminDashboard extends Controller
{
    public function statistics()
    {
        $totalEmployees = Employee::where('tbl_employees.is_deleted', 0)
            ->count();

        $totalStudents = Student::where('tbl_students.is_deleted', 0)
            ->count();

        // $totalResponders = Evaluation::select('tbl_evaluations.student_id')
        //     ->distinct()
        //     ->where('tbl_evaluations.is_completed', 0)
        //     ->count();

        return response()->json([
            'totalEmployees' => $totalEmployees,
            'totalStudents' => $totalStudents,
            'totalResponders' => $totalResponders,
            'status' => 200
        ]);
    }
}
