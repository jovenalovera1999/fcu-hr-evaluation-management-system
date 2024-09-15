import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import Spinner from "../../components/Spinner";
import ToastMessage from "../../components/ToastMessage";
import { useNavigate } from "react-router-dom";

interface AddEmployeeProps {
  baseUrl: string;
  csrfToken: string | null | undefined;
}

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
  password?: string[];
  password_confirmation?: string[];
}

const AddEmployee = ({ baseUrl, csrfToken }: AddEmployeeProps) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingSave: false,
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
    password: "",
    password_confirmation: "",
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

  const handleSaveEmployee = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingSave: true,
    }));

    await axios
      .post(`${baseUrl}/employee/store`, state, {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
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
            loadingSave: false,
            toastMessage: "EMPLOYEE SUCCESSFULLY SAVED.",
            toastMessageSuccess: true,
            toastMessageVisible: true,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else if (error.response && error.response.data.errors) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
            loadingSave: false,
          }));
        } else {
          console.error("Unexpected server error: ", error);
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

  const handleLoadPositions = async () => {
    await axios
      .get(`${baseUrl}/position/index`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else {
          console.error("Unexpected server error: ", error);
        }
      });
  };

  const handleLoadDepartments = async () => {
    await axios
      .get(`${baseUrl}/department/index`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else {
          console.error("Unexpected server error: ", error);
        }
      });
  };

  useEffect(() => {
    document.title = "ADD EMPLOYEE | FCU HR EMS";

    handleLoadPositions();
    handleLoadDepartments();
  }, []);

  const content = (
    <>
      <ToastMessage
        message={state.toastMessage}
        success={state.toastMessageSuccess}
        visible={state.toastMessageVisible}
        onClose={handleCloseToastMessage}
      />
      <form onSubmit={handleSaveEmployee}>
        <div className="card shadow mx-auto mt-3 p-3">
          <h5 className="card-title">ADD EMPLOYEE</h5>
          <div className="card-body">
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
            </div>
            <div className="row">
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
              <div className="col-sm-4">
                <div className="mb-3">
                  <label htmlFor="password">PASSWORD</label>
                  <input
                    type="password"
                    className={`form-control ${
                      state.errors.password ? "is-invalid" : ""
                    }`}
                    name="password"
                    id="password"
                    value={state.password}
                    onChange={handleInput}
                  />
                  {state.errors.password && (
                    <p className="text-danger">{state.errors.password[0]}</p>
                  )}
                </div>
              </div>
              <div className="col-sm-4">
                <div className="mb-3">
                  <label htmlFor="password_confirmation">
                    CONFIRM PASSWORD
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
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
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-theme">
                SAVE EMPLOYEE
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );

  return (
    <Layout
      content={
        state.loadingSave ||
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

export default AddEmployee;
