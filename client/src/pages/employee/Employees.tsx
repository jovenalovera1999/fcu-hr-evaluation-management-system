import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import ToastMessage from "../../components/ToastMessage";
import { useNavigate } from "react-router-dom";

interface Positions {
  position_id: number;
  position: string;
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
  position_id: string;
  position: string;
  department_id: string;
  department: string;
  username: string;
}

interface Errors {
  first_name?: string[];
  middle_name?: string[];
  last_name?: string[];
  suffix_name?: string[];
  position?: string[];
  department?: string[];
  username?: string[];
  password?: string[];
  password_confirmation?: string[];
}

const Employees = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingDepartments: false,
    loadingPositions: true,
    loadingEmployees: false,
    loadingEmployee: false,
    departments: [] as Departments[],
    positions: [] as Positions[],
    employees: [] as Employees[],
    employeesCurrentPage: 1,
    employeesLastPage: 1,
    employee_department: "",
    employee_id: 0,
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix_name: "",
    position: "",
    department: "",
    username: "",
    password: "",
    password_confirmation: "",
    errors: {} as Errors,
    showAddEmployeeModal: false,
    showChangePasswordModal: false,
    showEditEmployeeModal: false,
    showDeleteEmployeeModal: false,
    toastSuccess: false,
    toastBody: "",
    showToast: false,
  });

  const handleResetNecessaryFields = () => {
    setState((prevState) => ({
      ...prevState,
      employee_id: 0,
      first_name: "",
      middle_name: "",
      last_name: "",
      suffix_name: "",
      position: "",
      department: "",
      username: "",
      password: "",
      password_confirmation: "",
      errors: {} as Errors,
    }));
  };

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "employee_department") {
      handleEmployeesPageChange(1);
    }
  };

  const handleEmployeesPageChange = (page: number) => {
    setState((prevState) => ({
      ...prevState,
      employeesCurrentPage: page,
    }));
  };

  const handleLoadPositions = async () => {
    axiosInstance
      .get("/position/index")
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            positions: res.data.positions,
            loadingPositions: false,
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
        errorHandler(error, null, null);
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

    let apiRoute = `/employee/loadEmployees?page=${state.employeesCurrentPage}`;

    if (state.employee_department) {
      apiRoute = `/employee/loadEmployees?page=${state.employeesCurrentPage}&departmentId=${state.employee_department}`;
    }

    axiosInstance
      .get(apiRoute)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            employees: res.data.employees.data,
            employeesCurrentPage: res.data.employees.current_page,
            employeesLastPage: res.data.employees.last_page,
          }));
        } else {
          console.error("Unexpected status error: ", res.status);
        }
      })
      .catch((error) => {
        if (error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          errorHandler(error, null, null);
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingEmployees: false,
        }));
      });
  };

  const handleStoreEmployee = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingEmployee: true,
    }));

    axiosInstance
      .post("/employee/store", state)
      .then((res) => {
        if (res.data.status === 200) {
          handleLoadEmployees();

          handleResetNecessaryFields();

          setState((prevState) => ({
            ...prevState,
            toastSuccess: true,
            toastBody: "EMPLOYEE SUCCESSFULLY SAVED.",
            showToast: true,
            showAddEmployeeModal: false,
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
          }));
        } else {
          errorHandler(error, navigate, null);
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingEmployee: false,
        }));
      });
  };

  const handleUpdateEmployee = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingEmployee: true,
    }));

    axiosInstance
      .put(`/employee/updateEmployee/${state.employee_id}`, state)
      .then((res) => {
        if (res.status === 200) {
          handleLoadEmployees();

          handleResetNecessaryFields();

          setState((prevState) => ({
            ...prevState,
            toastSuccess: true,
            toastBody: res.data.message,
            showToast: true,
            showEditEmployeeModal: false,
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
          }));
        } else {
          errorHandler(error, navigate, null);
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingEmployee: false,
        }));
      });
  };

  const handleUpdateEmployeePassword = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingEmployee: true,
    }));

    axiosInstance
      .put(`/employee/updatePassword/${state.employee_id}`, state)
      .then((res) => {
        if (res.status === 200) {
          handleResetNecessaryFields();

          setState((prevState) => ({
            ...prevState,
            toastSuccess: true,
            toastBody: res.data.message,
            showToast: true,
            showChangePasswordModal: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          errorHandler(error, navigate, null);
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingEmployee: false,
        }));
      });
  };

  const handleDeleteEmployee = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingEmployee: true,
    }));

    axiosInstance
      .put(`/employee/deleteEmployee/${state.employee_id}`)
      .then((res) => {
        if (res.status === 200) {
          handleLoadEmployees();

          handleResetNecessaryFields();

          setState((prevState) => ({
            ...prevState,
            toastSuccess: true,
            toastBody: res.data.message,
            showToast: true,
            showDeleteEmployeeModal: false,
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
          }));
        } else {
          errorHandler(error, navigate, null);
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingEmployee: false,
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

  const handleOpenAddEmployeeModal = () => {
    setState((prevState) => ({
      ...prevState,
      showAddEmployeeModal: true,
    }));
  };

  const handleOpenEditEmployeeModal = (employee: Employees) => {
    setState((prevState) => ({
      ...prevState,
      employee_id: employee.employee_id,
      first_name: employee.first_name,
      middle_name: employee.middle_name,
      last_name: employee.last_name,
      suffix_name: employee.suffix_name,
      position: employee.position_id,
      department: employee.department_id,
      username: employee.username,
      showEditEmployeeModal: true,
    }));
  };

  const handleOpenDeleteEmployeeModal = (employee: Employees) => {
    setState((prevState) => ({
      ...prevState,
      employee_id: employee.employee_id,
      first_name: employee.first_name,
      middle_name: employee.middle_name,
      last_name: employee.last_name,
      suffix_name: employee.suffix_name,
      position: employee.position,
      department: employee.department,
      username: employee.username,
      showDeleteEmployeeModal: true,
    }));
  };

  const handleOpenChangePasswordModal = (employee: Employees) => {
    setState((prevState) => ({
      ...prevState,
      employee_id: employee.employee_id,
      showChangePasswordModal: true,
    }));
  };

  const handleCloseAddEmployeeModal = () => {
    setState((prevState) => ({
      ...prevState,
      employee_id: 0,
      errors: {} as Errors,
      showAddEmployeeModal: false,
    }));
  };

  const handleCloseEditEmployeeModal = () => {
    handleResetNecessaryFields();

    setState((prevState) => ({
      ...prevState,
      showEditEmployeeModal: false,
    }));
  };

  const handleCloseDeleteEmployeeModal = () => {
    handleResetNecessaryFields();

    setState((prevState) => ({
      ...prevState,
      showDeleteEmployeeModal: false,
    }));
  };

  const handleCloseChangePasswordModal = () => {
    handleResetNecessaryFields();

    setState((prevState) => ({
      ...prevState,
      showChangePasswordModal: false,
    }));
  };

  const handleCloseToast = () => {
    setState((prevState) => ({
      ...prevState,
      toastSuccess: false,
      toastBody: "",
      showToast: false,
    }));
  };

  useEffect(() => {
    document.title = "LIST OF EMPLOYEES | FCU HR EMS";

    if (
      !token ||
      !user ||
      !parsedUser ||
      parsedUser.position !== "ADMIN" ||
      !parsedUser.position
    ) {
      errorHandler(401, navigate, null);
    } else {
      handleLoadPositions();
      handleLoadDepartments();
      handleLoadEmployees();
    }
  }, []);

  useEffect(() => {
    handleLoadEmployees();
  }, [state.employee_department, state.employeesCurrentPage]);

  const content = (
    <>
      <ToastMessage
        success={state.toastSuccess}
        body={state.toastBody}
        showToast={state.showToast}
        onClose={handleCloseToast}
      />
      <div className="mx-auto mt-2">
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-3">EMPLOYEES</h3>
            <Button onClick={handleOpenAddEmployeeModal}>ADD EMPLOYEE</Button>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <Col md={3}>
            <Form.Floating className="mb-3">
              <Form.Select
                name="employee_department"
                id="employee_department"
                value={state.employee_department}
                onChange={handleInput}
              >
                <option value="">ALL DEPARTMENTS</option>
                {state.loadingDepartments ? (
                  <option value="">LOADING...</option>
                ) : (
                  state.departments.map((department, index) => (
                    <option value={department.department_id} key={index}>
                      {department.department}
                    </option>
                  ))
                )}
              </Form.Select>
              <label htmlFor="employee_department">DEPARTMENT</label>
            </Form.Floating>
          </Col>
          <ButtonGroup>
            <Button
              disabled={state.employeesCurrentPage <= 1}
              onClick={() =>
                handleEmployeesPageChange(state.employeesCurrentPage - 1)
              }
            >
              PREVIOUS
            </Button>
            <Button
              disabled={state.employeesCurrentPage >= state.employeesLastPage}
              onClick={() =>
                handleEmployeesPageChange(state.employeesCurrentPage + 1)
              }
            >
              NEXT
            </Button>
          </ButtonGroup>
        </div>
        <Table hover responsive>
          <thead>
            <tr className="align-middle">
              <th>NO.</th>
              <th>NAME OF EMPLOYEES</th>
              <th>POSITION</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {state.loadingEmployees ? (
              <tr key={1} className="align-middle">
                <td colSpan={4} className="text-center">
                  <Spinner as="span" animation="border" role="status" />
                </td>
              </tr>
            ) : (
              state.employees.map((employee, index) => (
                <tr key={index} className="align-middle table-row">
                  <td>{(state.employeesCurrentPage - 1) * 10 + index + 1}</td>
                  <td>{handleEmployeeFullName(employee)}</td>
                  <td>{employee.position}</td>
                  <td>
                    <ButtonGroup className="table-button-group">
                      <Button
                        type="button"
                        onClick={() => handleOpenChangePasswordModal(employee)}
                      >
                        CHANGE PASSWORD
                      </Button>
                      <Button
                        type="button"
                        style={{
                          backgroundColor: "yellow",
                          borderColor: "yellow",
                          color: "black",
                        }}
                        onClick={() => handleOpenEditEmployeeModal(employee)}
                      >
                        EDIT
                      </Button>
                      <Button
                        type="button"
                        style={{
                          backgroundColor: "red",
                          borderColor: "red",
                          color: "white",
                        }}
                        onClick={() => handleOpenDeleteEmployeeModal(employee)}
                      >
                        DELETE
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <Modal
        show={state.showChangePasswordModal}
        onHide={handleCloseChangePasswordModal}
        backdrop="static"
      >
        <Form onSubmit={handleUpdateEmployeePassword}>
          <Modal.Header>CHANGE PASSWORD</Modal.Header>
          <Modal.Body>
            <Form.Floating className="mb-3">
              <Form.Control
                type="password"
                name="password"
                className={`${state.errors.password ? "is-invalid" : ""}`}
                id="password"
                placeholder="PASSWORD"
                value={state.password}
                onChange={handleInput}
                autoFocus
              />
              <label htmlFor="password">PASSWORD</label>
              {state.errors.password && (
                <p className="text-danger">{state.errors.password[0]}</p>
              )}
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="password"
                className={`${
                  state.errors.password_confirmation ? "is-invalid" : ""
                }`}
                name="password_confirmation"
                id="password_confirmation"
                placeholder="PASSWORD CONFIRMATION"
                value={state.password_confirmation}
                onChange={handleInput}
              />
              <label htmlFor="password_confirmation">
                PASSWORD CONFIRMATION
              </label>
              {state.errors.password_confirmation && (
                <p className="text-danger">
                  {state.errors.password_confirmation[0]}
                </p>
              )}
            </Form.Floating>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              onClick={handleCloseChangePasswordModal}
              disabled={state.loadingEmployee}
            >
              CLOSE
            </Button>
            <Button
              type="submit"
              onClick={handleUpdateEmployeePassword}
              disabled={state.loadingEmployee}
            >
              {state.loadingEmployee ? (
                <>
                  <Spinner as="span" animation="border" role="status" />{" "}
                  UPDATING...
                </>
              ) : (
                "SAVE"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={state.showAddEmployeeModal}
        onHide={handleCloseAddEmployeeModal}
        fullscreen={true}
        backdrop="static"
      >
        <Modal.Header>ADD EMPLOYEE</Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  className={`${state.errors.first_name ? "is-invalid" : ""}`}
                  name="first_name"
                  id="first_name"
                  placeholder=""
                  value={state.first_name}
                  onChange={handleInput}
                  autoFocus
                />
                <label htmlFor="first_name">FIRST NAME</label>
                {state.errors.first_name && (
                  <p className="text-danger">{state.errors.first_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  className={`${state.errors.middle_name ? "is-invalid" : ""}`}
                  name="middle_name"
                  id="middle_name"
                  placeholder=""
                  value={state.middle_name}
                  onChange={handleInput}
                />
                <label htmlFor="middle_name">MIDDLE NAME</label>
                {state.errors.middle_name && (
                  <p className="text-danger">{state.errors.middle_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  className={`${state.errors.last_name ? "is-invalid" : ""}`}
                  name="last_name"
                  id="last_name"
                  placeholder=""
                  value={state.last_name}
                  onChange={handleInput}
                />
                <label htmlFor="last_name">LAST NAME</label>
                {state.errors.last_name && (
                  <p className="text-danger">{state.errors.last_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  className={`${state.errors.suffix_name ? "is-invalid" : ""}`}
                  name="suffix_name"
                  id="suffix_name"
                  placeholder=""
                  value={state.suffix_name}
                  onChange={handleInput}
                />
                <label htmlFor="suffix_name">SUFFIX NAME</label>
                {state.errors.suffix_name && (
                  <p className="text-danger">{state.errors.suffix_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Select
                  className={`${state.errors.position ? "is-invalid" : ""}`}
                  name="position"
                  id="position"
                  value={state.position}
                  onChange={handleInput}
                >
                  <option value="">SELECT POSITION</option>
                  {state.loadingPositions ? (
                    <option value="">LOADING...</option>
                  ) : (
                    state.positions.map((position, index) => (
                      <option value={position.position_id} key={index}>
                        {position.position}
                      </option>
                    ))
                  )}
                </Form.Select>
                <label htmlFor="position">POSITION</label>
                {state.errors.position && (
                  <p className="text-danger">{state.errors.position[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Select
                  className={`${state.errors.department ? "is-invalid" : ""}`}
                  name="department"
                  id="department"
                  value={state.department}
                  onChange={handleInput}
                >
                  <option value="">SELECT DEPARTMENT</option>
                  {state.loadingDepartments ? (
                    <option value="">LOADING...</option>
                  ) : (
                    state.departments.map((department, index) => (
                      <option value={department.department_id} key={index}>
                        {department.department}
                      </option>
                    ))
                  )}
                </Form.Select>
                <label htmlFor="department">DEPARTMENT</label>
                {state.errors.department && (
                  <p className="text-danger">{state.errors.department[0]}</p>
                )}
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  className={`${state.errors.username ? "is-invalid" : ""}`}
                  name="username"
                  id="username"
                  placeholder=""
                  value={state.username}
                  onChange={handleInput}
                />
                <label htmlFor="username">USERNAME</label>
                {state.errors.username && (
                  <p className="text-danger">{state.errors.username[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="password"
                  className={`${state.errors.password ? "is-invalid" : ""}`}
                  name="password"
                  id="password"
                  placeholder=""
                  value={state.password}
                  onChange={handleInput}
                />
                <label htmlFor="password">PASSWORD</label>
                {state.errors.password && (
                  <p className="text-danger">{state.errors.password[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="password"
                  className={`${
                    state.errors.password_confirmation ? "is-invalid" : ""
                  }`}
                  name="password_confirmation"
                  id="password_confirmation"
                  placeholder=""
                  value={state.password_confirmation}
                  onChange={handleInput}
                />
                <label htmlFor="password_confirmation">CONFIRM PASSWORD</label>
                {state.errors.password_confirmation && (
                  <p className="text-danger">
                    {state.errors.password_confirmation[0]}
                  </p>
                )}
              </Form.Floating>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn-close-custom"
            onClick={handleCloseAddEmployeeModal}
            disabled={state.loadingEmployee}
          >
            CLOSE
          </Button>
          <Button
            type="submit"
            onClick={handleStoreEmployee}
            disabled={state.loadingEmployee}
          >
            {state.loadingEmployee ? (
              <>
                <Spinner as="span" animation="border" role="status" /> SAVING...
              </>
            ) : (
              "SAVE"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={state.showEditEmployeeModal}
        onHide={handleCloseEditEmployeeModal}
        fullscreen={true}
        backdrop="static"
      >
        <Modal.Header>EDIT EMPLOYEE</Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  className={`${state.errors.first_name ? "is-invalid" : ""}`}
                  name="first_name"
                  id="first_name"
                  placeholder=""
                  value={state.first_name}
                  onChange={handleInput}
                  autoFocus
                />
                <label htmlFor="first_name">FIRST NAME</label>
                {state.errors.first_name && (
                  <p className="text-danger">{state.errors.first_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  className={`${state.errors.middle_name ? "is-invalid" : ""}`}
                  name="middle_name"
                  id="middle_name"
                  placeholder=""
                  value={state.middle_name}
                  onChange={handleInput}
                />
                <label htmlFor="middle_name">MIDDLE NAME</label>
                {state.errors.middle_name && (
                  <p className="text-danger">{state.errors.middle_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  className={`${state.errors.last_name ? "is-invalid" : ""}`}
                  name="last_name"
                  id="last_name"
                  placeholder=""
                  value={state.last_name}
                  onChange={handleInput}
                />
                <label htmlFor="last_name">LAST NAME</label>
                {state.errors.last_name && (
                  <p className="text-danger">{state.errors.last_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  className={`${state.errors.suffix_name ? "is-invalid" : ""}`}
                  name="suffix_name"
                  id="suffix_name"
                  placeholder=""
                  value={state.suffix_name}
                  onChange={handleInput}
                />
                <label htmlFor="suffix_name">SUFFIX NAME</label>
                {state.errors.suffix_name && (
                  <p className="text-danger">{state.errors.suffix_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Select
                  className={`${state.errors.position ? "is-invalid" : ""}`}
                  name="position"
                  id="position"
                  value={state.position}
                  onChange={handleInput}
                >
                  <option value="">SELECT POSITION</option>
                  {state.loadingPositions ? (
                    <option value="">LOADING...</option>
                  ) : (
                    state.positions.map((position, index) => (
                      <option value={position.position_id} key={index}>
                        {position.position}
                      </option>
                    ))
                  )}
                </Form.Select>
                <label htmlFor="position">POSITION</label>
                {state.errors.position && (
                  <p className="text-danger">{state.errors.position[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Select
                  className={`${state.errors.department ? "is-invalid" : ""}`}
                  name="department"
                  id="department"
                  value={state.department}
                  onChange={handleInput}
                >
                  <option value="">SELECT DEPARTMENT</option>
                  {state.loadingDepartments ? (
                    <option value="">LOADING...</option>
                  ) : (
                    state.departments.map((department, index) => (
                      <option value={department.department_id} key={index}>
                        {department.department}
                      </option>
                    ))
                  )}
                </Form.Select>
                <label htmlFor="department">DEPARTMENT</label>
                {state.errors.department && (
                  <p className="text-danger">{state.errors.department[0]}</p>
                )}
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  className={`${state.errors.username ? "is-invalid" : ""}`}
                  name="username"
                  id="username"
                  placeholder=""
                  value={state.username}
                  onChange={handleInput}
                />
                <label htmlFor="username">USERNAME</label>
                {state.errors.username && (
                  <p className="text-danger">{state.errors.username[0]}</p>
                )}
              </Form.Floating>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn-close-custom"
            onClick={handleCloseEditEmployeeModal}
            disabled={state.loadingEmployee}
          >
            CLOSE
          </Button>
          <Button
            type="submit"
            onClick={handleUpdateEmployee}
            disabled={state.loadingEmployee}
          >
            {state.loadingEmployee ? (
              <>
                <Spinner as="span" animation="border" role="status" />{" "}
                UPDATING...
              </>
            ) : (
              "SAVE"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Employee Modal */}

      <Modal
        show={state.showDeleteEmployeeModal}
        onHide={handleCloseDeleteEmployeeModal}
        fullscreen={true}
        backdrop="static"
      >
        <Modal.Header>
          ARE YOU SURE YOU WANT TO DELETE THIS EMPLOYEE?
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={state.first_name}
                  readOnly
                />
                <label htmlFor="first_name">FIRST NAME</label>
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  name="middle_name"
                  id="middle_name"
                  value={state.middle_name}
                  readOnly
                />
                <label htmlFor="middle_name">MIDDLE NAME</label>
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={state.last_name}
                  readOnly
                />
                <label htmlFor="last_name">LAST NAME</label>
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  name="suffix_name"
                  id="suffix_name"
                  value={state.suffix_name}
                  readOnly
                />
                <label htmlFor="suffix_name">SUFFIX NAME</label>
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  name="position"
                  id="position"
                  value={state.position}
                  readOnly
                />
                <label htmlFor="position">POSITION</label>
              </Form.Floating>
            </Col>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  name="department"
                  id="department"
                  value={state.department}
                  readOnly
                />
                <label htmlFor="department">DEPARTMENT</label>
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  name="username"
                  id="username"
                  value={state.username}
                  readOnly
                />
                <label htmlFor="username">USERNAME</label>
              </Form.Floating>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn-close-custom"
            onClick={handleCloseDeleteEmployeeModal}
            disabled={state.loadingEmployee}
          >
            CLOSE
          </Button>
          <Button
            type="submit"
            onClick={handleDeleteEmployee}
            disabled={state.loadingEmployee}
          >
            {state.loadingEmployee ? (
              <>
                <Spinner as="span" animation="border" role="status" />{" "}
                DELETING...
              </>
            ) : (
              "YES"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

  return <Layout content={content} />;
};

export default Employees;
