<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function loadSectionsByCourse($courseId)
    {
        $sections = Section::where('tbl_sections.course_id', $courseId)
            ->where('tbl_sections.is_deleted', false)
            ->get();

        return response()->json([
            'sections' => $sections,
            'status' => 200
        ]);
    }
}
