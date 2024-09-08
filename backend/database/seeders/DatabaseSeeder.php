<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\AcademicYear;
use App\Models\Category;
use App\Models\Course;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\Student;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        AcademicYear::factory()->createMany([
            ['academic_year' => '2022-2023'],
            ['academic_year' => '2023-2024']
        ]);

        Position::factory()->createMany([
            ['position' => 'STAFF'],
            ['position' => 'FULL-TIME FACULTY'],
            ['position' => 'PART-TIME FACULTY']
        ]);

        Department::factory()->createMany([
            ['department' => 'CCS'],
            ['department' => 'ECE'],
            ['department' => 'CTE'],
            ['department' => 'CHRMT'],
            ['department' => 'CN'],
            ['department' => 'CBA'],
            ['department' => 'CAS']
        ]);

        Course::factory()->createMany([
            ['department_id' => 1, 'course' => 'BSIT'],
            ['department_id' => 1, 'course' => 'BSCS'],
            ['department_id' => 2, 'course' => 'BSEE'],
            ['department_id' => 3, 'course' => 'BSM'],
            ['department_id' => 3, 'course' => 'BSF'],
            ['department_id' => 3, 'course' => 'BSE'],
            ['department_id' => 4, 'course' => 'BSHM'],
            ['department_id' => 4, 'course' => 'BSRM'],
            ['department_id' => 5, 'course' => 'BSN'],
            ['department_id' => 6, 'course' => 'BSBA'],
            ['department_id' => 7, 'course' => 'BSA'],
            ['department_id' => 7, 'course' => 'BSP']
        ]);

        Category::factory()->createMany([
            ['category' => 'TEACHING EFFECTIVENESS'],
            ['category' => 'COMMUNICATION SKILLS'],
            ['category' => 'CLASSROOM MANAGEMENT'],
            ['category' => 'SUBJECT KNOWLEDGE'],
            ['category' => 'STUDENT SUPPORT'],
            ['category' => 'PROFESSIONALISM']
        ]);

        Employee::factory(200)->create();
        Student::factory(500)->create();
    }
}
