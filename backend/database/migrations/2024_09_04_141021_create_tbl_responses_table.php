<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_responses', function (Blueprint $table) {
            $table->id('response_id');
            $table->unsignedBigInteger('student_id')->default(0);
            $table->unsignedBigInteger('employee_id')->default(0);
            $table->unsignedBigInteger('question_id')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_responses');
    }
};
