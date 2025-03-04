import Employees from "./Employees";
import Semesters from "./Semesters";
import Students from "./Students";

interface Evaluations {
  evaluation_id: number;
  student_id?: Students;
  employee_to_response?: Employees;
  employee_to_evaluate: Employees;
  semester: Semesters;
  is_student: number;
  is_cancelled: number;
  is_completed: number;
  created_at: string;
  updated_at: string;
}

export default Evaluations;
