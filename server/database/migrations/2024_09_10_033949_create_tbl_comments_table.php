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
        Schema::create('tbl_comments', function (Blueprint $table) {
            $table->id('comment_id');
            $table->unsignedBigInteger('evaluation_id');
            $table->text('comment');
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('evaluation_id')
                ->references('evaluation_id')
                ->on('tbl_evaluations')
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
        Schema::dropIfExists('tbl_comments');
        Schema::enableForeignKeyConstraints();
    }
};
