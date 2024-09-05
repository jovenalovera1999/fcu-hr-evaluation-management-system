<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::orderBy('tbl_departments.department', 'asc')
            ->get();

        return response()->json([
            'departments' => $departments,
            'status' => 200
        ]);
    }
}
