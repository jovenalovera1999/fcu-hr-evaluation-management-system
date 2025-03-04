import Courses from "./Courses";
import Departments from "./Departments";
import Sections from "./Sections";

interface Students {
  student_id: number;
  student_no: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  department: Departments;
  course: Courses;
  section: Sections;
  year_level: number;
  is_irregular: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}

export default Students;
