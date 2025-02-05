<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Response;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    public function loadEmployees()
    {
        $employees = Employee::leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
            ->leftJoin('tbl_positions', 'tbl_employees.position_id', '=', 'tbl_positions.position_id')
            ->leftJoin('tbl_users', 'tbl_employees.employee_id', '=', 'tbl_users.employee_id')
            ->where('tbl_employees.is_deleted', false)
            ->orderBy('tbl_employees.last_name', 'asc')
            ->orderBy('tbl_employees.first_name', 'asc')
            ->orderBy('tbl_employees.middle_name', 'asc')
            ->orderBy('tbl_employees.suffix_name', 'asc')
            ->paginate(10);

        return response()->json([
            'employees' => $employees
        ], 200);
    }

    public function indexByDepartment(Request $request)
    {
        $departmentId = $request->input('department');
        $employees = Employee::leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
            ->leftJoin('tbl_positions', 'tbl_employees.position_id', '=', 'tbl_positions.position_id')
            ->leftJoin('tbl_users', 'tbl_employees.employee_id', '=', 'tbl_users.employee_id')
            ->where('tbl_departments.department_id', $departmentId)
            ->where('tbl_employees.is_deleted', false)
            ->orderBy('tbl_employees.last_name', 'asc')
            ->orderBy('tbl_employees.first_name', 'asc')
            ->orderBy('tbl_employees.middle_name', 'asc')
            ->orderBy('tbl_employees.suffix_name', 'asc')
            ->paginate(10);

        return response()->json([
            'employees' => $employees,
        ], 200);
    }

    public function loadByDepartmentForEvaluation($departmentId)
    {
        $employees = Employee::leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
            ->leftJoin('tbl_positions', 'tbl_employees.position_id', '=', 'tbl_positions.position_id')
            ->leftJoin('tbl_users', 'tbl_employees.employee_id', '=', 'tbl_users.employee_id')
            ->where('tbl_departments.department_id', $departmentId)
            ->where('tbl_employees.is_deleted', false)
            ->orderBy('tbl_employees.last_name', 'asc')
            ->orderBy('tbl_employees.first_name', 'asc')
            ->orderBy('tbl_employees.middle_name', 'asc')
            ->orderBy('tbl_employees.suffix_name', 'asc')
            ->get();

        return response()->json([
            'employees' => $employees,
        ], 200);
    }

    public function loadEmployeesByAcademicYearAndSemester($academicYearId, $semesterId)
    {
        $employees = Employee::select("tbl_employees.employee_id", "tbl_employees.first_name", "tbl_employees.middle_name", "tbl_employees.last_name", "tbl_employees.suffix_name", "tbl_positions.position", "tbl_departments.department")
            ->leftJoin("tbl_positions", "tbl_employees.position_id", "=", "tbl_positions.position_id")
            ->leftJoin("tbl_departments", "tbl_employees.department_id", "=", "tbl_departments.department_id")
            ->leftJoin("tbl_evaluations", "tbl_employees.employee_id", "=", "tbl_evaluations.employee_to_evaluate_id")
            ->leftJoin("tbl_semesters", "tbl_evaluations.semester_id", "=", "tbl_semesters.semester_id")
            ->where("tbl_semesters.academic_year_id", $academicYearId)
            ->where("tbl_evaluations.semester_id", $semesterId)
            ->where("tbl_employees.is_deleted", false)
            ->where("tbl_evaluations.is_cancelled", false)
            ->where("tbl_evaluations.is_completed", true)
            ->distinct()
            ->get();

        // $overallTotalAnswers = Response::select(
        //     DB::raw("SUM(CASE WHEN tbl_responses.poor = TRUE THEN 1 ELSE 0 END) AS poor"),
        //     DB::raw("SUM(CASE WHEN tbl_responses.unsatisfactory = TRUE THEN 1 ELSE 0 END)"),
        //     DB::raw("SUM(CASE WHEN tbl_responses.satisfactory = TRUE THEN 1 ELSE 0 END)"),
        //     DB::raw("SUM(CASE WHEN tbl_responses.very_satisfactory = TRUE THEN 1 ELSE 0 END)"),
        //     DB::raw("SUM(CASE WHEN tbl_responses.outstanding = TRUE THEN 1 ELSE 0 END)")
        // );

        return response()->json([
            "employees" => $employees
        ], 200);
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
            'message' => 'EMPLOYEE SUCCESSFULLY UPDATED.'
        ], 200);
    }

    public function updatePassword(Request $request, $employeeId)
    {
        $validated = $request->validate([
            'password' => ['required', 'max:15', 'confirmed'],
            'password_confirmation' => ['required']
        ]);

        $employee = User::where('tbl_users.employee_id', $employeeId)
            ->first();

        $employee->update([
            'password' => bcrypt(strtoupper($validated['password']))
        ]);

        return response()->json([
            'message' => 'EMPLOYEE PASSWORD SUCCESSFULLY UPDATED.'
        ], 200);
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
            'message' => 'EMPLOYEE SUCCESSFULLY DELETED.'
        ], 200);
    }
}
