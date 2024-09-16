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
                'username' => $student->first_name,
                'password' => bcrypt($student->last_name)
            ]);

            $user->createToken('StudentToken')->plainTextToken;
        });
    }
}
