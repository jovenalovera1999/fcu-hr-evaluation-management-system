<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function processLogin(Request $request)
    {
        $validated = $request->validate([
            'username' => ['required', 'min:3', 'max:12'],
            'password' => ['required', 'min:3', 'max:15']
        ]);

        $userEmployee = User::leftJoin('tbl_employees', 'tbl_users.employee_id', '=', 'tbl_employees.employee_id')
            ->where('tbl_users.username', $validated['username'])
            ->where('tbl_employees.is_deleted', 0)
            ->where('tbl_users.is_deleted', 0)
            ->first();

        if ($userEmployee && Auth::attempt($validated)) {
            Auth::login($userEmployee);
            $token = $userEmployee->createToken('EmployeeToken')->plainTextToken;

            return response()->json([
                'user' => $userEmployee,
                'token' => $token,
                'status' => 200
            ]);
        }
    }
}
