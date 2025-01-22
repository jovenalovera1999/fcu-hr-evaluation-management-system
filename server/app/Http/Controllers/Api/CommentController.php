<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function loadCommentsByEmployeeAndSemester($employeeId, $semesterId)
    {
        $comments = Comment::leftJoin('tbl_evaluations', 'tbl_comments.evaluation_id', '=', 'tbl_evaluations.evaluation_id')
            ->where('tbl_evaluations.employee_to_evaluate_id', $employeeId)
            ->where('tbl_evaluations.semester_id', $semesterId)
            ->get();

        return response()->json([
            'comments' => $comments
        ], 200);
    }
}
