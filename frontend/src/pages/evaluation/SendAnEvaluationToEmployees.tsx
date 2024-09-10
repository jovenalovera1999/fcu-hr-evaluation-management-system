interface SendAnEvaluationToEmployeesProps {
  baseUrl: string;
  csrfToken: string | null | undefined;
}

interface AcademicYears {
  academic_year_id: number;
  academic_year: string;
}

interface Departments {
  department_id: number;
  department: string;
}

interface Employees {
  employee_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
}

interface Errors {
  academic_year?: string[];
  department?: string[];
}

const SendAnEvaluationToEmployees = () => {
  return <div>SendAnEvaluationToEmployees</div>;
};

export default SendAnEvaluationToEmployees;
