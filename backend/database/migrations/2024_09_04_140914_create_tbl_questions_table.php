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
        Schema::create('tbl_questions', function (Blueprint $table) {
            $table->id('question_id');
            $table->unsignedBigInteger('category_id');
            $table->string('question', 255);
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();

            $table->foreign('category_id')
                ->references('category_id')
                ->on('tbl_categories')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_questions');
    }
};
