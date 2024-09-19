import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Link, useNavigate } from "react-router-dom";

interface EvaluationsProps {
  baseUrl: string;
}

interface Employees {
  evaluation_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  department: string;
  position: string;
}

const Evaluations = ({ baseUrl }: EvaluationsProps) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const [state, setState] = useState({
    loadingEmployees: true,
    employees: [] as Employees[],
    studentId: "",
    employeeId: "",
  });

  // const handleTypeOfUser = () => {
  //   if (parsedUser.is_student) {
  //     setState((prevState) => ({
  //       ...prevState,
  //       studentId: parsedUser.student_id,
  //       employeeId: "",
  //     }));
  //   } else {
  //     setState((prevState) => ({
  //       ...prevState,
  //       studentId: "",
  //       employeeId: parsedUser.employee_id,
  //     }));
  //   }
  // };

  const handleLoadEmployees = async (
    studentId: string | number,
    employeeId: string | number
  ) => {
    await axios
      .get(`${baseUrl}/evaluation/index/${studentId}/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else {
          console.error("Unexpected server error: ", error);
        }
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

  // const debounce = (func: Function, delay: number) => {
  //   let timeoutId: ReturnType<typeof setTimeout>;
  //   return (...args: any[]) => {
  //     clearTimeout(timeoutId);
  //     timeoutId = setTimeout(() => {
  //       func(...args);
  //     }, delay);
  //   };
  // };

  useEffect(() => {
    document.title = "EMPLOYEES EVALUATION | FCU HR EMS";

    // const loadEmployees = debounce(() => {
    //   if (parsedUser.is_student) {
    //     handleLoadEmployees(parsedUser.student_id, 0);
    //   } else {
    //     handleLoadEmployees(0, parsedUser.employee_id);
    //   }
    // }, 3000);

    // loadEmployees();

    if (parsedUser.is_student) {
      handleLoadEmployees(parsedUser.student_id, 0);
    } else {
      handleLoadEmployees(0, parsedUser.employee_id);
    }
  }, []);

  const content = (
    <>
      <div className="card shadow mx-auto mt-3 p-3">
        <h5 className="card-title">LIST OF TEACHERS</h5>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>NO.</th>
                  <th>NAME OF EMPLOYEES</th>
                  <th>DEPARTMENT</th>
                  <th>POSITION</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {state.employees.map((employee, index) => (
                  <tr key={employee.evaluation_id}>
                    <td>{index + 1}</td>
                    <td>{handleEmployeeFullName(employee)}</td>
                    <td>{employee.department}</td>
                    <td>{employee.position}</td>
                    <td>
                      <Link
                        to={`/evaluation/response/${employee.evaluation_id}`}
                        className="btn btn-theme"
                      >
                        EVALUATE
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  return <Layout content={state.loadingEmployees ? <Spinner /> : content} />;
};

export default Evaluations;
