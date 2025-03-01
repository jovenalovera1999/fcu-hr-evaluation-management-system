import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";
import ToastMessage from "../../components/ToastMessage";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import { useNavigate } from "react-router-dom";
import { Col, Form, Row, Table } from "react-bootstrap";
import SendAnEvaluationToIrregularStudents from "./SendAnEvaluationToIrregularStudents";

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

const SendAnEvaluationToRegularStudents = () => {
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
    type_of_student: "",
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

      handleLoadEmployees();
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
          errorHandler(error, navigate, null);
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
        errorHandler(error, navigate, null);
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
        errorHandler(error, navigate, null);
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
        errorHandler(error, navigate, null);
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
        errorHandler(error, navigate, null);
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
        errorHandler(error, navigate, null);
      });
  };

  const handleLoadEmployees = async () => {
    setState((prevState) => ({
      ...prevState,
      loadingEmployees: true,
      employees: [] as Employees[],
    }));

    axiosInstance
      .get(
        `/employee/loadEmployeesByDepartmentForEvaluation?departmentId=${state.employees_department}`
      )
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
        errorHandler(error, navigate, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingEmployees: false,
        }));
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
      errorHandler(401, navigate, null);
    } else {
      handleLoadAcademicYears();
      handleLoadDepartments();

      setState((prevState) => ({
        ...prevState,
        type_of_student: "1",
      }));
    }
  }, []);

  useEffect(() => {
    handleLoadEmployees();
  }, [state.employees_department]);

  const selection = (
    <>
      <div className="row">
        <hr />
        <Col md={3}>
          <Form.Floating className="mb-3">
            <Form.Select
              name="type_of_student"
              id="type_of_student"
              value={state.type_of_student}
              onChange={handleInput}
              autoFocus
            >
              <option value="1">REGULAR STUDENTS</option>
              <option value="2">IRREGULAR STUDENTS</option>
            </Form.Select>
            <label htmlFor="type_of_student">TYPE OF STUDENT</label>
          </Form.Floating>
        </Col>
        <hr />
      </div>
    </>
  );

  const content = (
    <>
      <ToastMessage
        body={state.toastMessage}
        success={state.toastMessageSuccess}
        showToast={state.toastMessageVisible}
        onClose={handleCloseToastMessage}
      />
      <form onSubmit={handleSendEvaluation}>
        <div className="mx-auto mt-2">
          <h4>SEND AN EVALUATION TO REGULAR STUDENTS</h4>
          <Row>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Select
                  name="academic_year"
                  id="academic_year"
                  className={`form-select ${
                    state.errors.academic_year ? "is-invalid" : ""
                  }`}
                  value={state.academic_year}
                  onChange={handleInput}
                >
                  <option value="">SELECT ACADEMIC YEAR</option>
                  {state.academic_years.map((academic_year, index) => (
                    <option value={academic_year.academic_year_id} key={index}>
                      {academic_year.academic_year}
                    </option>
                  ))}
                </Form.Select>
                <label htmlFor="academic_year">ACADEMIC YEAR</label>
                {state.errors.academic_year && (
                  <p className="text-danger">{state.errors.academic_year[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Select
                  name="semester"
                  id="semester"
                  className={`form-select ${
                    state.errors.semester ? "is-invalid" : ""
                  }`}
                  value={state.semester}
                  onChange={handleInput}
                >
                  <option value="">SELECT SEMESTER</option>
                  {state.loadingSemesters ? (
                    <option value="">Loading...</option>
                  ) : (
                    state.semesters.map((semester, index) => (
                      <option value={semester.semester_id} key={index}>
                        {semester.semester}
                      </option>
                    ))
                  )}
                </Form.Select>
                <label htmlFor="semester">SEMESTER</label>
                {state.errors.semester && (
                  <p className="text-danger">{state.errors.semester[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Select
                  name="students_department"
                  id="students_department"
                  className={`form-select ${
                    state.errors.students_department ? "is-invalid" : ""
                  }`}
                  value={state.students_department}
                  onChange={handleInput}
                >
                  <option value="">SELECT DEPARTMENT</option>
                  {state.departments.map((department, index) => (
                    <option value={department.department_id} key={index}>
                      {department.department}
                    </option>
                  ))}
                </Form.Select>
                <label htmlFor="students_department">
                  STUDENT'S DEPARTMENT
                </label>
                {state.errors.students_department && (
                  <p className="text-danger">
                    {state.errors.students_department[0]}
                  </p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Select
                  name="course"
                  id="course"
                  className={`form-select ${
                    state.errors.course ? "is-invalid" : ""
                  }`}
                  value={state.course}
                  onChange={handleInput}
                >
                  <option value="">SELECT COURSE</option>
                  {state.loadingCourses ? (
                    <option value="">Loading...</option>
                  ) : (
                    state.courses.map((course) => (
                      <option value={course.course_id} key={course.course_id}>
                        {course.course}
                      </option>
                    ))
                  )}
                </Form.Select>
                <label htmlFor="course">STUDENT'S COURSE</label>
                {state.errors.course && (
                  <p className="text-danger">{state.errors.course[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Select
                  name="year_level"
                  id="year_level"
                  className={`form-select ${
                    state.errors.year_level ? "is-invalid" : ""
                  }`}
                  value={state.year_level}
                  onChange={handleInput}
                >
                  <option value="">SELECT YEAR LEVEL</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </Form.Select>
                <label htmlFor="students_year_level">
                  STUDENT'S YEAR LEVEL
                </label>
                {state.errors.year_level && (
                  <p className="text-danger">{state.errors.year_level}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Select
                  name="students_section"
                  id="students_section"
                  className={`form-select ${
                    state.errors.students_section ? "is-invalid" : ""
                  }`}
                  value={state.students_section}
                  onChange={handleInput}
                >
                  <option value="">SELECT SECTION</option>
                  {state.loadingSections ? (
                    <option value="">Loading...</option>
                  ) : (
                    state.sections.map((section, index) => (
                      <option value={section.section_id} key={index}>
                        {section.section}
                      </option>
                    ))
                  )}
                </Form.Select>
                <label htmlFor="students_section">STUDENT'S SECTION</label>
                {state.errors.students_section && (
                  <p className="text-danger">
                    {state.errors.students_section[0]}
                  </p>
                )}
              </Form.Floating>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={4}>
              <Form.Floating>
                <Form.Select
                  name="employees_department"
                  id="employees_department"
                  className={`${
                    state.errors.employees_department ? "is-invalid" : ""
                  }`}
                  value={state.employees_department}
                  onChange={handleInput}
                >
                  <option value="">SELECT DEPARTMENT</option>
                  {state.departments.map((department) => (
                    <option
                      value={department.department_id}
                      key={department.department_id}
                    >
                      {department.department}
                    </option>
                  ))}
                </Form.Select>
                <label htmlFor="employees_department">
                  EMPLOYEE'S/TEACHER'S/STAFF'S DEPARTMENT
                </label>
              </Form.Floating>
              <p className="form-text">
                CHOOSE AND SELECT TEACHER/EMPLOYEE/STAFF BY THEIR DEPARTMENT
              </p>
              {state.errors.employees_department && (
                <p className="text-danger">
                  {state.errors.employees_department}
                </p>
              )}
            </Col>
          </Row>
          <div className="mb-3">
            <Table hover responsive>
              <thead>
                <tr className="align-middle">
                  <th className="text-center">
                    SELECT ALL
                    <input
                      type="checkbox"
                      className="form-check-input ms-2"
                      name="select_all"
                      id="select_all"
                      checked={state.selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
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
            </Table>
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
        ) : state.type_of_student === "1" ? (
          <>
            {selection}
            {content}
          </>
        ) : (
          <>
            {selection}
            <SendAnEvaluationToIrregularStudents />
          </>
        )
      }
    />
  );
};

export default SendAnEvaluationToRegularStudents;
