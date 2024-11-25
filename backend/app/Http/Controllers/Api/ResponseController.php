<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Evaluation;
use App\Models\Question;
use App\Models\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function loadResults($semesterId)
    {
        $results = Evaluation::select(
            'tbl_employees.employee_id',
            'tbl_employees.first_name',
            'tbl_employees.last_name',
            'tbl_positions.position',
            'tbl_departments.department'
        )
            ->leftJoin('tbl_employees', 'tbl_evaluations.employee_to_evaluate_id', '=', 'tbl_employees.employee_id')
            ->leftJoin('tbl_positions', 'tbl_employees.position_id', '=', 'tbl_positions.position_id')
            ->leftJoin('tbl_departments', 'tbl_employees.department_id', '=', 'tbl_departments.department_id')
            ->where('tbl_evaluations.semester_id', $semesterId)
            ->where('tbl_evaluations.is_cancelled', false)
            ->where('tbl_evaluations.is_completed', true)
            ->distinct()
            ->get();

        return response()->json([
            'results' => $results,
            'status' => 200
        ]);
    }

    public function loadResponseSummary($employeeId, $semesterId)
    {

        $summary = Response::select(
            DB::raw('SUM(CASE WHEN tbl_responses.poor = TRUE THEN 1 ELSE 0 END) AS poor'),
            DB::raw('SUM(CASE WHEN tbl_responses.unsatisfactory = TRUE THEN 1 ELSE 0 END) AS unsatisfactory'),
            DB::raw('SUM(CASE WHEN tbl_responses.satisfactory = TRUE THEN 1 ELSE 0 END) AS satisfactory'),
            DB::raw('SUM(CASE WHEN tbl_responses.very_satisfactory = TRUE THEN 1 ELSE 0 END) AS very_satisfactory'),
            DB::raw('SUM(CASE WHEN tbl_responses.outstanding = TRUE THEN 1 ELSE 0 END) AS outstanding')
        )
            ->leftJoin('tbl_evaluations', 'tbl_responses.evaluation_id', '=', 'tbl_evaluations.evaluation_id')
            ->where('tbl_evaluations.employee_to_evaluate_id', $employeeId)
            ->where('tbl_evaluations.semester_id', $semesterId)
            ->where('tbl_responses.is_deleted', false)
            ->first();

        return response()->json([
            'summary' => $summary,
            'status' => 200
        ]);
    }

    public function loadResponseAnswers($employeeId, $semesterId, $categoryId)
    {
        $responses = Response::select(
            'tbl_questions.question',
            DB::raw('SUM(CASE WHEN tbl_responses.poor = TRUE THEN 1 ELSE 0 END) AS question_poor'),
            DB::raw('SUM(CASE WHEN tbl_responses.unsatisfactory = TRUE THEN 1 ELSE 0 END) AS question_unsatisfactory'),
            DB::raw('SUM(CASE WHEN tbl_responses.satisfactory = TRUE THEN 1 ELSE 0 END) AS question_satisfactory'),
            DB::raw('SUM(CASE WHEN tbl_responses.very_satisfactory = TRUE THEN 1 ELSE 0 END) AS question_very_satisfactory'),
            DB::raw('SUM(CASE WHEN tbl_responses.outstanding = TRUE THEN 1 ELSE 0 END) AS question_outstanding')
        )
            ->leftJoin('tbl_questions', 'tbl_responses.question_id', '=', 'tbl_questions.question_id')
            ->leftJoin('tbl_evaluations', 'tbl_responses.evaluation_id', '=', 'tbl_evaluations.evaluation_id')
            ->where('tbl_evaluations.employee_to_evaluate_id', $employeeId)
            ->where('tbl_evaluations.semester_id', $semesterId)
            ->where('tbl_questions.category_id', $categoryId)
            ->where('tbl_questions.is_deleted', false)
            ->groupBy(
                'tbl_questions.question'
            )
            ->get();

        return response()->json([
            'responses' => $responses,
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
                $response->unsatisfactory = false;
                $response->satisfactory = false;
                $response->very_satisfactory = false;
                $response->outstanding = false;

                switch ($answer) {
                    case 'poor':
                        $response->poor = true;
                        break;
                    case 'unsatisfactory':
                        $response->unsatisfactory = true;
                        break;
                    case 'satisfactory':
                        $response->satisfactory = true;
                        break;
                    case 'very_satisfactory':
                        $response->very_satisfactory = true;
                        break;
                    case 'outstanding':
                        $response->outstanding = true;
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
