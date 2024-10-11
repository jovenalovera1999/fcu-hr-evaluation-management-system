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
        Schema::create('tbl_semesters', function (Blueprint $table) {
            $table->id('semester_id');
            $table->unsignedBigInteger('academic_year_id');
            $table->string('semester');
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('academic_year_id')
                ->references('academic_year_id')
                ->on('tbl_academic_years')
                ->onUpdate('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_semesters');
    }
};
