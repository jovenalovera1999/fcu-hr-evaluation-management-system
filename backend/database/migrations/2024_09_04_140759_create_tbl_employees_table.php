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
        Schema::create('tbl_employees', function (Blueprint $table) {
            $table->id('employee_id');
            $table->string('first_name', 55);
            $table->string('middle_name', 55)->nullable();
            $table->string('last_name', 55);
            $table->string('suffix_name', 55)->nullable();
            $table->unsignedBigInteger('position_id')->default(0);
            $table->unsignedBigInteger('department_id')->default(0);
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();

            $table->foreign('position_id')
                ->references('position_id')
                ->on('tbl_positions')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('department_id')
                ->references('department_id')
                ->on('tbl_departments')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_employees');
    }
};
