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
            $table->unsignedBigInteger('evaluation_id');
            $table->unsignedBigInteger('question_id');
            $table->tinyInteger('poor')->default(0);
            $table->tinyInteger('mediocre')->default(0);
            $table->tinyInteger('satisfactory')->default(0);
            $table->tinyInteger('good')->default(0);
            $table->tinyInteger('excellent')->default(0);
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();

            $table->foreign('evaluation_id')
                ->references('evaluation_id')
                ->on('tbl_evaluations')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('question_id')
                ->references('question_id')
                ->on('tbl_questions')
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
        Schema::dropIfExists('tbl_responses');
        Schema::enableForeignKeyConstraints();
    }
};
