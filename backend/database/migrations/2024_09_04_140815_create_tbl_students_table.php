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
        Schema::create('tbl_students', function (Blueprint $table) {
            $table->id('student_id');
            $table->string('student_no');
            $table->string('first_name', 55);
            $table->string('middle_name', 55)->nullable();
            $table->string('last_name', 55);
            $table->string('suffix_name', 55)->nullable();
            $table->unsignedBigInteger('department_id');
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('section_id');
            $table->integer('year_level')->default(0);
            $table->tinyInteger('is_irregular')->default(false);
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('department_id')
                ->references('department_id')
                ->on('tbl_departments')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('course_id')
                ->references('course_id')
                ->on('tbl_courses')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('section_id')
                ->references('section_id')
                ->on('tbl_sections')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_students');
        Schema::enableForeignKeyConstraints();
    }
};
