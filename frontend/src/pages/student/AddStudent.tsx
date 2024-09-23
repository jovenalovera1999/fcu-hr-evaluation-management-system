import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import Spinner from "../../components/Spinner";
import ToastMessage from "../../components/ToastMessage";
import { useNavigate } from "react-router-dom";

interface AddStudentProps {
  baseUrl: string;
  csrfToken: string | null | undefined;
}

interface Departments {
  department_id: number;
  department: string;
}

interface Courses {
  course_id: number;
  course: string;
}

interface Errors {
  first_name?: string[];
  middle_name?: string[];
  last_name?: string[];
  suffix_name?: string[];
  department?: string[];
  course?: string[];
  year_level?: string[];
  username?: string[];
  password?: string[];
  password_confirmation?: string[];
}

const AddStudent = ({ baseUrl, csrfToken }: AddStudentProps) => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingSave: false,
    loadingDepartments: true,
    loadingCourses: false,
    departments: [] as Departments[],
    courses: [] as Courses[],
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix_name: "",
    department: "",
    course: "",
    year_level: "",
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

    if (name === "department") {
      setState((prevState) => ({
        ...prevState,
        loadingCourses: true,
      }));

      handleLoadCourses(parseInt(value));
    }
  };

  const handleSaveStudent = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingSave: true,
    }));

    await axios
      .post(`${baseUrl}/student/store`, state, {
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
            department: "",
            course: "",
            year_level: "",
            username: "",
            password: "",
            password_confirmation: "",
            errors: {} as Errors,
            loadingSave: false,
            toastMessage: "STUDENT SUCCESSFULLY SAVED!",
            toastMessageSuccess: true,
            toastMessageVisible: true,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate("/", {
            state: {
              toastMessage:
                "UNAUTHORIZED! KINDLY LOGGED IN YOUR AUTHORIZED ACCOUNT!",
              toastMessageSuccess: false,
              toastMessageVisible: true,
            },
          });
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

  const handleLoadDepartments = async () => {
    await axios
      .get(`${baseUrl}/department/index`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
        if (error.response && error.response.status === 401) {
          navigate("/", {
            state: {
              toastMessage:
                "UNAUTHORIZED! KINDLY LOGGED IN YOUR AUTHORIZED ACCOUNT!",
              toastMessageSuccess: false,
              toastMessageVisible: true,
            },
          });
        } else {
          console.error("Unexpected server error: ", error);
        }
      });
  };

  const handleLoadCourses = async (departmentId: number) => {
    await axios
      .get(`${baseUrl}/course/index/${departmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
        if (error.response && error.response.status === 401) {
          navigate("/", {
            state: {
              toastMessage:
                "UNAUTHORIZED! KINDLY LOGGED IN YOUR AUTHORIZED ACCOUNT!",
              toastMessageSuccess: false,
              toastMessageVisible: true,
            },
          });
        } else {
          console.error("Unexpected server error: ", error);
        }
      });
  };

  useEffect(() => {
    document.title = "ADD STUDENT | FCU HR EMS";

    if (
      (!token && !user) ||
      (!token && !parsedUser) ||
      parsedUser.position !== "ADMIN" ||
      !parsedUser.position
    ) {
      navigate("/", {
        state: {
          toastMessage:
            "UNAUTHORIZED! KINDLY LOGGED IN YOUR AUTHORIZED ACCOUNT!",
          toastMessageSuccess: false,
          toastMessageVisible: true,
        },
      });
    } else {
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
      <form onSubmit={handleSaveStudent}>
        <div className="card shadow mx-auto mt-3 p-3">
          <h5 className="card-title">ADD STUDENT</h5>
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
                  <label htmlFor="course">COURSE</label>
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
                    {state.courses.map((course) => (
                      <option value={course.course_id} key={course.course_id}>
                        {course.course}
                      </option>
                    ))}
                  </select>
                  {state.errors.course && (
                    <p className="text-danger">{state.errors.course[0]}</p>
                  )}
                </div>
              </div>
              <div className="col-sm-2">
                <div className="mb-3">
                  <label htmlFor="year_level">YEAR LEVEL</label>
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
                    <p className="text-danger">{state.errors.year_level[0]}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-3">
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
              <div className="col-sm-3">
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
              <div className="col-sm-3">
                <label htmlFor="password_confirmation">CONFIRM PASSWORD</label>
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
                    {state.errors.password_confirmation}
                  </p>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-theme">
                SAVE STUDENT
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
        (!state.loadingSave && state.loadingCourses) ||
        (!state.loadingSave && state.loadingDepartments) ? (
          <Spinner />
        ) : (
          content
        )
      }
    />
  );
};

export default AddStudent;
