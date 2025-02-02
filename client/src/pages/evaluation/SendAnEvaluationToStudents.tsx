import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";
import ToastMessage from "../../components/ToastMessage";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import { Link, useNavigate } from "react-router-dom";

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

interface Semesters {
  semester_id: number;
  semester: string;
}

interface Sections {
  section_id: number;
  section: string;
}

interface Errors {
  academic_year?: string[];
  semester?: string[];
  students_department?: string[];
  course?: string[];
  year_level?: string[];
  students_section?: string[];
  employees_department?: string[];
  selectedEmployees?: string[];
}

const SendAnEvaluationToStudents = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingSubmit: false,
    loadingAcademicYears: true,
    loadingSemesters: false,
    loadingDepartments: true,
    loadingCourses: false,
    loadingSections: false,
    loadingEmployees: false,
    academic_years: [] as AcademicYears[],
    semesters: [] as Semesters[],
    departments: [] as Departments[],
    courses: [] as Courses[],
    sections: [] as Sections[],
    employees: [] as Employees[],
    academic_year: "",
    semester: "",
    students_department: "",
    employees_department: "",
    course: "",
    year_level: "",
    students_section: "",
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

    if (name === "academic_year") {
      setState((prevState) => ({
        ...prevState,
        loadingSemesters: true,
      }));

      handleLoadSemesters(parseInt(value));
    }

    if (name === "students_department") {
      setState((prevState) => ({
        ...prevState,
        loadingCourses: true,
      }));

      handleLoadCourses(parseInt(value));
    }

    if (name === "course") {
      setState((prevState) => ({
        ...prevState,
        loadingSections: true,
      }));

      handleLoadSections(parseInt(value));
    }

    if (name === "employees_department") {
      setState((prevState) => ({
        ...prevState,
        loadingEmployees: true,
      }));

      handleLoadEmployees(parseInt(value));
    }
  };

  const handleSelectAll = () => {
    const allSelected = !state.selectAll;
    const updateSelectedEmployees = allSelected
      ? state.employees.map((employee) => employee.employee_id)
      : [];

    setState((prevState) => ({
      ...prevState,
      selectAll: allSelected,
      selectedEmployees: updateSelectedEmployees,
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

  const handleSendEvaluation = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingSubmit: true,
    }));

    axiosInstance
      .post("/evaluation/store/evaluations/for/students", state)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            employees: [] as Employees[],
            academic_year: "",
            semester: "",
            students_department: "",
            employees_department: "",
            course: "",
            year_level: "",
            students_section: "",
            selectedEmployees: [] as number[],
            selectAll: false,
            errors: {} as Errors,
            loadingSubmit: false,
            toastMessage: "EVALUATIONS HAS BEEN SENT TO STUDENTS!",
            toastMessageSuccess: true,
            toastMessageVisible: true,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
            loadingSubmit: false,
          }));
        } else {
          errorHandler(error, navigate);
        }
      });
  };

  const handleCloseToastMessage = () => {
    setState((prevState) => ({
      ...prevState,
      toastMessage: "",
      toastMessageSuccess: false,
      toastMessageVisible: false,
    }));
  };

  const handleLoadSemesters = async (academicYearId: number) => {
    axiosInstance
      .get(`/semester/load/semesters/by/academic_year/${academicYearId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            semesters: res.data.semesters,
            loadingSemesters: false,
          }));
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      });
  };

  const handleLoadAcademicYears = async () => {
    axiosInstance
      .get("/academic_year/index")
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
        errorHandler(error, navigate);
      });
  };

  const handleLoadDepartments = async () => {
    axiosInstance
      .get("/department/index")
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
        errorHandler(error, navigate);
      });
  };

  const handleLoadCourses = async (departmentId: number) => {
    axiosInstance
      .get(`/course/index/${departmentId}`)
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
        errorHandler(error, navigate);
      });
  };

  const handleLoadSections = async (courseId: number) => {
    axiosInstance
      .get(`/section/load/sections/by/course/${courseId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            sections: res.data.sections,
            loadingSections: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      });
  };

  const handleLoadEmployees = async (departmentId: number) => {
    axiosInstance
      .get(`/employee/loadEmployeesByDepartmentForEvaluation/${departmentId}`)
      .then((res) => {
        if (res.status === 200) {
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
        errorHandler(error, navigate);
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
    document.title = "SEND AN EVALUATION TO REGULAR STUDENTS | FCU HR EMS";

    if (
      !token ||
      !user ||
      !parsedUser ||
      parsedUser.position !== "ADMIN" ||
      !parsedUser.position
    ) {
      errorHandler(401, navigate);
    } else {
      handleLoadAcademicYears();
      handleLoadDepartments();
    }
  }, []);

  const content = (
    <>
      <ToastMessage
        message={state.toastMessage}
        success={state.toastMessageSuccess}
        visible={state.toastMessageVisible}
        onClose={handleCloseToastMessage}
      />
      <form onSubmit={handleSendEvaluation}>
        <div className="mx-auto mt-2">
          <h4>SEND AN EVALUATION TO REGULAR STUDENTS</h4>
          <div className="row">
            <hr />
            <div className="col-sm-6">
              <div className="mb-3">
                <Link
                  to={"/evaluation/to/irregular/students"}
                  className="btn btn-theme"
                >
                  TO SEND AN EVALUATION FOR IRREGULAR STUDENTS, CLICK HERE!
                </Link>
              </div>
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="academic_year">ACADEMIC YEAR</label>
                <select
                  name="academic_year"
                  id="academic_year"
                  className={`form-select ${
                    state.errors.academic_year ? "is-invalid" : ""
                  }`}
                  value={state.academic_year}
                  onChange={handleInput}
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
                {state.errors.academic_year && (
                  <p className="text-danger">{state.errors.academic_year[0]}</p>
                )}
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="semester">SEMESTER</label>
                <select
                  name="semester"
                  id="semester"
                  className={`form-select ${
                    state.errors.semester ? "is-invalid" : ""
                  }`}
                  value={state.semester}
                  onChange={handleInput}
                >
                  <option value="">N/A</option>
                  {state.loadingSemesters ? (
                    <option value="">Loading...</option>
                  ) : (
                    state.semesters.map((semester) => (
                      <option
                        value={semester.semester_id}
                        key={semester.semester_id}
                      >
                        {semester.semester}
                      </option>
                    ))
                  )}
                </select>
                {state.errors.semester && (
                  <p className="text-danger">{state.errors.semester[0]}</p>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="students_department">
                  STUDENT'S DEPARTMENT
                </label>
                <select
                  name="students_department"
                  id="students_department"
                  className={`form-select ${
                    state.errors.students_department ? "is-invalid" : ""
                  }`}
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
                {state.errors.students_department && (
                  <p className="text-danger">
                    {state.errors.students_department[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="course">STUDENT'S COURSE</label>
                <select
                  name="course"
                  id="course"
                  className={`form-select ${
                    state.errors.course ? "is-invalid" : ""
                  }`}
                  value={state.course}
                  onChange={handleInput}
                >
                  <option value="">N/A</option>
                  {state.loadingCourses ? (
                    <option value="">Loading...</option>
                  ) : (
                    state.courses.map((course) => (
                      <option value={course.course_id} key={course.course_id}>
                        {course.course}
                      </option>
                    ))
                  )}
                </select>
                {state.errors.course && (
                  <p className="text-danger">{state.errors.course[0]}</p>
                )}
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="students_year_level">
                  STUDENT'S YEAR LEVEL
                </label>
                <select
                  name="year_level"
                  id="year_level"
                  className={`form-select ${
                    state.errors.year_level ? "is-invalid" : ""
                  }`}
                  value={state.year_level}
                  onChange={handleInput}
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
                {state.errors.year_level && (
                  <p className="text-danger">{state.errors.year_level}</p>
                )}
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="students_section">STUDENT'S SECTION</label>
                <select
                  name="students_section"
                  id="students_section"
                  className={`form-select ${
                    state.errors.students_section ? "is-invalid" : ""
                  }`}
                  value={state.students_section}
                  onChange={handleInput}
                >
                  <option value="">N/A</option>
                  {state.loadingSections ? (
                    <option value="">Loading...</option>
                  ) : (
                    state.sections.map((section) => (
                      <option
                        value={section.section_id}
                        key={section.section_id}
                      >
                        {section.section}
                      </option>
                    ))
                  )}
                </select>
                {state.errors.students_section && (
                  <p className="text-danger">
                    {state.errors.students_section[0]}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-sm-4">
              <label htmlFor="employees_department">
                EMPLOYEE'S/TEACHER'S/STAFF'S DEPARTMENT
              </label>
              <select
                name="employees_department"
                id="employees_department"
                className={`form-select ${
                  state.errors.employees_department ? "is-invalid" : ""
                }`}
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
              {state.errors.employees_department && (
                <p className="text-danger">
                  {state.errors.employees_department}
                </p>
              )}
            </div>
          </div>
          <div className="table-responsive mb-3">
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  <td className="text-center">
                    SELECT ALL
                    <input
                      type="checkbox"
                      className="form-check-input ms-2"
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
                {state.loadingEmployees ? (
                  <tr>
                    <td colSpan={3}>
                      <Spinner />
                    </td>
                  </tr>
                ) : (
                  state.employees.map((employee, index) => (
                    <tr key={employee.employee_id}>
                      <td className="text-center">
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
                  ))
                )}
              </tbody>
            </table>
            {state.errors.selectedEmployees && (
              <p className="text-danger">{state.errors.selectedEmployees[0]}</p>
            )}
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-theme">
              SEND EVALUATION
            </button>
          </div>
        </div>
      </form>
    </>
  );

  return (
    <Layout
      content={
        state.loadingSubmit ||
        state.loadingAcademicYears ||
        state.loadingDepartments ? (
          <Spinner />
        ) : (
          content
        )
      }
    />
  );
};

export default SendAnEvaluationToStudents;
