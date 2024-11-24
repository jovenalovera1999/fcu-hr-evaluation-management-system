<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function updatePassword(Request $request, $userId)
    {
        $validated = $request->validate([
            "password" => ["required", "max:15", "confirmed"],
            "password_confirmation" => ["required"],
            "current_password" => ["required"]
        ]);

        $user = User::find($userId);

        if (Hash::check(strtoupper($validated["current_password"]), $user->password)) {
            $user->update([
                "password" => bcrypt(strtoupper($validated["password"]))
            ]);

            return response()->json([
                "status" => 200
            ]);
        }
    }

    public function processLogin(Request $request)
    {
        $validated = $request->validate([
            "username" => ["required", "min:3", "max:12"],
            "password" => ["required", "min:3", "max:15"]
        ]);

        $userEmployee = User::leftJoin("tbl_employees", "tbl_users.employee_id", "=", "tbl_employees.employee_id")
            ->leftJoin("tbl_positions", "tbl_employees.position_id", "=", "tbl_positions.position_id")
            ->where("tbl_users.username", $validated["username"])
            ->where("tbl_employees.is_deleted", false)
            ->where("tbl_users.is_deleted", false)
            ->first();

        $userStudent = User::leftJoin("tbl_students", "tbl_users.student_id", "=", "tbl_students.student_id")
            ->where("tbl_users.username", $validated["username"])
            ->where("tbl_students.is_deleted", false)
            ->where("tbl_users.is_deleted", false)
            ->first();

        $validated["username"] = strtoupper($validated["username"]);
        $validated["password"] = strtoupper($validated["password"]);

        if ($userEmployee && Auth::attempt($validated)) {
            Auth::login($userEmployee);
            $token = Auth::user()->createToken("EmployeeToken")->plainTextToken;

            return response()->json([
                "user" => $userEmployee,
                "token" => $token,
                "status" => 200
            ]);
        } else if ($userStudent && Auth::attempt($validated)) {
            Auth::login($userStudent);
            $token = Auth::user()->createToken("StudentToken")->plainTextToken;

            return response()->json([
                "user" => $userStudent,
                "token" => $token,
                "status" => 200
            ]);
        }
    }

    public function processLogout(Request $request)
    {
        $request->user()->tokens()->delete();

        Auth::guard("web")->logout();

        return response()->json([
            "status" => 200
        ]);
    }
}
