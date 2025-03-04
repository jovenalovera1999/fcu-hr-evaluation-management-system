import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ToastMessage from "../../components/ToastMessage";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import { useNavigate } from "react-router-dom";
import { Col, Form, Row, Table } from "react-bootstrap";

interface AcademicYears {
  academic_year_id: number;
  academic_year: string;
}

interface Semesters {
  semester_id: number;
  semester: string;
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
  semester?: string[];
  department?: string[];
  employees_department?: string[];
  selectedEmployees?: string[];
}

const SendAnEvaluationToEmployees = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingSubmit: false,
    loadingAcademicYears: false,
    loadingSemesters: false,
    loadingDepartments: false,
    loadingEmployees: false,
    academic_years: [] as AcademicYears[],
    semesters: [] as Semesters[],
    departments: [] as Departments[],
    employees: [] as Employees[],
    academic_year: "",
    semester: "",
    department: "",
    employees_department: "",
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
      handleLoadSemesters(parseInt(value));
    } else if (name === "employees_department") {
      setState((prevState) => ({
        ...prevState,
        loadingEmployees: true,
      }));

      handleLoadEmployees();
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

  const handleSendEvaluation = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingSubmit: true,
    }));

    axiosInstance
      .post("/evaluation/store/evaluation/for/employees", state)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            employees: [] as Employees[],
            academic_year: "",
            department: "",
            employees_department: "",
            selectedEmployees: [] as number[],
            selectAll: false,
            errors: {} as Errors,
            loadingSubmit: false,
            toastMessage:
              "EVALUATIONS HAS BEEN SENT TO EMPLOYEES/TEACHERS/STAFFS!",
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

  const handleLoadAcademicYears = async () => {
    setState((prevState) => ({
      ...prevState,
      loadingAcademicYears: true,
      academic_years: [] as AcademicYears[],
    }));

    axiosInstance
      .get("/academic_year/index")
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            academic_years: res.data.academicYears,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingAcademicYears: false,
        }));
      });
  };

  const handleLoadSemesters = async (academicYearId: number) => {
    setState((prevState) => ({
      ...prevState,
      loadingSemesters: true,
      semesters: [] as Semesters[],
    }));

    axiosInstance
      .get(`/semester/load/semesters/by/academic_year/${academicYearId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            semesters: res.data.semesters,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingSemesters: false,
        }));
      });
  };

  const handleLoadDepartments = async () => {
    setState((prevState) => ({
      ...prevState,
      loadingDepartments: true,
      departments: [] as Departments[],
    }));

    axiosInstance
      .get("/department/index")
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            departments: res.data.departments,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingDepartments: false,
        }));
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
        `/employee/loadEmployeesByDepartment?departmentId=${state.employees_department}`
      )
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            employees: res.data.employees,
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
    document.title = "SEND AN EVALUATION TO EMPLOYEES | FCU HR EMS";

    if (
      !token ||
      !user ||
      !parsedUser ||
      !parsedUser.position ||
      parsedUser.position !== "ADMIN"
    ) {
      errorHandler(401, navigate, null);
    } else {
      handleLoadAcademicYears();
      handleLoadDepartments();
    }
  }, []);

  useEffect(() => {
    handleLoadEmployees();
  }, [state.employees_department]);

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
          <h4>SEND AN EVALUATION TO EMPLOYEES/TEACHERS/STAFFS</h4>
          <div className="row">
            <div className="col-sm-3">
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
            </div>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <select
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
                    <option value="">LOADING...</option>
                  ) : (
                    state.semesters.map((semester, index) => (
                      <option value={semester.semester_id} key={index}>
                        {semester.semester}
                      </option>
                    ))
                  )}
                </select>
                <label htmlFor="semester">SEMESTER</label>
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Select
                  name="department"
                  id="department"
                  className={`form-select ${
                    state.errors.department ? "is-invalid" : ""
                  }`}
                  value={state.errors.department}
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
                <label htmlFor="department">DEPARTMENT</label>
                {state.errors.department && (
                  <p className="text-danger">{state.errors.department[0]}</p>
                )}
              </Form.Floating>
            </Col>
          </div>
          <hr />
          <Row className="mt-3">
            <Col md={4}>
              <Form.Floating>
                <Form.Select
                  name="employees_department"
                  id="employees_department"
                  className={`form-select ${
                    state.errors.employees_department ? "is-invalid" : ""
                  }`}
                  value={state.employees_department}
                  onChange={handleInput}
                >
                  <option value="">SELECT EMPLOYEE'S DEPARTMENT</option>
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
                <p className="form-text">
                  CHOOSE AND SELECT TEACHER/EMPLOYEE/STAFF BY THEIR DEPARTMENT
                </p>
                {state.errors.employees_department && (
                  <p className="text-danger">
                    {state.errors.employees_department}
                  </p>
                )}
              </Form.Floating>
            </Col>
          </Row>
          <div className="table-responsive mb-3">
            <Table responsive hover>
              <thead>
                <tr className="align-middle">
                  <th className="text-center">
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
                  </th>
                  <th>NO.</th>
                  <th>NAME OF EMPLOYEES/TEACHERS/STAFFS</th>
                </tr>
              </thead>
              <tbody>
                {state.loadingEmployees ? (
                  <tr className="align-middle">
                    <td className="text-center" colSpan={3}>
                      <Spinner />
                    </td>
                  </tr>
                ) : (
                  state.employees.map((employee, index) => (
                    <tr className="align-middle" key={index}>
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
        (!state.loadingSubmit && state.loadingAcademicYears) ||
        (!state.loadingSubmit && state.loadingDepartments) ? (
          <Spinner />
        ) : (
          content
        )
      }
    />
  );
};

export default SendAnEvaluationToEmployees;
