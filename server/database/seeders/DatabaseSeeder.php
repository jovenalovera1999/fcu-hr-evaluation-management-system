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
use App\Models\Semester;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application"s database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     "name" => "Test User",
        //     "email" => "test@example.com",
        // ]);

        AcademicYear::factory()->createMany([
            ["academic_year" => "2022-2023"],
            ["academic_year" => "2023-2024"],
            ["academic_year" => "2024-2025"]
        ]);

        Position::factory()->createMany([
            ["position" => "ADMIN"],
            ["position" => "STAFF"],
            ["position" => "DEAN"],
            ["position" => "FULL-TIME FACULTY"],
            ["position" => "PART-TIME FACULTY"],
            ['position' => 'STUDENT']
        ]);

        Department::factory()->createMany([
            ["department" => "CCS"],
            ["department" => "ECE"],
            ["department" => "CTE"],
            ["department" => "CHRMT"],
            ["department" => "CN"],
            ["department" => "CBA"],
            ["department" => "CAS"]
        ]);

        Course::factory()->createMany([
            ["department_id" => 1, "course" => "BSIT"],
            ["department_id" => 1, "course" => "BSCS"],
            ["department_id" => 2, "course" => "BSEE"],
            ["department_id" => 3, "course" => "BSM"],
            ["department_id" => 3, "course" => "BSF"],
            ["department_id" => 3, "course" => "BSE"],
            ["department_id" => 4, "course" => "BSHM"],
            ["department_id" => 4, "course" => "BSRM"],
            ["department_id" => 5, "course" => "BSN"],
            ["department_id" => 6, "course" => "BSBA"],
            ["department_id" => 7, "course" => "BSA"],
            ["department_id" => 7, "course" => "BSP"]
        ]);

        Section::factory()->createMany([
            ["course_id" => 1, "section" => "A"],
            ["course_id" => 1, "section" => "B"],
            ["course_id" => 1, "section" => "C"],
            ["course_id" => 1, "section" => "D"],
            ["course_id" => 1, "section" => "E"],
            ["course_id" => 2, "section" => "A"],
            ["course_id" => 2, "section" => "B"],
            ["course_id" => 2, "section" => "C"],
            ["course_id" => 2, "section" => "D"],
            ["course_id" => 2, "section" => "E"],
            ["course_id" => 3, "section" => "A"],
            ["course_id" => 3, "section" => "B"],
            ["course_id" => 3, "section" => "C"],
            ["course_id" => 3, "section" => "D"],
            ["course_id" => 3, "section" => "E"],
            ["course_id" => 4, "section" => "A"],
            ["course_id" => 4, "section" => "B"],
            ["course_id" => 4, "section" => "C"],
            ["course_id" => 4, "section" => "D"],
            ["course_id" => 4, "section" => "E"],
            ["course_id" => 5, "section" => "A"],
            ["course_id" => 5, "section" => "B"],
            ["course_id" => 5, "section" => "C"],
            ["course_id" => 5, "section" => "D"],
            ["course_id" => 5, "section" => "E"],
            ["course_id" => 6, "section" => "A"],
            ["course_id" => 6, "section" => "B"],
            ["course_id" => 6, "section" => "C"],
            ["course_id" => 6, "section" => "D"],
            ["course_id" => 6, "section" => "E"],
            ["course_id" => 7, "section" => "A"],
            ["course_id" => 7, "section" => "B"],
            ["course_id" => 7, "section" => "C"],
            ["course_id" => 7, "section" => "D"],
            ["course_id" => 7, "section" => "E"],
            ["course_id" => 8, "section" => "A"],
            ["course_id" => 8, "section" => "B"],
            ["course_id" => 8, "section" => "C"],
            ["course_id" => 8, "section" => "D"],
            ["course_id" => 8, "section" => "E"],
            ["course_id" => 9, "section" => "A"],
            ["course_id" => 9, "section" => "B"],
            ["course_id" => 9, "section" => "C"],
            ["course_id" => 9, "section" => "D"],
            ["course_id" => 9, "section" => "E"],
            ["course_id" => 10, "section" => "A"],
            ["course_id" => 10, "section" => "B"],
            ["course_id" => 10, "section" => "C"],
            ["course_id" => 10, "section" => "D"],
            ["course_id" => 10, "section" => "E"],
            ["course_id" => 11, "section" => "A"],
            ["course_id" => 11, "section" => "B"],
            ["course_id" => 11, "section" => "C"],
            ["course_id" => 11, "section" => "D"],
            ["course_id" => 11, "section" => "E"],
            ["course_id" => 12, "section" => "A"],
            ["course_id" => 12, "section" => "B"],
            ["course_id" => 12, "section" => "C"],
            ["course_id" => 12, "section" => "D"],
            ["course_id" => 12, "section" => "E"],
        ]);

        Category::factory()->createMany([
            ["category" => "TEACHING EFFECTIVENESS"],
            ["category" => "COMMUNICATION SKILLS"],
            ["category" => "CLASSROOM MANAGEMENT"],
            ["category" => "SUBJECT KNOWLEDGE"],
            ["category" => "STUDENT SUPPORT"],
            ["category" => "PROFESSIONALISM"]
        ]);

        Question::factory()->createMany([
            ["category_id" => 1, "question" => "How effectively does the teacher deliver course material?", 'position_id' => rand(1, 6)],
            ["category_id" => 1, "question" => "How well does the teacher explain complex concepts?", 'position_id' => rand(1, 6)],
            ["category_id" => 1, "question" => "How organized and prepared is the teacher for each class?", 'position_id' => rand(1, 6)],
            ["category_id" => 1, "question" => "How well does the teacher engage students in the learning process?", 'position_id' => rand(1, 6)],
            ["category_id" => 2, "question" => "How clear is the teacher in communicating instructions and expectations?", 'position_id' => rand(1, 6)],
            ["category_id" => 2, "question" => "How effectively does the teacher respond to student questions and concerns?", 'position_id' => rand(1, 6)],
            ["category_id" => 2, "question" => "How well does the teacher encourage open communication and participation?", 'position_id' => rand(1, 6)],
            ["category_id" => 3, "question" => "How well does the teacher maintain a positive and respectful classroom environment?", 'position_id' => rand(1, 6)],
            ["category_id" => 3, "question" => "How effectively does the teacher manage classroom time and activities?", 'position_id' => rand(1, 6)],
            ["category_id" => 3, "question" => "How fair and consistent is the teacher in enforcing rules and discipline?", 'position_id' => rand(1, 6)],
            ["category_id" => 4, "question" => "How knowledgeable does the teacher appear about the subject matter?", 'position_id' => rand(1, 6)],
            ["category_id" => 4, "question" => "How well does the teacher incorporate current developments and examples in the subject area?", 'position_id' => rand(1, 6)],
            ["category_id" => 4, "question" => "How effectively does the teacher answer student questions related to the subject?", 'position_id' => rand(1, 6)],
            ["category_id" => 5, "question" => "How approachable is the teacher outside of class for additional help?", 'position_id' => rand(1, 6)],
            ["category_id" => 5, "question" => "How effectively does the teacher provide feedback on assignments and assessments?", 'position_id' => rand(1, 6)],
            ["category_id" => 5, "question" => "How well does the teacher support student learning and development?", 'position_id' => rand(1, 6)],
            ["category_id" => 6, "question" => "How punctual and reliable is the teacher in starting and ending classes on time?", 'position_id' => rand(1, 6)],
            ["category_id" => 6, "question" => "How respectful and fair is the teacher towards all students?", 'position_id' => rand(1, 6)],
            ["category_id" => 6, "question" => "How effectively does the teacher adhere to the course syllabus and schedule?", 'position_id' => rand(1, 6)]
        ]);

        Semester::factory()->createMany([
            ["academic_year_id" => 1, "semester" => strtoupper("1st sem")],
            ["academic_year_id" => 1, "semester" => strtoupper("2nd sem")],
            ["academic_year_id" => 1, "semester" => strtoupper("3rd sem")],
            ["academic_year_id" => 1, "semester" => strtoupper("4th sem")],
            ["academic_year_id" => 1, "semester" => strtoupper("5th sem")],
            ["academic_year_id" => 1, "semester" => strtoupper("6th sem")],
            ["academic_year_id" => 1, "semester" => strtoupper("7th sem")],
            ["academic_year_id" => 1, "semester" => strtoupper("8th sem")],
            ["academic_year_id" => 2, "semester" => strtoupper("1st sem")],
            ["academic_year_id" => 2, "semester" => strtoupper("2nd sem")],
            ["academic_year_id" => 2, "semester" => strtoupper("3rd sem")],
            ["academic_year_id" => 2, "semester" => strtoupper("4th sem")],
            ["academic_year_id" => 2, "semester" => strtoupper("5th sem")],
            ["academic_year_id" => 2, "semester" => strtoupper("6th sem")],
            ["academic_year_id" => 2, "semester" => strtoupper("7th sem")],
            ["academic_year_id" => 2, "semester" => strtoupper("8th sem")]
        ]);

        $employee = Employee::factory()->create([
            "first_name" => strtoupper("John"),
            "middle_name" => null,
            "last_name" => strtoupper("Doe"),
            "suffix_name" => null,
            "position_id" => 1,
            "department_id" => 1
        ]);

        $user = User::create([
            "employee_id" => $employee->employee_id,
            "username" => strtoupper("admin"),
            "password" => bcrypt(strtoupper("admin"))
        ]);

        $user->createToken("AdminToken")->plainTextToken;

        // Employee::factory(100)->create()->each(function ($employee) {
        //     $user = User::create([
        //         "employee_id" => $employee->employee_id,
        //         "username" => $employee->first_name,
        //         "password" => bcrypt($employee->last_name)
        //     ]);

        //     $user->createToken("EmployeeToken")->plainTextToken;
        // });

        // Student::factory(200)->create()->each(function ($student) {
        //     $user = User::create([
        //         "student_id" => $student->student_id,
        //         "username" => $student->student_no,
        //         "password" => bcrypt($student->last_name),
        //         "is_student" => 1
        //     ]);

        //     $user->createToken("StudentToken")->plainTextToken;
        // });
    }
}
