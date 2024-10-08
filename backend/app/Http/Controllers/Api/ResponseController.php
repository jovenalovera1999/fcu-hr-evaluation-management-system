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
        $categories = Category::where('tbl_categories.is_deleted', false)
            ->get();

        return response()->json([
            'categories' => $categories,
            'status' => 200
        ]);
    }

    public function indexByCategories($categoryId)
    {
        $questions = Question::where('tbl_questions.category_id', $categoryId)
            ->where('tbl_questions.is_deleted', false)
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

    public function update(Request $request, $evaluationId)
    {
        foreach ($request->answers as $question_id => $answer) {
            $response = Response::where('tbl_responses.evaluation_id', $evaluationId)
                ->where('tbl_responses.question_id', $question_id)
                ->first();

            if ($response) {
                $response->poor = false;
                $response->mediocre = false;
                $response->satisfactory = false;
                $response->good = false;
                $response->excellent = false;

                switch ($answer) {
                    case 'poor':
                        $response->poor = true;
                        break;
                    case 'mediocre':
                        $response->mediocre = true;
                        break;
                    case 'satisfactory':
                        $response->satisfactory = true;
                        break;
                    case 'good':
                        $response->good = true;
                        break;
                    case 'excellent':
                        $response->excellent = true;
                        break;
                }

                $response->save();
            }
        }

        $evaluation = Evaluation::find($evaluationId);

        $evaluation->update([
            'is_completed' => true
        ]);

        return response()->json([
            'status' => 200
        ]);
    }
}
