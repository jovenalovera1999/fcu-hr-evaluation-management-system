import Departments from "./Departments";

interface Courses {
  course_id: number;
  department: Departments;
  course: string;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}

export default Courses;
