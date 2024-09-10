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
        Schema::create('tbl_users', function (Blueprint $table) {
            $table->id('user_id');
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->unsignedBigInteger('student_id')->nullable();
            $table->string('username', 55);
            $table->string('password', 255);
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();

            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('tbl_employees')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('student_id')
                ->references('student_id')
                ->on('tbl_students')
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
        Schema::dropIfExists('tbl_users');
        Schema::enableForeignKeyConstraints();
    }
};
