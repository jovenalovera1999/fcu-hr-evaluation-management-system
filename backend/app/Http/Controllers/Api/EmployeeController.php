<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function indexByDepartmentAndAcademicYear($departmentId, $academicYearId)
    {
        $employees = Employee::leftJoin('tbl_positions', 'tbl_employees.position_id', '=', 'tbl_positions.position_id')
            ->leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
            ->where('tbl_employees.is_deleted', 0)
            ->orderBy('tbl_employees.last_name', 'asc')
            ->orderBy('tbl_employees.first_name', 'asc')
            ->orderBy('tbl_employees.middle_name', 'asc')
            ->orderBy('tbl_employees.suffix_name', 'asc')
            ->get();

        return response()->json([
            'employees' => $employees,
            'status' => 200
        ]);
    }

    public function indexByDepartment($departmentId)
    {
        $employees = Employee::leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
            ->where('tbl_employees.department_id', $departmentId)
            ->where('tbl_employees.is_deleted', 0)
            ->orderBy('tbl_employees.last_name', 'asc')
            ->orderBy('tbl_employees.first_name', 'asc')
            ->orderBy('tbl_employees.middle_name', 'asc')
            ->orderBy('tbl_employees.suffix_name', 'asc')
            ->get();

        return response()->json([
            'status' => 200,
            'employees' => $employees
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'position' => ['required'],
            'department' => ['required'],
            'username' => ['required', 'max:12'],
            'password' => ['required', 'max:15', 'confirmed'],
            'password_confirmation' => ['required']
        ]);

        $employee = Employee::create([
            'first_name' => strtoupper($validated['first_name']),
            'middle_name' => strtoupper($validated['middle_name']),
            'last_name' => strtoupper($validated['last_name']),
            'suffix_name' => strtoupper($validated['suffix_name']),
            'position_id' => $validated['position'],
            'department_id' => $validated['department']
        ]);

        $user = User::create([
            'employee_id' => $employee->employee_id,
            'username' => strtoupper($validated['username']),
            'password' => bcrypt(strtoupper($validated['password']))
        ]);

        $token = $user->createToken('EmployeeToken')->plainTextToken;

        return response()->json([
            'token' => $token,
            'status' => 200
        ]);
    }
}
