import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";
import ToastMessage from "../../components/ToastMessage";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";

interface Departments {
  department_id: number;
  department: string;
}

interface Courses {
  course_id: number;
  course: string;
}

interface Sections {
  section_id: number;
  section: string;
}

interface Errors {
  student_no?: string[];
  first_name?: string[];
  middle_name?: string[];
  last_name?: string[];
  suffix_name?: string[];
  department?: string[];
  course?: string[];
  year_level?: string[];
  section?: string[];
  password?: string[];
  password_confirmation?: string[];
}

const AddStudent = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const [state, setState] = useState({
    loadingSave: false,
    loadingDepartments: true,
    loadingCourses: false,
    loadingSections: false,
    departments: [] as Departments[],
    courses: [] as Courses[],
    sections: [] as Sections[],
    student_no: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix_name: "",
    department: "",
    course: "",
    year_level: "",
    section: "",
    irregular: false,
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

    if (name === "course") {
      setState((prevState) => ({
        ...prevState,
        loadingSections: true,
      }));

      handleLoadSections(parseInt(value));
    }
  };

  const handleSaveStudent = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingSave: true,
    }));

    axiosInstance
      .post("/student/store", state)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            courses: [] as Courses[],
            sections: [] as Sections[],
            student_no: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            suffix_name: "",
            department: "",
            course: "",
            year_level: "",
            section: "",
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
        if (error.response && error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
            loadingSave: false,
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
        errorHandler(error);
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
        errorHandler(error);
      });
  };

  useEffect(() => {
    document.title = "ADD STUDENT | FCU HR EMS";

    if (
      !token ||
      !user ||
      !parsedUser ||
      parsedUser.position !== "ADMIN" ||
      !parsedUser.position
    ) {
      errorHandler(401);
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
        <div className="mx-auto mt-2">
          <h4>ADD STUDENT</h4>
          <div className="row">
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="student_no">STUDENT NO</label>
                <input
                  type="text"
                  className={`form-control ${
                    state.errors.student_no ? "is-invalid" : ""
                  }`}
                  name="student_no"
                  id="student_no"
                  value={state.student_no}
                  onChange={handleInput}
                  autoFocus
                />
                {state.errors.student_no && (
                  <p className="text-danger">{state.errors.student_no[0]}</p>
                )}
              </div>
            </div>
          </div>
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
            <div className="col-sm-3">
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
            <div className="col-sm-3">
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
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="section">SECTION</label>
                <select
                  name="section"
                  id="section"
                  className={`form-select ${
                    state.errors.section ? "is-invalid" : ""
                  }`}
                  value={state.section}
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
                {state.errors.section && (
                  <p className="text-danger">{state.errors.section[0]}</p>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <hr />
            <div className="mb-3">
              <div className="col-sm-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="irregular"
                    id="irregular"
                    value={1}
                    onChange={handleInput}
                  />
                  <label className="form-check-label" htmlFor="irregular">
                    IS STUDENT IRREGULAR? IF NOT, LEAVE IT.
                  </label>
                </div>
              </div>
            </div>
            <hr />
          </div>
          <div className="row mb-3">
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
      </form>
    </>
  );

  return (
    <Layout
      content={
        state.loadingSave || state.loadingDepartments ? <Spinner /> : content
      }
    />
  );
};

export default AddStudent;
