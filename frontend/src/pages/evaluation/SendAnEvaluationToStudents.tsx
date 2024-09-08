import { ChangeEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import Spinner from "../../components/Spinner";

interface SendAnEvaluationToStudentsProps {
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

interface Courses {
  course_id: number;
  course: string;
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
  course?: string[];
  year_level?: string[];
  selectedEmployees?: string[];
}

const SendAnEvaluationToStudents = ({
  baseUrl,
  csrfToken,
}: SendAnEvaluationToStudentsProps) => {
  const [state, setState] = useState({
    loadingSubmit: false,
    loadingAcademicYears: true,
    loadingDepartments: true,
    loadingCourses: true,
    loadingEmployees: true,
    academic_years: [] as AcademicYears[],
    departments: [] as Departments[],
    courses: [] as Courses[],
    employees: [] as Employees[],
    academic_year: "",
    students_department: "",
    employees_department: "",
    course: "",
    year_level: "",
    selectedEmployees: [] as number[],
    selectAll: false,
    errors: {} as Errors,
    toastMessage: "",
    toastMessageSuccess: false,
    toastMessageVisible: false,
  });

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "students_department") {
      handleLoadCourses(parseInt(value));
    }

    if (name === "employees_department") {
      handleLoadEmployees(parseInt(value));
    }
  };

  const handleSelectAll = () => {
    const allSelected = !state.selectAll;
    setState((prevState) => ({
      ...prevState,
      selectAll: allSelected,
      selectedEmployees: allSelected
        ? prevState.employees.map((employee) => employee.employee_id)
        : ([] as number[]),
    }));
  };

  const handleSelectEmployee = (employeeId: number) => {
    setState((prevState) => {
      const isSelected = prevState.selectedEmployees.includes(employeeId);
      const updateSelectedEmployees = isSelected
        ? prevState.selectedEmployees.filter((id) => id !== employeeId)
        : [...prevState.selectedEmployees, employeeId];

      const allSelected =
        updateSelectedEmployees.length === prevState.employees.length;

      return {
        ...prevState,
        selectedEmployees: updateSelectedEmployees,
        selectAll: allSelected,
      };
    });
  };

  const handleLoadAcademicYears = async () => {
    await axios
      .get(`${baseUrl}/academic_year/index`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            academic_years: res.data.academicYears,
            loadingAcademicYears: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        console.error("Unexpected server error: ", error);
      });
  };

  const handleLoadDepartments = async () => {
    await axios
      .get(`${baseUrl}/department/index`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            departments: res.data.departments,
            loadingDepartments: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        console.error("Unexpected server error: ", error);
      });
  };

  const handleLoadCourses = async (departmentId: number) => {
    await axios
      .get(`${baseUrl}/course/index/${departmentId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            courses: res.data.courses,
            loadingCourses: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        console.error("Unexpected server error: ", error);
      });
  };

  const handleLoadEmployees = async (departmentId: number) => {
    await axios
      .get(`${baseUrl}/employee/index/by/department/${departmentId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            employees: res.data.employees,
            loadingEmployees: false,
          }));
        } else {
          console.error("Unexpected error status: ", res.data.status);
        }
      })
      .catch((error) => {
        console.error("Unexpected server error: ", error);
      });
  };

  const handleEmployeeFullName = (employee: Employees) => {
    let fullName = "";

    if (employee.middle_name) {
      fullName = `${employee.last_name}, ${
        employee.first_name
      } ${employee.middle_name.charAt(0)}.`;
    } else {
      fullName = `${employee.last_name}, ${employee.first_name}`;
    }

    if (employee.suffix_name) {
      fullName += ` ${employee.suffix_name}`;
    }

    return fullName;
  };

  useEffect(() => {
    document.title = "SEND AN EVALUATION TO STUDENTS | FCU HR EMS";

    handleLoadAcademicYears();
    handleLoadDepartments();
  }, []);

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
                  {state.academic_years.map((academic_year) => (
                    <option
                      value={academic_year.academic_year_id}
                      key={academic_year.academic_year_id}
                    >
                      {academic_year.academic_year}
                    </option>
                  ))}
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
                  value={state.students_department}
                  onChange={handleInput}
                >
                  <option value="">N/A</option>
                  {state.departments.map((department) => (
                    <option
                      value={department.department_id}
                      key={department.department_id}
                    >
                      {department.department}
                    </option>
                  ))}
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
                  {state.courses.map((course) => (
                    <option value={course.course_id} key={course.course_id}>
                      {course.course}
                    </option>
                  ))}
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
                  value={state.employees_department}
                  onChange={handleInput}
                >
                  <option value="">N/A</option>
                  {state.departments.map((department) => (
                    <option
                      value={department.department_id}
                      key={department.department_id}
                    >
                      {department.department}
                    </option>
                  ))}
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
                    <td>
                      SELECT ALL
                      <br />
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="select_all"
                        id="select_all"
                        checked={state.selectAll}
                        onChange={handleSelectAll}
                      />
                    </td>
                    <th>NO.</th>
                    <th>NAME OF EMPLOYEES/TEACHERS/STAFFS</th>
                  </tr>
                </thead>
                <tbody>
                  {state.employees.map((employee, index) => (
                    <tr key={employee.employee_id}>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="select"
                          id={`select_${employee.employee_id}`}
                          checked={state.selectedEmployees.includes(
                            employee.employee_id
                          )}
                          onChange={() =>
                            handleSelectEmployee(employee.employee_id)
                          }
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{handleEmployeeFullName(employee)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </form>
    </>
  );

  return (
    <Layout
      content={
        state.loadingSubmit ||
        (!state.loadingSubmit &&
          state.loadingAcademicYears &&
          state.loadingCourses &&
          state.loadingDepartments &&
          state.loadingEmployees) ? (
          <Spinner />
        ) : (
          content
        )
      }
    />
  );
};

export default SendAnEvaluationToStudents;
