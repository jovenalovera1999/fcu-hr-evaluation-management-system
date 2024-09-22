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

    public function update(Request $request)
    {
        $questions = Question::leftJoin('tbl_responses', 'tbl_questions.question_id', '=', 'tbl_responses.question_id')
            ->where('tbl_responses.evaluation_id', $request->evaluation_id)
            ->get();

        foreach ($request->answers as $question_id => $answer) {
            $response = Response::where('tbl_responses.evaluation_id', $request->evaluation_id)
                ->where('tbl_responses.question_id', $question_id)
                ->first();

            if ($response) {
                $response->poor = 0;
                $response->mediocre = 0;
                $response->satisfactory = 0;
                $response->good = 0;
                $response->excellent = 0;

                switch ($answer) {
                    case 'poor':
                        $response->poor = 1;
                        break;
                    case 'mediocre':
                        $response->mediocre = 1;
                        break;
                    case 'satisfactory':
                        $response->satisfactory = 1;
                        break;
                }
            }
        }

        return response()->json([
            'status' => 200
        ]);
    }
}
