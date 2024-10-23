<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{

    public function indexByDepartment($departmentId)
    {
        $employees = Employee::leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
            ->leftJoin('tbl_positions', 'tbl_employees.position_id', '=', 'tbl_positions.position_id')
            ->where('tbl_departments.department_id', $departmentId)
            ->where('tbl_employees.is_deleted', false)
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

    public function getEmployee($employeeId)
    {
        $employee = Employee::leftJoin('tbl_users', 'tbl_employees.employee_id', '=', 'tbl_users.employee_id')
            ->leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
            ->leftJoin('tbl_positions', 'tbl_employees.position_id', '=', 'tbl_positions.position_id')
            ->find($employeeId);

        return response()->json([
            'employee' => $employee,
            'status' => 200
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

    public function updateEmployee(Request $request, $employeeId)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'position' => ['required'],
            'department' => ['required'],
            'username' => ['required', 'max:12']
        ]);

        $employee = Employee::find($employeeId);

        $user = User::where('tbl_users.employee_id', $employeeId)
            ->first();

        $employee->update([
            'first_name' => strtoupper($validated['first_name']),
            'middle_name' => strtoupper($validated['middle_name']),
            'last_name' => strtoupper($validated['last_name']),
            'suffix_name' => strtoupper($validated['suffix_name']),
            'position_id' => $validated['position'],
            'department_id' => $validated['department']
        ]);

        $user->update([
            'username' => strtoupper($validated['username'])
        ]);

        return response()->json([
            'status' => 200
        ]);
    }

    public function deleteEmployee($employeeId)
    {
        $employee = Employee::find($employeeId);
        $user = User::where('tbl_users.employee_id', $employeeId)
            ->first();

        $employee->update([
            'is_deleted' => true
        ]);

        $user->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'status' => 200
        ]);
    }
}
