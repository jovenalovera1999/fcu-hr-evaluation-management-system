<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Position;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    public function index()
    {
        $positions = Position::where('tbl_positions.is_deleted', false)
            ->orderBy('tbl_positions.position', 'asc')
            ->get();

        return response()->json([
            'positions' => $positions,
            'status' => 200
        ]);
    }
}
