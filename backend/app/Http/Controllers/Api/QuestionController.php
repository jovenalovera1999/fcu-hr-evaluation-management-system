<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::leftJoin("tbl_categories", "tbl_questions.category_id", "=", "tbl_categories.category_id")
            ->where("tbl_questions.is_deleted", false)
            ->orderBy("tbl_categories.category", "asc")
            ->get();

        return response()->json([
            "questions" => $questions,
            "status" => 200
        ]);
    }

    public function loadQuestionsByCategory($categoryId)
    {
        $questions = Question::where("tbl_questions.category_id", $categoryId)
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
            "question" => ["required"]
        ]);

        Question::create([
            "category_id" => $validated["category"],
            "question" => strtoupper($validated["question"])
        ]);

        return response()->json([
            "status" => 200
        ]);
    }
}
