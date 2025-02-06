import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Layout from "../layout/Layout";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import Spinner from "../../components/Spinner";
import { debounce } from "chart.js/helpers";
import { useNavigate } from "react-router-dom";

interface AcademicYears {
  academic_year_id: number;
  academic_year: string;
}

interface Semesters {
  semester_id: number;
  semester: string;
}

interface Students {
  student_id: number;
  student_no: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  department: string;
  course: string;
  year_level: string;
  section: string;
}

interface AllStudentIds {
  student_id: number;
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
  academic_year: string[];
  semester: string[];
  employees_department: string[];
  selectedStudents: string[];
  selectedEmployees: string[];
}

const SendAnEvaluationToIrregularStudents = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingSubmit: false,
    loadingAcademicYears: true,
    loadingSemesters: false,
    loadingStudents: true,
    loadingStudentIds: true,
    loadingDepartments: true,
    loadingEmployees: false,
    loadingPage: false,
    loadingSearch: false,
    academicYears: [] as AcademicYears[],
    semesters: [] as Semesters[],
    students: [] as Students[],
    allStudentIds: [] as AllStudentIds[],
    departments: [] as Departments[],
    employees: [] as Employees[],
    academic_year: "",
    semester: "",
    search: "",
    employees_department: "",
    selectedStudents: [] as number[],
    selectedEmployees: [] as number[],
    selectAllStudents: false,
    selectAllEmployees: false,
    currentPage: 1,
    lastPage: 1,
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
    } else if (name === "employees_department") {
      setState((prevState) => ({
        ...prevState,
        loadingEmployees: true,
      }));

      handleLoadEmployees(parseInt(value));
    }
  };

  const handleSendEvaluation = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingSubmit: true,
    }));

    axiosInstance
      .post("/evaluation/send/evaluations/for/irregular/students", state)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            employees: [] as Employees[],
            search: "",
            employees_department: "",
            selectedStudents: [] as number[],
            selectedEmployees: [] as number[],
            selectAllStudents: false,
            selectAllEmployees: false,
            errors: {} as Errors,
            loadingSubmit: false,
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

  const handleLoadAcademicYears = async () => {
    axiosInstance
      .get("/academic_year/index")
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            academicYears: res.data.academicYears,
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
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch();
  };

  const handleLoadStudents = async (page: number = state.currentPage) => {
    let endpoint = `/student/load/irregular/students/by/page?page=${page}`;

    if (state.search) {
      endpoint = `/student/load/irregular/students/by/page/and/search?page=${page}&search=${state.search}`;
    }

    axiosInstance
      .get(endpoint)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            students: res.data.students.data,
            loadingStudents: false,
            loadingPage: false,
            loadingSearch: false,
            currentPage: res.data.students.current_page,
            lastPage: res.data.students.last_page,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      });
  };

  const debouncedPageChange = useCallback(
    debounce((page: number) => {
      if (page > 0 && state.currentPage <= state.lastPage) {
        setState((prevState) => ({
          ...prevState,
          loadingPage: true,
        }));

        handleLoadStudents(page);
      }
    }, 550),
    [state.lastPage, state.search]
  );

  const handlePageChange = (page: number) => {
    debouncedPageChange(page);
  };

  // const debouncedSearch = useCallback(
  //   debounce((value: string) => {
  //     setState((prevState) => ({
  //       ...prevState,
  //       search: value,
  //       currentPage: 1,
  //       loadingSearch: true,
  //     }));
  //   }, 300),
  //   []
  // );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      search: e.target.value,
      currentPage: 1,
      loadingSearch: true,
    }));
  };

  const handleStudentFullName = (student: Students) => {
    let fullName = "";

    if (student.middle_name) {
      fullName = `${student.last_name}, ${
        student.first_name
      } ${student.middle_name.charAt(0)}.`;
    } else {
      fullName = `${student.last_name}, ${student.first_name}`;
    }

    if (student.suffix_name) {
      fullName += ` ${student.suffix_name}`;
    }

    return fullName;
  };

  const handleLoadStudentIds = async () => {
    let endpoint = "/student/load/irregular/student/ids";

    if (state.search) {
      endpoint = `/student/load/irregular/student/ids/by/search?search=${state.search}`;
    }

    axiosInstance
      .get(endpoint)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            allStudentIds: res.data.studentIds,
            loadingStudentIds: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      });
  };

  const handleSelectAllStudents = () => {
    const allSelected = !state.selectAllStudents;
    const updateSelectedStudents = allSelected
      ? state.allStudentIds.map((student) => student.student_id)
      : [];

    setState((prevState) => ({
      ...prevState,
      selectAllStudents: allSelected,
      selectedStudents: updateSelectedStudents,
    }));

    // console.log(updateSelectedStudents);
  };

  const handleSelectStudent = (studentId: number) => {
    setState((prevState) => {
      const isSelected = prevState.selectedStudents.includes(studentId);
      const updateSelectedStudents = isSelected
        ? prevState.selectedStudents.filter((id) => id !== studentId)
        : [...prevState.selectedStudents, studentId];

      const allSelected =
        updateSelectedStudents.length === prevState.students.length;

      // console.log(updateSelectedStudents);

      return {
        ...prevState,
        selectedStudents: updateSelectedStudents,
        selectAllStudents: allSelected,
      };
    });
  };

  const handleDepartmentAndCourse = (student: Students) => {
    return `${student.department}/${student.course}`;
  };

  const handleYearLevelAndSection = (student: Students) => {
    return `${student.year_level}${student.section}`;
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

  const handleLoadEmployees = async (departmentId: number) => {
    setState((prevState) => ({
      ...prevState,
      loadingEmployees: true,
      employees: [] as Employees[],
    }));

    axiosInstance
      .get(`/employee/loadEmployeesByDepartment?departmentId=${departmentId}`)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            employees: res.data.employees,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingEmployees: false,
        }));
      });
  };

  const employeesFullName = (employee: Employees) => {
    let fullName = "";

    if (employee.middle_name) {
      fullName = `${employee.last_name}, ${
        employee.first_name
      } ${employee.middle_name.charAt(0)}`;
    } else {
      fullName = `${employee.last_name}, ${employee.first_name}`;
    }

    if (employee.suffix_name) {
      fullName += ` ${employee.suffix_name}`;
    }

    return fullName;
  };

  const handleSelectAllEmployees = () => {
    const allSelected = !state.selectAllEmployees;
    const updateSelectedEmployees = allSelected
      ? state.employees.map((employee) => employee.employee_id)
      : [];

    setState((prevState) => ({
      ...prevState,
      selectAllEmployees: allSelected,
      selectedEmployees: updateSelectedEmployees,
    }));

    console.log(updateSelectedEmployees);
  };

  const handleSelectEmployee = (employeeId: number) => {
    setState((prevState) => {
      const isSelected = prevState.selectedEmployees.includes(employeeId);
      const updateSelectedEmployees = isSelected
        ? prevState.selectedEmployees.filter((id) => id !== employeeId)
        : [...prevState.selectedEmployees, employeeId];

      const allSelected =
        updateSelectedEmployees.length === prevState.employees.length;

      console.log(updateSelectedEmployees);

      return {
        ...prevState,
        selectedEmployees: updateSelectedEmployees,
        selectAllEmployees: allSelected,
      };
    });
  };

  useEffect(() => {
    document.title = "SEND AN EVALUATION TO IRREGULAR STUDENTS | FCU HR EMS";

    handleLoadAcademicYears();
    handleLoadStudents();
    handleLoadDepartments();
    handleLoadStudentIds();
  }, [state.currentPage, state.search]);

  const content = (
    <>
      <form onSubmit={handleSendEvaluation}>
        <div className="mx-auto mt-2">
          <h4>SEND AN EVALUATION TO IRREGULAR STUDENTS</h4>
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
                  {state.academicYears.map((academic_year) => (
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
                <label htmlFor="search">SEARCH</label>
                <input
                  type="text"
                  className="form-control"
                  value={state.search}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="table-responsive">
              <div className="d-flex justify-content-end mb-2">
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-theme"
                    disabled={
                      state.loadingPage ||
                      state.loadingSearch ||
                      state.currentPage <= 1
                    }
                    onClick={() => handlePageChange(state.currentPage - 1)}
                  >
                    PREVIOUS
                  </button>
                  <button
                    type="button"
                    className="btn btn-theme"
                    disabled={
                      state.loadingPage ||
                      state.loadingSearch ||
                      state.currentPage >= state.lastPage
                    }
                    onClick={() => handlePageChange(state.currentPage + 1)}
                  >
                    NEXT
                  </button>
                </div>
              </div>
              <table className="table table-sm table-hover">
                <caption>LIST OF IRREGULAR STUDENTS</caption>
                <thead>
                  <tr>
                    <th className="text-center">
                      SELECT ALL
                      <input
                        type="checkbox"
                        className="form-check-input ms-2"
                        name="irregular_students_select_all"
                        id="irregular_students_select_all"
                        checked={state.students.every((student) =>
                          state.selectedStudents.includes(student.student_id)
                        )}
                        onChange={handleSelectAllStudents}
                      />
                    </th>
                    <th>NO.</th>
                    <th>STUDENT NO.</th>
                    <th>STUDENT NAME</th>
                    <th>DEPARTMENT/COURSE</th>
                    <th>SECTION</th>
                  </tr>
                </thead>
                <tbody>
                  {state.loadingPage || state.loadingSearch ? (
                    <tr>
                      <td colSpan={6}>
                        <Spinner />
                      </td>
                    </tr>
                  ) : (
                    state.students.map((student, index) => (
                      <tr key={student.student_id}>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="irregular_student_select"
                            id={`irregular_student_select_${student.student_id}`}
                            checked={state.selectedStudents.includes(
                              student.student_id
                            )}
                            onChange={() =>
                              handleSelectStudent(student.student_id)
                            }
                          />
                        </td>
                        <td>{(state.currentPage - 1) * 10 + index + 1}</td>
                        <td>{student.student_no}</td>
                        <td>{handleStudentFullName(student)}</td>
                        <td>{handleDepartmentAndCourse(student)}</td>
                        <td>{handleYearLevelAndSection(student)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {state.errors.selectedStudents && (
                <p className="text-danger">
                  {state.errors.selectedStudents[0]}
                </p>
              )}
            </div>
          </div>
          <hr />
          <div className="row">
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
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <caption>LIST OF EMPLOYEES/TEACHERS/STAFFS</caption>
                <thead>
                  <tr>
                    <th className="text-center">
                      SELECT ALL
                      <input
                        type="checkbox"
                        className="form-check-input ms-2"
                        name="employees_select_all"
                        id="employees_select_all"
                        checked={state.selectAllEmployees}
                        onChange={handleSelectAllEmployees}
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
                            name="employee_select"
                            id={`employee_select_${employee.employee_id}`}
                            checked={state.selectedEmployees.includes(
                              employee.employee_id
                            )}
                            onChange={() =>
                              handleSelectEmployee(employee.employee_id)
                            }
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>{employeesFullName(employee)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {state.errors.selectedEmployees && (
                <p className="text-danger">
                  {state.errors.selectedEmployees[0]}
                </p>
              )}
            </div>
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
        state.loadingStudents ||
        state.loadingDepartments ||
        state.loadingStudentIds ? (
          <Spinner />
        ) : (
          content
        )
      }
    />
  );
};

export default SendAnEvaluationToIrregularStudents;
