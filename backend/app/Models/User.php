<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'tbl_users';
    protected $primaryKey = 'user_id';
    protected $fillable = [
        'employee_id',
        'student_id',
        'username',
        'password',
        'is_student',
        'is_deleted'
    ];
    protected $hidden = ['password'];
}
