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
        Schema::create('tbl_evaluations', function (Blueprint $table) {
            $table->id('evaluation_id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('employee_id');
            $table->unsignedBigInteger('academic_year_id');
            $table->tinyInteger('is_completed')->default(0);
            $table->timestamps();

            $table->foreign('student_id')
                ->references('student_id')
                ->on('tbl_students')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('tbl_employees')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('academic_year_id')
                ->references('academic_year_id')
                ->on('tbl_academic_years')
                ->onUpdate('cascade')
                ->onDelete('cascade');
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
