<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Evaluation;
use App\Models\Question;
use App\Models\Response;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Exists;

class ResponseController extends Controller
{
    public function index()
    {
        $categories = Category::where('tbl_categories.is_deleted', 0)
            ->get();

        return response()->json([
            'categories' => $categories,
            'status' => 200
        ]);
    }

    public function indexByCategories($categoryId)
    {
        $questions = Question::where('tbl_questions.category_id', $categoryId)
            ->where('tbl_questions.is_deleted', 0)
            ->get();

        return response()->json([
            'questions' => $questions,
            'status' => 200
        ]);
    }

    public function show($evaluationId)
    {
        $evaluation = Evaluation::leftJoin('tbl_employees', 'tbl_evaluations.employee_to_evaluate_id', '=', 'tbl_employees.employee_id')
            ->leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
            ->leftJoin('tbl_positions', 'tbl_employees.position_id', '=', 'tbl_positions.position_id')
            ->find($evaluationId);

        return response()->json([
            'evaluation' => $evaluation,
            'status' => 200
        ]);
    }

    public function update(Request $request, Evaluation $evaluationId)
    {
        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required', Rule::exists('tbl_questions', 'tbl_questions.question_id')],
            'answers.*.poor' => ['required', 'boolean'],
            'answers.*.mediocre' => ['required', 'boolean'],
            'answers.*.satisfactory' => ['required', 'boolean'],
            'answers.*.good' => ['required', 'boolean'],
            'answers.*.excellent' => ['required', 'boolean']
        ]);
    }
}
