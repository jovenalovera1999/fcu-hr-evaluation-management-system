<?php

use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\AdminDashboard;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\EvaluationController;
use App\Http\Controllers\Api\PositionController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\ResponseController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\SemesterController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::controller(UserController::class)->prefix('user')->group(function () {
    Route::post('/process/login', 'processLogin');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(UserController::class)->prefix('user')->group(function () {
        Route::post('/process/logout', 'processLogout');
    });

    Route::controller(AdminDashboard::class)->prefix('dashboard/admin')->group(function () {
        Route::get('/load/statistics/by/academic_year/and/semester/{academicYearId}/{semesterId}', 'statistics');
    });

    Route::controller(EmployeeController::class)->prefix('employee')->group(function () {
        Route::get('/index/by/department/{departmentId}', 'indexByDepartment');
        Route::get('/get/employee/{employeeId}', 'getEmployee');
        Route::post('/store', 'store');
        Route::put('/update/{employeeId}', 'updateEmployee');
        Route::put('/update/password/{employeeId}', 'updatePassword');
        Route::put('/delete/{employeeId}', 'deleteEmployee');
    });

    Route::controller(AcademicYearController::class)->prefix('academic_year')->group(function () {
        Route::get('/index', 'index');
    });

    Route::controller(PositionController::class)->prefix('position')->group(function () {
        Route::get('/index', 'index');
    });

    Route::controller(DepartmentController::class)->prefix('department')->group(function () {
        Route::get('/index', 'index');
    });

    Route::controller(CourseController::class)->prefix('course')->group(function () {
        Route::get('/index/{departmentId}', 'index');
    });

    Route::controller(StudentController::class)->prefix('student')->group(function () {
        Route::get('/load/students/by/year_level/and/department/{yearLevel}/{departmentId}', 'loadStudentsByYearLevelAndDepartment');
        Route::get('/load/irregular/students/by/page', 'loadIrregularStudentsByPage');
        Route::get('/load/irregular/students/by/page/and/search', 'loadIrregularStudentsByPageAndSearch');
        Route::get('/load/irregular/student/ids', 'loadIrregularStudentIds');
        Route::get('/load/irregular/student/ids/by/search', 'loadIrregularStudentIdsBySearch');
        Route::get('/get/student/{studentId}', 'getStudent');
        Route::post('/store', 'store');
        Route::put('/update/{studentId}', 'updateStudent');
        Route::put('/delete/{studentId}', 'deleteStudent');
    });

    Route::controller(CategoryController::class)->prefix('category')->group(function () {
        Route::get('/index', 'index');
        Route::post('/store', 'storeCategory');
        Route::put('/update/{categoryId}', 'updateCategory');
        Route::put('/delete/{categoryId}', 'deleteCategory');
    });

    Route::controller(QuestionController::class)->prefix('question')->group(function () {
        Route::get('/index', 'index');
        Route::post('/store', 'store');
    });

    Route::controller(EvaluationController::class)->prefix('evaluation')->group(function () {
        Route::get('/index/{studentId}/{employeeId}', 'index');
        Route::post('/store/evaluations/for/students', 'storeEvaluationsForStudents');
        Route::post('/send/evaluations/for/irregular/students', 'sendEvaluationsForIrregularStudents');
        Route::post('/store/evaluation/for/employees', 'storeEvaluationsForEmployees');
    });

    Route::controller(ResponseController::class)->prefix('response')->group(function () {
        Route::get('/index', 'index');
        Route::get('/index/{categoryId}', 'indexByCategories');
        Route::get('/load/results/{semesterId}', 'loadResults');
        Route::get('/load/summary/{employeeId}/{semesterId}', 'loadResponseSummary');
        Route::get('/load/response/answers/{employeeId}/{semesterId}/{categoryId}', 'loadResponseAnswers');
        Route::get('/show/{evaluationId}', 'show');
        Route::put('/update/{evaluationId}', 'update');
    });

    Route::controller(SectionController::class)->prefix('section')->group(function () {
        Route::get('/load/sections/by/course/{courseId}', 'loadSectionsByCourse');
    });

    Route::controller(SemesterController::class)->prefix('semester')->group(function () {
        Route::get('/load/semesters/by/academic_year/{academicYearId}', 'loadSemestersByAcademicYear');
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
});
