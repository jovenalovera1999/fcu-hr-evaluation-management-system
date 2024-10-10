<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\AcademicYear;
use App\Models\Category;
use App\Models\Course;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\Question;
use App\Models\Section;
use App\Models\Student;
use App\Models\User;
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
            ['position' => 'ADMIN'],
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

        Section::factory()->createMany([
            ['course_id' => 1, 'section' => 'A'],
            ['course_id' => 1, 'section' => 'B'],
            ['course_id' => 1, 'section' => 'C'],
            ['course_id' => 1, 'section' => 'D'],
            ['course_id' => 1, 'section' => 'E'],
            ['course_id' => 2, 'section' => 'A'],
            ['course_id' => 2, 'section' => 'B'],
            ['course_id' => 2, 'section' => 'C'],
            ['course_id' => 2, 'section' => 'D'],
            ['course_id' => 2, 'section' => 'E'],
            ['course_id' => 3, 'section' => 'A'],
            ['course_id' => 3, 'section' => 'B'],
            ['course_id' => 3, 'section' => 'C'],
            ['course_id' => 3, 'section' => 'D'],
            ['course_id' => 3, 'section' => 'E'],
            ['course_id' => 4, 'section' => 'A'],
            ['course_id' => 4, 'section' => 'B'],
            ['course_id' => 4, 'section' => 'C'],
            ['course_id' => 4, 'section' => 'D'],
            ['course_id' => 4, 'section' => 'E'],
            ['course_id' => 5, 'section' => 'A'],
            ['course_id' => 5, 'section' => 'B'],
            ['course_id' => 5, 'section' => 'C'],
            ['course_id' => 5, 'section' => 'D'],
            ['course_id' => 5, 'section' => 'E'],
            ['course_id' => 6, 'section' => 'A'],
            ['course_id' => 6, 'section' => 'B'],
            ['course_id' => 6, 'section' => 'C'],
            ['course_id' => 6, 'section' => 'D'],
            ['course_id' => 6, 'section' => 'E'],
            ['course_id' => 7, 'section' => 'A'],
            ['course_id' => 7, 'section' => 'B'],
            ['course_id' => 7, 'section' => 'C'],
            ['course_id' => 7, 'section' => 'D'],
            ['course_id' => 7, 'section' => 'E'],
            ['course_id' => 8, 'section' => 'A'],
            ['course_id' => 8, 'section' => 'B'],
            ['course_id' => 8, 'section' => 'C'],
            ['course_id' => 8, 'section' => 'D'],
            ['course_id' => 8, 'section' => 'E'],
            ['course_id' => 9, 'section' => 'A'],
            ['course_id' => 9, 'section' => 'B'],
            ['course_id' => 9, 'section' => 'C'],
            ['course_id' => 9, 'section' => 'D'],
            ['course_id' => 9, 'section' => 'E'],
            ['course_id' => 10, 'section' => 'A'],
            ['course_id' => 10, 'section' => 'B'],
            ['course_id' => 10, 'section' => 'C'],
            ['course_id' => 10, 'section' => 'D'],
            ['course_id' => 10, 'section' => 'E'],
            ['course_id' => 11, 'section' => 'A'],
            ['course_id' => 11, 'section' => 'B'],
            ['course_id' => 11, 'section' => 'C'],
            ['course_id' => 11, 'section' => 'D'],
            ['course_id' => 11, 'section' => 'E'],
            ['course_id' => 12, 'section' => 'A'],
            ['course_id' => 12, 'section' => 'B'],
            ['course_id' => 12, 'section' => 'C'],
            ['course_id' => 12, 'section' => 'D'],
            ['course_id' => 12, 'section' => 'E'],
        ]);

        Category::factory()->createMany([
            ['category' => 'TEACHING EFFECTIVENESS'],
            ['category' => 'COMMUNICATION SKILLS'],
            ['category' => 'CLASSROOM MANAGEMENT'],
            ['category' => 'SUBJECT KNOWLEDGE'],
            ['category' => 'STUDENT SUPPORT'],
            ['category' => 'PROFESSIONALISM']
        ]);

        Question::factory()->createMany([
            ['category_id' => 1, 'question' => strtoupper('How effectively does the teacher deliver course material?')],
            ['category_id' => 1, 'question' => strtoupper('How well does the teacher explain complex concepts?')],
            ['category_id' => 1, 'question' => strtoupper('How organized and prepared is the teacher for each class?')],
            ['category_id' => 1, 'question' => strtoupper('How well does the teacher engage students in the learning process?')],
            ['category_id' => 2, 'question' => strtoupper('How clear is the teacher in communicating instructions and expectations?')],
            ['category_id' => 2, 'question' => strtoupper('How effectively does the teacher respond to student questions and concerns?')],
            ['category_id' => 2, 'question' => strtoupper('How well does the teacher encourage open communication and participation?')],
            ['category_id' => 3, 'question' => strtoupper('How well does the teacher maintain a positive and respectful classroom environment?')],
            ['category_id' => 3, 'question' => strtoupper('How effectively does the teacher manage classroom time and activities?')],
            ['category_id' => 3, 'question' => strtoupper('How fair and consistent is the teacher in enforcing rules and discipline?')],
            ['category_id' => 4, 'question' => strtoupper('How knowledgeable does the teacher appear about the subject matter?')],
            ['category_id' => 4, 'question' => strtoupper('How well does the teacher incorporate current developments and examples in the subject area?')],
            ['category_id' => 4, 'question' => strtoupper('How effectively does the teacher answer student questions related to the subject?')],
            ['category_id' => 5, 'question' => strtoupper('How approachable is the teacher outside of class for additional help?')],
            ['category_id' => 5, 'question' => strtoupper('How effectively does the teacher provide feedback on assignments and assessments?')],
            ['category_id' => 5, 'question' => strtoupper('How well does the teacher support student learning and development?')],
            ['category_id' => 6, 'question' => strtoupper('How punctual and reliable is the teacher in starting and ending classes on time?')],
            ['category_id' => 6, 'question' => strtoupper('How respectful and fair is the teacher towards all students?')],
            ['category_id' => 6, 'question' => strtoupper('How effectively does the teacher adhere to the course syllabus and schedule?')]
        ]);

        // Employee::factory()->create([
        //     'first_name' => 'ADMIN',
        //     'middle_name' => 'ADMIN',
        //     'last_name' => 'ADMIN',
        //     'suffix_name' => 'ADMIN',
        //     'position_id' => 1,
        //     'department_id' => 1
        // ]);

        // $user = User::factory()->create([
        //     'employee_id' => 1,
        //     'student_id' => null,
        //     'username' => null,
        //     'password' => bcrypt('ADMIN')
        // ]);

        // $user->createToken('AdminToken')->plainTextToken;

        Employee::factory(50)->create()->each(function ($employee) {
            $user = User::create([
                'employee_id' => $employee->employee_id,
                'username' => $employee->first_name,
                'password' => bcrypt($employee->last_name)
            ]);

            $user->createToken('EmployeeToken')->plainTextToken;
        });

        Student::factory(50)->create()->each(function ($student) {
            $user = User::create([
                'student_id' => $student->student_id,
                'username' => $student->student_no,
                'password' => bcrypt($student->last_name),
                'is_student' => 1
            ]);

            $user->createToken('StudentToken')->plainTextToken;
        });
    }
}
