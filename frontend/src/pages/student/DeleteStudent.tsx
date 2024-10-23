import { FormEvent, useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import { Link, useNavigate, useParams } from "react-router-dom";
import errorHandler from "../../handler/errorHandler";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";

const DeleteStudent = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const { student_id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingSubmit: false,
    loadingStudent: true,
    student_no: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix_name: "",
    department: "",
    course: "",
    section: "",
    year_level: "",
    irregular: false,
  });

  const handleDeleteStudent = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingSubmit: true,
    }));

    axiosInstance
      .put(`/student/delete/student/${student_id}`)
      .then((res) => {
        if (res.data.status === 200) {
          navigate("/student/list", {
            state: {
              toastMessage: "STUDENT SUCCESSFULLY DELETED!",
              toastMessageSuccess: true,
              toastMessageVisible: true,
            },
          });
        } else {
          console.log("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const handleGetStudent = async () => {
    axiosInstance
      .get(`/student/get/student/${student_id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            student_no: res.data.student.student_no,
            first_name: res.data.student.first_name,
            middle_name: res.data.student.middle_name,
            last_name: res.data.student.last_name,
            suffix_name: res.data.student.suffix_name,
            department: res.data.student.department,
            course: res.data.student.course,
            section: res.data.student.section,
            year_level: res.data.student.year_level,
            irregular: res.data.student.is_irregular ? true : false,
            loadingStudent: false,
          }));
          // console.log(res.data.student);
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  useEffect(() => {
    if (
      !token ||
      !user ||
      !parsedUser ||
      parsedUser.position !== "ADMIN" ||
      !parsedUser.position
    ) {
      errorHandler(401);
    } else {
      handleGetStudent();
    }
  }, []);

  const content = (
    <>
      <form onSubmit={handleDeleteStudent}>
        <div className="mx-auto mt-2">
          <h4>DELETE STUDENT</h4>
          <div className="row">
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="student_no">STUDENT NO</label>
                <input
                  type="text"
                  className="form-control"
                  name="student_no"
                  id="student_no"
                  value={state.student_no}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="first_name">FIRST NAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  id="first_name"
                  value={state.first_name}
                  readOnly
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="middle_name">MIDDLE NAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="middle_name"
                  id="middle_name"
                  value={state.middle_name}
                  readOnly
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="last_name">LAST NAME</label>
                <input
                  type="text"
                  className="form-control"
                  id="last_name"
                  value={state.last_name}
                  readOnly
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="suffix_name">SUFFIX NAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="suffix_name"
                  id="suffix_name"
                  value={state.suffix_name}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="department">DEPARTMENT</label>
                <input
                  type="text"
                  className="form-control"
                  name="department"
                  id="department"
                  value={state.department}
                  readOnly
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="course">COURSE</label>
                <input
                  type="text"
                  className="form-control"
                  name="course"
                  id="course"
                  value={state.course}
                  readOnly
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="year_level">YEAR LEVEL</label>
                <input
                  type="text"
                  className="form-control"
                  name="year_level"
                  id="year_level"
                  value={state.year_level}
                  readOnly
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="section">SECTION</label>
                <input
                  type="text"
                  className="form-control"
                  name="section"
                  id="section"
                  value={state.section}
                  readOnly
                />
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
                    checked={state.irregular}
                    readOnly
                  />
                  <label className="form-check-label" htmlFor="irregular">
                    IS STUDENT IRREGULAR? IF NOT, UNCHECKED. OTHERWISE, CHECKED.
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <Link to={"/student/list"} className="btn btn-theme me-1">
              BACK
            </Link>
            <button type="submit" className="btn btn-theme">
              DELETE STUDENT
            </button>
          </div>
        </div>
      </form>
    </>
  );

  return (
    <Layout
      content={
        state.loadingSubmit || state.loadingStudent ? <Spinner /> : content
      }
    />
  );
};

export default DeleteStudent;
