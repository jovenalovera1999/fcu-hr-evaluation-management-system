import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";

const DeleteEmployee = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const { employee_id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingSubmit: false,
    loadingEmployee: true,
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix_name: "",
    position: "",
    department: "",
    username: "",
  });

  const handleDeleteEmployee = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingSubmit: true,
    }));

    axiosInstance
      .put(`/employee/delete/employee/${employee_id}`)
      .then((res) => {
        if (res.data.status === 200) {
          navigate("/employee/list", {
            state: {
              toastMessage: "EMPLOYEE SUCCESSFULLY DELETED!",
              toastMessageSuccess: true,
              toastMessageVisible: true,
            },
          });
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
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
            position: res.data.employee.position,
            department: res.data.employee.department,
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

  useEffect(() => {
    document.title = "DELETE EMPLOYEE | FCU HR EMS";

    if (
      !token ||
      !user ||
      !parsedUser ||
      parsedUser.position !== "ADMIN" ||
      !parsedUser.position
    ) {
      errorHandler(401);
    } else {
      handleGetEmployee();
    }
  }, []);

  const content = (
    <>
      <form onSubmit={handleDeleteEmployee}>
        <div className="mx-auto mt-2">
          <h4>DELETE EMPLOYEE</h4>
          <div className="form-text mb-2">
            ARE YOU SURE YOU DO WANT TO DELETE THIS EMPLOYEE?
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
                  name="last_name"
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
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="position">POSITION</label>
                <input
                  type="text"
                  className="form-control"
                  name="position"
                  id="position"
                  value={state.position}
                  readOnly
                />
              </div>
            </div>
            <div className="col-sm-4">
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
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="username">USERNAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  id="username"
                  value={state.username}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <Link to={"/employee/list"} className="btn btn-theme me-1">
              BACK
            </Link>
            <button type="submit" className="btn btn-theme">
              DELETE EMPLOYEE
            </button>
          </div>
        </div>
      </form>
    </>
  );

  return <Layout content={state.loadingEmployee ? <Spinner /> : content} />;
};

export default DeleteEmployee;
