import Departments from "./Departments";
import Positions from "./Positions";

interface Employees {
  employee_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  position: Positions;
  department: Departments;
  created_at: string;
  updated_at: string;
}

export default Employees;
