import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ToastMessage from "../../components/ToastMessage";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import { Spinner, Table } from "react-bootstrap";

interface Employees {
  evaluation_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  department: string;
  position: string;
}

const Evaluations = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState({
    loadingEmployees: true,
    employees: [] as Employees[],
    studentId: "",
    employeeId: "",
    toastMessage: "",
    toastMessageSuccess: false,
    toastMessageVisible: false,
  });

  const handleLoadEmployees = async (
    studentId: string | number,
    employeeId: string | number
  ) => {
    axiosInstance
      .get(`/evaluation/index/${studentId}/${employeeId}`)
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
        errorHandler(error, navigate);
      });
  };

  const handleEmployeeFullName = (employee: Employees) => {
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

  const handleCloseToastMessage = () => {
    navigate(".", {
      replace: true,
      state: {
        ...location.state,
        toastMessage: "",
        toastMessageSuccess: false,
        toastMessageVisible: false,
      },
    });

    setState((prevState) => ({
      ...prevState,
      toastMessage: "",
      toastMessageSuccess: false,
      toastMessageVisible: false,
    }));
  };

  const handleToastMessageFromResponse = () => {
    if (location.state && location.state.toastMessage) {
      setState((prevState) => ({
        ...prevState,
        toastMessage: location.state.toastMessage,
        toastMessageSuccess: location.state.toastMessageSuccess,
        toastMessageVisible: location.state.toastMessageVisible,
      }));
    }
  };

  useEffect(() => {
    document.title = "EMPLOYEES EVALUATION | FCU HR EMS";

    if (!token || !user || !parsedUser) {
      errorHandler(401, navigate);
    } else {
      if (parsedUser.is_student) {
        handleLoadEmployees(parsedUser.student_id, 0);
      } else {
        handleLoadEmployees(0, parsedUser.employee_id);
      }

      handleToastMessageFromResponse();
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
      <div className="mx-auto mt-2">
        <Table hover size="sm" responsive="sm">
          <caption>LIST OF TEACHERS</caption>
          <thead>
            <tr className="align-middle">
              <th>NO.</th>
              <th>NAME OF EMPLOYEES</th>
              <th>DEPARTMENT</th>
              <th>POSITION</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {state.employees.map((employee, index) => (
              <tr className="align-middle" key={employee.evaluation_id}>
                <td>{index + 1}</td>
                <td>{handleEmployeeFullName(employee)}</td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>
                  <Link
                    to={`/evaluation/response/${employee.evaluation_id}`}
                    className="btn btn-sm btn-theme"
                  >
                    EVALUATE
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );

  return (
    <Layout
      content={
        state.loadingEmployees ? (
          <>
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
          </>
        ) : (
          content
        )
      }
    />
  );
};

export default Evaluations;
