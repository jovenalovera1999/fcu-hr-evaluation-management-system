<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('tbl_categories.is_deleted', false)
            ->get();

        return response()->json([
            'categories' => $categories,
            'status' => 200
        ], 200);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'category' => ['required']
        ]);

        Category::create([
            'category' => strtoupper($validated['category'])
        ]);

        return response()->json([
            'message' => 'Category Added Successfully.',
        ], 200);
    }

    public function updateCategory(Request $request, $categoryId)
    {
        $validated = $request->validate([
            'category' => ['required']
        ]);

        $category = Category::find($categoryId);

        $category->update([
            'category' => strtoupper($validated['category'])
        ]);

        return response()->json([
            'message' => 'Category Updated Successfully.',
        ], 200);
    }

    public function destroyCategory($categoryId)
    {
        $category = Category::find($categoryId);

        $category->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'CATEGORY SUCCESSFULLY DELETED.'
        ], 200);
    }
}
