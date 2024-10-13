import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import Spinner from "../../components/Spinner";
import { debounce } from "chart.js/helpers";

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
  employees_department: string[];
}

const SendAnEvaluationToIrregularStudents = () => {
  const [state, setState] = useState({
    loadingStudents: true,
    loadingDepartments: true,
    loadingEmployees: false,
    loadingPage: false,
    loadingSearch: false,
    students: [] as Students[],
    departments: [] as Departments[],
    employees: [] as Employees[],
    search: "",
    employees_department: "",
    currentPage: 1,
    lastPage: 1,
    selectedStudents: [] as number[],
    selectAllStudents: false,
    errors: {} as Errors,
  });

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "employees_department") {
      setState((prevState) => ({
        ...prevState,
        loadingEmployees: true,
      }));

      handleLoadEmployees(parseInt(value));
    }
  };

  const handleLoadStudents = async (page: number = state.currentPage) => {
    let endpoint = `/student/load/irregular/students?page=${page}`;

    if (state.search) {
      endpoint = `/student/load/irregular/students/search?page=${page}&search=${state.search}`;
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
        errorHandler(error);
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

  const handleSelectAllStudent = () => {
    const allSelected = !state.selectAllStudents;
    const currentStudentIds = state.students.map(
      (student) => student.student_id
    );

    setState((prevState) => {
      let updatedSelectedStudents = [...prevState.selectedStudents];

      if (allSelected) {
        currentStudentIds.forEach((id) => {
          if (!updatedSelectedStudents.includes(id)) {
            updatedSelectedStudents.push(id);
          }
        });
      } else {
        updatedSelectedStudents = updatedSelectedStudents.filter(
          (id) => !currentStudentIds.includes(id)
        );
      }

      return {
        ...prevState,
        selectAllStudents: allSelected,
        selectedStudents: updatedSelectedStudents,
      };
    });
  };

  const handleSelectStudent = (studentId: number) => {
    setState((prevState) => {
      const isSelected = prevState.selectedStudents.includes(studentId);
      const updateSelectedStudents = isSelected
        ? prevState.selectedStudents.filter((id) => id !== studentId)
        : [...prevState.selectedStudents, studentId];

      const allSelected =
        updateSelectedStudents.length === prevState.students.length;

      console.log(updateSelectedStudents);

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
        errorHandler(error);
      });
  };

  const handleLoadEmployees = async (departmentId: number) => {
    axiosInstance
      .get(`/employee/index/by/department/${departmentId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            employees: res.data.employees,
            loadingEmployees: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
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

  useEffect(() => {
    document.title = "SEND AN EVALUATION TO IRREGULAR STUDENTS | FCU HR EMS";

    handleLoadStudents();
    handleLoadDepartments();
  }, [state.currentPage, state.search]);

  const content = (
    <>
      <div className="mx-auto mt-2">
        <h4>SEND AN EVALUATION TO IRREGULAR STUDENTS</h4>
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
          <div className="mb-3">
            <div className="table-responsive">
              <div className="d-flex justify-content-end">
                <div className="btn-group">
                  <button
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
                        onChange={handleSelectAllStudent}
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
            </div>
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
              <p className="text-danger">{state.errors.employees_department}</p>
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
                      name="select_all"
                      id="select_all"
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
                    <tr>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="employee_select"
                          id={`employee_select_${employee.employee_id}`}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{employeesFullName(employee)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Layout
      content={
        state.loadingStudents || state.loadingDepartments ? (
          <Spinner />
        ) : (
          content
        )
      }
    />
  );
};

export default SendAnEvaluationToIrregularStudents;
