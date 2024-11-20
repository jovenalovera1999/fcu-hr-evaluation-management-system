import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import {
  Button,
  ButtonGroup,
  Col,
  FormControl,
  FormLabel,
  FormSelect,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import AlertToastMessage from "../../components/AlertToastMessage";

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

  const [state, setState] = useState({
    loadingDepartments: true,
    loadingPositions: true,
    loadingEmployees: false,
    loadingEmployee: false,
    departments: [] as Departments[],
    positions: [] as Positions[],
    employees: [] as Employees[],
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
      setState((prevState) => ({
        ...prevState,
        loadingEmployees: true,
      }));

      handleLoadEmployees(parseInt(value));
    }
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
        errorHandler(error);
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
          handleLoadEmployees(parseInt(state.employee_department));

          handleResetNecessaryFields();

          setState((prevState) => ({
            ...prevState,
            toastSuccess: true,
            toastBody: "EMPLOYEE SUCCESSFULLY SAVED.",
            showToast: true,
            loadingEmployee: false,
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
            loadingEmployee: false,
          }));
        } else {
          errorHandler(error);
        }
      });
  };

  const handleUpdateEmployee = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingEmployee: true,
    }));

    axiosInstance
      .put(`/employee/update/${state.employee_id}`, state)
      .then((res) => {
        if (res.data.status === 200) {
          handleLoadEmployees(parseInt(state.employee_department));

          handleResetNecessaryFields();

          setState((prevState) => ({
            ...prevState,
            toastSuccess: true,
            toastBody: "EMPLOYEE SUCCESSFULLY UPDATED.",
            showToast: true,
            loadingEmployee: false,
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
            loadingEmployee: false,
          }));
        } else {
          errorHandler(error);
        }
      });
  };

  const handleUpdateEmployeePassword = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingEmployee: true,
    }));

    axiosInstance
      .put(`/employee/update/password/${state.employee_id}`, state)
      .then((res) => {
        if (res.data.status === 200) {
          handleResetNecessaryFields();

          setState((prevState) => ({
            ...prevState,
            toastSuccess: true,
            toastBody: "EMPLOYEE PASSWORD SUCCESSFULLY UPDATED.",
            showToast: true,
            loadingEmployee: false,
            showChangePasswordModal: false,
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            toastSuccess: false,
            toastBody: "FAILED TO UPDATE EMPLOYEE PASSWORD.",
            showToast: true,
            loadingEmployee: false,
          }));
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
            loadingEmployee: false,
          }));
        } else {
          errorHandler(error);
        }
      });
  };

  const handleDeleteEmployee = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingEmployee: true,
    }));

    axiosInstance
      .put(`/employee/delete/${state.employee_id}`)
      .then((res) => {
        if (res.data.status === 200) {
          handleLoadEmployees(parseInt(state.employee_department));

          handleResetNecessaryFields();

          setState((prevState) => ({
            ...prevState,
            toastSuccess: true,
            toastBody: "EMPLOYEE SUCCESSFULLY UPDATED.",
            showToast: true,
            loadingEmployee: false,
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
            loadingEmployee: false,
          }));
        } else {
          errorHandler(error);
        }
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
      errorHandler(401);
    } else {
      handleLoadPositions();
      handleLoadDepartments();
    }
  }, []);

  const content = (
    <>
      <AlertToastMessage
        success={state.toastSuccess}
        body={state.toastBody}
        showToast={state.showToast}
        onClose={handleCloseToast}
      />
      <div className="mx-auto mt-2">
        <div className="mb-3">
          <div className="d-flex justify-content-end">
            <Button className="btn-theme" onClick={handleOpenAddEmployeeModal}>
              ADD EMPLOYEE
            </Button>
          </div>
        </div>
        <Col sm={3}>
          <div className="mb-3">
            <FormLabel htmlFor="employee_department">DEPARTMENT</FormLabel>
            <FormSelect
              name="employee_department"
              id="employee_department"
              value={state.employee_department}
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
            </FormSelect>
          </div>
        </Col>
        <Table hover size="sm" responsive="sm">
          <caption>LIST OF EMPLOYEES</caption>
          <thead>
            <tr>
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
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    className="spinner-theme"
                  />
                </td>
              </tr>
            ) : (
              state.employees.map((employee, index) => (
                <tr key={employee.employee_id} className="align-middle">
                  <td>{index + 1}</td>
                  <td>{handleEmployeeFullName(employee)}</td>
                  <td>{employee.position}</td>
                  <td>
                    <ButtonGroup>
                      <Button
                        className="btn-theme"
                        size="sm"
                        onClick={() => handleOpenChangePasswordModal(employee)}
                      >
                        CHANGE PASSWORD
                      </Button>
                      <Button
                        className="btn-theme"
                        size="sm"
                        onClick={() => handleOpenEditEmployeeModal(employee)}
                      >
                        EDIT
                      </Button>
                      <Button
                        className="btn-theme"
                        size="sm"
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
        size="sm"
        show={state.showChangePasswordModal}
        onHide={handleCloseChangePasswordModal}
        backdrop="static"
      >
        <ModalHeader>CHANGE PASSWORD</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <FormLabel htmlFor="password">NEW PASSWORD</FormLabel>
            <FormControl
              type="password"
              name="password"
              className={`${state.errors.password ? "is-invalid" : ""}`}
              id="password"
              value={state.password}
              onChange={handleInput}
              autoFocus
            />
            {state.errors.password && (
              <p className="text-danger">{state.errors.password[0]}</p>
            )}
          </div>
          <div className="mb-3">
            <FormLabel htmlFor="password_confirmation">
              PASSWORD CONFIRMATION
            </FormLabel>
            <FormControl
              type="password"
              className={`${
                state.errors.password_confirmation ? "is-invalid" : ""
              }`}
              name="password_confirmation"
              id="password_confirmation"
              value={state.password_confirmation}
              onChange={handleInput}
            />
            {state.errors.password_confirmation && (
              <p className="text-danger">
                {state.errors.password_confirmation[0]}
              </p>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-theme"
            onClick={handleCloseChangePasswordModal}
            disabled={state.loadingEmployee}
          >
            CLOSE
          </Button>
          <Button
            className="btn-theme"
            onClick={handleUpdateEmployeePassword}
            disabled={state.loadingEmployee}
          >
            {state.loadingEmployee ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  size="sm"
                  className="spinner-theme"
                />{" "}
                UPDATING...
              </>
            ) : (
              "SAVE"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        show={state.showAddEmployeeModal}
        onHide={handleCloseAddEmployeeModal}
        fullscreen={true}
        backdrop="static"
      >
        <ModalHeader>ADD EMPLOYEE</ModalHeader>
        <ModalBody>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="first_name">FIRST NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.first_name ? "is-invalid" : ""}`}
                  name="first_name"
                  id="first_name"
                  value={state.first_name}
                  onChange={handleInput}
                  autoFocus
                />
                {state.errors.first_name && (
                  <p className="text-danger">{state.errors.first_name[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="middle_name">MIDDLE NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.middle_name ? "is-invalid" : ""}`}
                  name="middle_name"
                  id="middle_name"
                  value={state.middle_name}
                  onChange={handleInput}
                />
                {state.errors.middle_name && (
                  <p className="text-danger">{state.errors.middle_name[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="last_name">LAST NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.last_name ? "is-invalid" : ""}`}
                  name="last_name"
                  id="last_name"
                  value={state.last_name}
                  onChange={handleInput}
                />
                {state.errors.last_name && (
                  <p className="text-danger">{state.errors.last_name[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="suffix_name">SUFFIX NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.suffix_name ? "is-invalid" : ""}`}
                  name="suffix_name"
                  id="suffix_name"
                  value={state.suffix_name}
                  onChange={handleInput}
                />
                {state.errors.suffix_name && (
                  <p className="text-danger">{state.errors.suffix_name[0]}</p>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="position">POSITION</FormLabel>
                <FormSelect
                  className={`${state.errors.position ? "is-invalid" : ""}`}
                  name="position"
                  id="position"
                  value={state.position}
                  onChange={handleInput}
                >
                  <option value="" key={1}>
                    N/A
                  </option>
                  {state.positions.map((position) => (
                    <option
                      value={position.position_id}
                      key={position.position_id}
                    >
                      {position.position}
                    </option>
                  ))}
                </FormSelect>
                {state.errors.position && (
                  <p className="text-danger">{state.errors.position[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="department">DEPARTMENT</FormLabel>
                <FormSelect
                  className={`${state.errors.department ? "is-invalid" : ""}`}
                  name="department"
                  id="department"
                  value={state.department}
                  onChange={handleInput}
                >
                  <option value="" key={1}>
                    N/A
                  </option>
                  {state.departments.map((department) => (
                    <option
                      value={department.department_id}
                      key={department.department_id}
                    >
                      {department.department}
                    </option>
                  ))}
                </FormSelect>
                {state.errors.department && (
                  <p className="text-danger">{state.errors.department[0]}</p>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="username">USERNAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.username ? "is-invalid" : ""}`}
                  name="username"
                  id="username"
                  value={state.username}
                  onChange={handleInput}
                />
                {state.errors.username && (
                  <p className="text-danger">{state.errors.username[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="password">PASSWORD</FormLabel>
                <FormControl
                  type="password"
                  className={`${state.errors.password ? "is-invalid" : ""}`}
                  name="password"
                  id="password"
                  value={state.password}
                  onChange={handleInput}
                />
                {state.errors.password && (
                  <p className="text-danger">{state.errors.password[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="password_confirmation">
                  CONFIRM PASSWORD
                </FormLabel>
                <FormControl
                  type="password"
                  className={`${
                    state.errors.password_confirmation ? "is-invalid" : ""
                  }`}
                  name="password_confirmation"
                  id="password_confirmation"
                  value={state.password_confirmation}
                  onChange={handleInput}
                />
                {state.errors.password_confirmation && (
                  <p className="text-danger">
                    {state.errors.password_confirmation[0]}
                  </p>
                )}
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-theme"
            onClick={handleCloseAddEmployeeModal}
            disabled={state.loadingEmployee}
          >
            CLOSE
          </Button>
          <Button
            className="btn-theme"
            onClick={handleStoreEmployee}
            disabled={state.loadingEmployee}
          >
            {state.loadingEmployee ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  size="sm"
                  className="spinner-theme"
                />{" "}
                SAVING...
              </>
            ) : (
              "SAVE"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        show={state.showEditEmployeeModal}
        onHide={handleCloseEditEmployeeModal}
        fullscreen={true}
        backdrop="static"
      >
        <ModalHeader>EDIT EMPLOYEE</ModalHeader>
        <ModalBody>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="first_name">FIRST NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.first_name ? "is-invalid" : ""}`}
                  name="first_name"
                  id="first_name"
                  value={state.first_name}
                  onChange={handleInput}
                  autoFocus
                />
                {state.errors.first_name && (
                  <p className="text-danger">{state.errors.first_name[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="middle_name">MIDDLE NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.middle_name ? "is-invalid" : ""}`}
                  name="middle_name"
                  id="middle_name"
                  value={state.middle_name}
                  onChange={handleInput}
                />
                {state.errors.middle_name && (
                  <p className="text-danger">{state.errors.middle_name[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="last_name">LAST NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.last_name ? "is-invalid" : ""}`}
                  name="last_name"
                  id="last_name"
                  value={state.last_name}
                  onChange={handleInput}
                />
                {state.errors.last_name && (
                  <p className="text-danger">{state.errors.last_name[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="suffix_name">SUFFIX NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.suffix_name ? "is-invalid" : ""}`}
                  name="suffix_name"
                  id="suffix_name"
                  value={state.suffix_name}
                  onChange={handleInput}
                />
                {state.errors.suffix_name && (
                  <p className="text-danger">{state.errors.suffix_name[0]}</p>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="position">POSITION</FormLabel>
                <FormSelect
                  className={`${state.errors.position ? "is-invalid" : ""}`}
                  name="position"
                  id="position"
                  value={state.position}
                  onChange={handleInput}
                >
                  <option value="" key={1}>
                    N/A
                  </option>
                  {state.positions.map((position) => (
                    <option
                      value={position.position_id}
                      key={position.position_id}
                    >
                      {position.position}
                    </option>
                  ))}
                </FormSelect>
                {state.errors.position && (
                  <p className="text-danger">{state.errors.position[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="department">DEPARTMENT</FormLabel>
                <FormSelect
                  className={`${state.errors.department ? "is-invalid" : ""}`}
                  name="department"
                  id="department"
                  value={state.department}
                  onChange={handleInput}
                >
                  <option value="" key={1}>
                    N/A
                  </option>
                  {state.departments.map((department) => (
                    <option
                      value={department.department_id}
                      key={department.department_id}
                    >
                      {department.department}
                    </option>
                  ))}
                </FormSelect>
                {state.errors.department && (
                  <p className="text-danger">{state.errors.department[0]}</p>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="username">USERNAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.username ? "is-invalid" : ""}`}
                  name="username"
                  id="username"
                  value={state.username}
                  onChange={handleInput}
                />
                {state.errors.username && (
                  <p className="text-danger">{state.errors.username[0]}</p>
                )}
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-theme"
            onClick={handleCloseEditEmployeeModal}
            disabled={state.loadingEmployee}
          >
            CLOSE
          </Button>
          <Button
            className="btn-theme"
            onClick={handleUpdateEmployee}
            disabled={state.loadingEmployee}
          >
            {state.loadingEmployee ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  size="sm"
                  className="spinner-theme"
                />{" "}
                UPDATING...
              </>
            ) : (
              "SAVE"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        show={state.showDeleteEmployeeModal}
        onHide={handleCloseDeleteEmployeeModal}
        fullscreen={true}
        backdrop="static"
      >
        <ModalHeader>
          ARE YOU SURE YOU WANT TO DELETE THIS EMPLOYEE?
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="first_name">FIRST NAME</FormLabel>
                <FormControl
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={state.first_name}
                  readOnly
                />
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="middle_name">MIDDLE NAME</FormLabel>
                <FormControl
                  type="text"
                  name="middle_name"
                  id="middle_name"
                  value={state.middle_name}
                  readOnly
                />
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="last_name">LAST NAME</FormLabel>
                <FormControl
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={state.last_name}
                  readOnly
                />
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="suffix_name">SUFFIX NAME</FormLabel>
                <FormControl
                  type="text"
                  name="suffix_name"
                  id="suffix_name"
                  value={state.suffix_name}
                  readOnly
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="position">POSITION</FormLabel>
                <FormControl
                  name="position"
                  id="position"
                  value={state.position}
                  readOnly
                />
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="department">DEPARTMENT</FormLabel>
                <FormControl
                  name="department"
                  id="department"
                  value={state.department}
                  readOnly
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="username">USERNAME</FormLabel>
                <FormControl
                  type="text"
                  name="username"
                  id="username"
                  value={state.username}
                  readOnly
                />
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-theme"
            onClick={handleCloseDeleteEmployeeModal}
            disabled={state.loadingEmployee}
          >
            CLOSE
          </Button>
          <Button
            className="btn-theme"
            onClick={handleDeleteEmployee}
            disabled={state.loadingEmployee}
          >
            {state.loadingEmployee ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  size="sm"
                  className="spinner-theme"
                />{" "}
                DELETING...
              </>
            ) : (
              "YES"
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  return (
    <Layout
      content={
        state.loadingPositions || state.loadingDepartments ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
          >
            <Spinner
              as="span"
              animation="border"
              role="status"
              className="spinner-theme"
            />
          </div>
        ) : (
          content
        )
      }
    />
  );
};

export default Employees;
