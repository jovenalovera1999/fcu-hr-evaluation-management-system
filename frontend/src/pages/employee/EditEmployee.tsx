import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import errorHandler from "../../handler/errorHandler";
import axiosInstance from "../../axios/axiosInstance";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";
import ToastMessage from "../../components/ToastMessage";
import { Link, useParams } from "react-router-dom";

interface Positions {
  position_id: number;
  position: string;
}

interface Departments {
  department_id: number;
  department: string;
}

interface Errors {
  first_name?: string[];
  middle_name?: string[];
  last_name?: string[];
  suffix_name?: string[];
  position?: string[];
  department?: string[];
  username?: string[];
}

const EditEmployee = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const { employee_id } = useParams();

  const [state, setState] = useState({
    loadingSubmit: false,
    loadingEmployee: true,
    loadingPositions: true,
    loadingDepartments: true,
    positions: [] as Positions[],
    departments: [] as Departments[],
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix_name: "",
    position: "",
    department: "",
    username: "",
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
  };

  const handleUpdateEmployee = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingSubmit: true,
    }));

    axiosInstance
      .put("")
      .then()
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          errorHandler(error);
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

  const handleGetEmployee = async () => {
    axiosInstance
      .get(`/employee/get/employee/${employee_id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            first_name: res.data.employee.first_name,
            middle_name: res.data.employee.middle_name,
            last_name: res.data.employee.last_name,
            suffix_name: res.data.employee.suffix_name,
            position: res.data.employee.position_id,
            department: res.data.employee.department_id,
            username: res.data.employee.username,
            loadingEmployee: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const handleLoadPositions = async () => {
    axiosInstance
      .get("/position/index")
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            loadingPositions: false,
            positions: res.data.positions,
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
            loadingDepartments: false,
            departments: res.data.departments,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  useEffect(() => {
    document.title = "ADD EMPLOYEE | FCU HR EMS";

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
      handleGetEmployee();
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
      <form>
        <div className="mx-auto mt-2">
          <h4>ADD EMPLOYEE</h4>
          <div className="row">
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="first_name">FIRST NAME</label>
                <input
                  type="text"
                  className={`form-control ${
                    state.errors.first_name ? "is-invalid" : ""
                  }`}
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
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="middle_name">MIDDLE NAME</label>
                <input
                  type="text"
                  className={`form-control ${
                    state.errors.middle_name ? "is-invalid" : ""
                  }`}
                  name="middle_name"
                  id="middle_name"
                  value={state.middle_name}
                  onChange={handleInput}
                />
                {state.errors.middle_name && (
                  <p className="text-danger">{state.errors.middle_name[0]}</p>
                )}
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="last_name">LAST NAME</label>
                <input
                  type="text"
                  className={`form-control ${
                    state.errors.last_name ? "is-invalid" : ""
                  }`}
                  name="last_name"
                  id="last_name"
                  value={state.last_name}
                  onChange={handleInput}
                />
                {state.errors.last_name && (
                  <p className="text-danger">{state.errors.last_name[0]}</p>
                )}
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="suffix_name">SUFFIX NAME</label>
                <input
                  type="text"
                  className={`form-control ${
                    state.errors.suffix_name ? "is-invalid" : ""
                  }`}
                  name="suffix_name"
                  id="suffix_name"
                  value={state.suffix_name}
                  onChange={handleInput}
                />
                {state.errors.suffix_name && (
                  <p className="text-danger">{state.errors.suffix_name[0]}</p>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="position">POSITION</label>
                <select
                  name="position"
                  id="position"
                  className={`form-select ${
                    state.errors.position ? "is-invalid" : ""
                  }`}
                  value={state.position}
                  onChange={handleInput}
                >
                  <option value="">N/A</option>
                  {state.positions.map((position) => (
                    <option
                      value={position.position_id}
                      key={position.position_id}
                    >
                      {position.position}
                    </option>
                  ))}
                </select>
                {state.errors.position && (
                  <p className="text-danger">{state.errors.position[0]}</p>
                )}
              </div>
            </div>
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="department">DEPARTMENT</label>
                <select
                  name="department"
                  id="department"
                  className={`form-select ${
                    state.errors.department ? "is-invalid" : ""
                  }`}
                  value={state.department}
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
                {state.errors.department && (
                  <p className="text-danger">{state.errors.department[0]}</p>
                )}
              </div>
            </div>
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="username">USERNAME</label>
                <input
                  type="text"
                  className={`form-control ${
                    state.errors.username ? "is-invalid" : ""
                  }`}
                  name="username"
                  id="username"
                  value={state.username}
                  onChange={handleInput}
                />
                {state.errors.username && (
                  <p className="text-danger">{state.errors.username[0]}</p>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <Link to={"/employee/list"} className="btn btn-theme me-1">
              BACK
            </Link>
            <button type="submit" className="btn btn-theme">
              UPDATE EMPLOYEE
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
        state.loadingEmployee ||
        state.loadingDepartments ||
        state.loadingPositions ? (
          <Spinner />
        ) : (
          content
        )
      }
    />
  );
};

export default EditEmployee;