<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_no' => 'S-' . fake()->randomNumber(7),
            'first_name' => strtoupper(fake()->firstName()),
            'middle_name' => strtoupper(fake()->lastName()),
            'last_name' => strtoupper(fake()->lastName()),
            'suffix_name' => strtoupper(fake()->suffix()),
            'department_id' => fake()->numberBetween(1, 7),
            'course_id' => fake()->numberBetween(1, 12),
            'section_id' => fake()->numberBetween(1, 60),
            'year_level' => fake()->numberBetween(1, 4),
            'is_irregular' => fake()->numberBetween(1, 2)
        ];
    }
}
