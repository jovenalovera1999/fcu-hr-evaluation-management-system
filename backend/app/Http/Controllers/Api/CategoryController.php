<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
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
}
