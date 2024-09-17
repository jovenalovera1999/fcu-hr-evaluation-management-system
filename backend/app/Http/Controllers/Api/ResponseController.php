<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Question;
use Illuminate\Http\Request;

class ResponseController extends Controller
{
    public function index()
    {
        $categories = Category::all();

        $categoriesWithQuestions = [];

        foreach ($categories as $category) {
            $questions = Question::leftJoin('tbl_categories', 'tbl_questions.category_id', '=', 'tbl_categories.category_id')
                ->where('tbl_questions.category_id', $category->category_id)
                ->where('tbl_questions.is_deleted', 0)
                ->get();

            $categoriesWithQuestions[] = ['category' => $category, 'questions' => $questions];
        }

        return response()->json([
            'categoriesWithQuestions' => $categoriesWithQuestions,
            'status' => 200
        ]);
    }
}
