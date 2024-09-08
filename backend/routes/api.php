<?php

use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\PositionController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\StudentController;
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

Route::controller(EmployeeController::class)->prefix('employee')->group(function () {
    Route::get('/index', 'index');
    Route::get('/index/by/department/{departmentId}', 'indexByDepartment');
    Route::post('/store', 'store');
});

Route::controller(StudentController::class)->prefix('student')->group(function () {
    Route::get('/index', 'index');
    Route::post('/store', 'store');
});

Route::controller(CategoryController::class)->prefix('category')->group(function () {
    Route::get('/index', 'index');
});

Route::controller(QuestionController::class)->prefix('question')->group(function () {
    Route::get('/index', 'index');
    Route::post('/store', 'store');
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
