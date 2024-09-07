import { useState } from "react";
import Layout from "../layout/Layout";

interface SendAnEvaluationToStudentsProps {
  baseUrl: string;
  csrfToken: string | null | undefined;
}

interface Employees {
  employee_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  department: string;
}

interface Errors {
  academic_year?: string[];
  department?: string[];
  course?: string[];
  year_level?: string[];
  selectedEmployees?: string[];
}

const SendAnEvaluationToStudents = () => {
  const [state, setState] = useState({
    loadingSubmit: false,
    loadingAcademicYears: true,
    loadingDepartments: true,
    loadingCourses: true,
    loadingEmployees: true,
    employees: [] as Employees[],
    academic_year: "",
    department: "",
    course: "",
    year_level: "",
    selectedEmployees: [] as Employees[],
    errors: {} as Errors,
  });

  const content = (
    <>
      <form>
        <div className="card shadow mx-auto mt-3 p-3">
          <h5 className="card-title">SEND AN EVALUATION TO STUDENTS</h5>
          <div className="card-body">
            <div className="row">
              <div className="mb-3 col-sm-3">
                <label htmlFor="academic_year">ACADEMIC YEAR</label>
                <select
                  name="academic_year"
                  id="academic_year"
                  className="form-select"
                >
                  <option value="">N/A</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="mb-3 col-sm-3">
                <label htmlFor="students_department">STUDENTS DEPARTMENT</label>
                <select
                  name="students_department"
                  id="students_department"
                  className="form-select"
                >
                  <option value="">N/A</option>
                </select>
              </div>
              <div className="mb-3 col-sm-3">
                <label htmlFor="students_course">STUDENTS COURSE</label>
                <select
                  name="students_course"
                  id="students_course"
                  className="form-select"
                >
                  <option value="">N/A</option>
                </select>
              </div>
              <div className="mb-3 col-sm-2">
                <label htmlFor="students_year_level">STUDENTS YEAR LEVEL</label>
                <select
                  name="students_year_level"
                  id="students_year_level"
                  className="form-select"
                >
                  <option value="">N/A</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4">
                <label htmlFor="employees_department">
                  EMPLOYEES/TEACHERS/STAFFS DEPARTMENT
                </label>
                <select
                  name="employees_department"
                  id="employees_department"
                  className="form-select"
                >
                  <option value="">N/A</option>
                </select>
                <p className="form-text">
                  CHOOSE AND SELECT TEACHER/EMPLOYEE/STAFF BY THEIR DEPARTMENT
                </p>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>NO.</th>
                    <th>NAME OF EMPLOYEES/TEACHERS/STAFFS</th>
                    <th>DEPARTMENT</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </form>
    </>
  );

  return <Layout content={content} />;
};

export default SendAnEvaluationToStudents;
