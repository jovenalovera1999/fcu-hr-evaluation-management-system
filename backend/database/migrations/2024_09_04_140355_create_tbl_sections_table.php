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
        Schema::create('tbl_sections', function (Blueprint $table) {
            $table->id('section_id');
            $table->unsignedBigInteger('course_id');
            $table->string('section');
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('course_id')
                ->references('course_id')
                ->on('tbl_courses')
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
        Schema::dropIfExists('tbl_sections');
        Schema::enableForeignKeyConstraints();
    }
};
