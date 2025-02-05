<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function loadQuestions(Request $request)
    {
        $questions = '';

        if ($request->has('categoryId') && $request->has('positionId')) {
            $categoryId = $request->input('categoryId');
            $positionId = $request->input('positionId');

            $questions = Question::leftJoin('tbl_categories', 'tbl_questions.category_id', '=', 'tbl_categories.category_id')
                ->leftJoin('tbl_positions', 'tbl_questions.position_id', '=', 'tbl_positions.position_id')
                ->where('tbl_questions.category_id', $categoryId)
                ->where('tbl_questions.position_id', $positionId)
                ->where('tbl_questions.is_deleted', false)
                ->orderBy('tbl_categories.category', 'asc')
                ->orderBy('tbl_positions.position', 'asc')
                ->paginate(10);
        } else if ($request->has('positionId')) {
            $positionId = $request->input('positionId');

            $questions = Question::leftJoin('tbl_categories', 'tbl_questions.category_id', '=', 'tbl_categories.category_id')
                ->leftJoin('tbl_positions', 'tbl_questions.position_id', '=', 'tbl_positions.position_id')
                ->where('tbl_questions.position_id', $positionId)
                ->where('tbl_questions.is_deleted', false)
                ->orderBy('tbl_categories.category', 'asc')
                ->orderBy('tbl_positions.position', 'asc')
                ->paginate(10);
        } else if ($request->has('categoryId')) {
            $categoryId = $request->input('categoryId');

            $questions = Question::leftJoin('tbl_categories', 'tbl_questions.category_id', '=', 'tbl_categories.category_id')
                ->leftJoin('tbl_positions', 'tbl_questions.position_id', '=', 'tbl_positions.position_id')
                ->where('tbl_questions.category_id', $categoryId)
                ->where('tbl_questions.is_deleted', false)
                ->orderBy('tbl_categories.category', 'asc')
                ->orderBy('tbl_positions.position', 'asc')
                ->paginate(10);
        } else {
            $questions = Question::leftJoin('tbl_categories', 'tbl_questions.category_id', '=', 'tbl_categories.category_id')
                ->leftJoin('tbl_positions', 'tbl_questions.position_id', '=', 'tbl_positions.position_id')
                ->where('tbl_questions.is_deleted', false)
                ->orderBy('tbl_categories.category', 'asc')
                ->orderBy('tbl_positions.position', 'asc')
                ->paginate(10);
        }

        return response()->json([
            'questions' => $questions
        ], 200);
    }

    // public function loadQuestionsByyCategory(Request $request)
    // {
    //     $categoryId = $request->input('categoryId');

    //     $questions = Question::leftJoin('tbl_categories', 'tbl_questions.category_id', '=', 'tbl_categories.category_id')
    //         ->leftJoin('tbl_positions', 'tbl_questions.position_id', '=', 'tbl_positions.position_id')
    //         ->where('tbl_questions.category_id', $categoryId)
    //         ->where('tbl_questions.is_deleted', false)
    //         ->orderBy('tbl_categories.category', 'asc')
    //         ->orderBy('tbl_positions.position', 'asc')
    //         ->paginate(10);

    //     return response()->json([
    //         'questions' => $questions
    //     ], 200);
    // }

    // public function loadQuestionsByPosition(Request $request)
    // {
    //     $positionId = $request->input('positionId');

    //     $questions = Question::leftJoin('tbl_categories', 'tbl_questions.category_id', '=', 'tbl_categories.category_id')
    //         ->leftJoin('tbl_positions', 'tbl_questions.position_id', '=', 'tbl_positions.position_id')
    //         ->where('tbl_questions.position_id', $positionId)
    //         ->where('tbl_questions.is_deleted', false)
    //         ->orderBy('tbl_categories.category', 'asc')
    //         ->orderBy('tbl_positions.position', 'asc')
    //         ->paginate(10);

    //     return response()->json([
    //         'questions' => $questions
    //     ], 200);
    // }

    // public function loadQuestionsByCategoryAndPosition(Request $request)
    // {

    //     $categoryId = $request->input('categoryId');
    //     $positionId = $request->input('positionId');

    //     $questions = Question::leftJoin('tbl_categories', 'tbl_questions.category_id', '=', 'tbl_categories.category_id')
    //         ->leftJoin('tbl_positions', 'tbl_questions.position_id', '=', 'tbl_positions.position_id')
    //         ->where('tbl_questions.category_id', $categoryId)
    //         ->where('tbl_questions.position_id', $positionId)
    //         ->where('tbl_questions.is_deleted', false)
    //         ->orderBy('tbl_categories.category', 'asc')
    //         ->orderBy('tbl_positions.position', 'asc')
    //         ->paginate(10);

    //     return response()->json([
    //         'questions' => $questions
    //     ], 200);
    // }

    public function index()
    {
        $questions = Question::leftJoin("tbl_categories", "tbl_questions.category_id", "=", "tbl_categories.category_id")
            ->leftJoin('tbl_positions', 'tbl_questions.position_id', '=', 'tbl_positions.position_id')
            ->where("tbl_questions.is_deleted", false)
            ->orderBy("tbl_categories.category", "asc")
            ->orderBy('tbl_positions.position', 'asc')
            ->paginate(10);

        return response()->json([
            "questions" => $questions
        ], 200);
    }

    public function loadQuestionsByCategory($categoryId, $position)
    {
        $questions = Question::leftJoin('tbl_positions', 'tbl_questions.position_id', '=', 'tbl_positions.position_id')
            ->where('tbl_positions.position', strtoupper($position))
            ->where("tbl_questions.category_id", $categoryId)
            ->where("tbl_questions.is_deleted", false)
            ->get();

        return response()->json([
            "questions" => $questions,
            "status" => 200
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "category" => ["required"],
            "question" => ["required"],
            'position' => ['required']
        ]);

        Question::create([
            "category_id" => $validated["category"],
            "question" => strtoupper($validated["question"]),
            'position_id' => $validated['position']
        ]);

        return response()->json([
            "status" => 200
        ]);
    }

    public function updateQuestion(Request $request, $questionId)
    {
        $requestValidated = $request->validate([
            "category" => ["required"],
            "question" => ["required"],
            'position' => ['required']
        ]);

        $question = Question::find($questionId);

        $question->update([
            'category_id' => $requestValidated['category'],
            'question' => strtoupper($requestValidated['question']),
            'position_id' => $requestValidated['position']
        ]);

        return response()->json([
            'message' => 'QUESTION SUCCESSFULLY UPDATED.'
        ], 200);
    }

    public function destroyQuestion($questionId)
    {
        $question = Question::find($questionId);

        $question = $question->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'QUESTION SUCCESSFULLY DELETED.'
        ], 200);
    }
}
