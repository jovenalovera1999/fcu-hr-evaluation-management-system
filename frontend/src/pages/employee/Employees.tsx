import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";

interface EmployeesProps {
  baseUrl: string;
}

interface Employees {
  employee_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  position: string;
  department: string;
}

const Employees = ({ baseUrl }: EmployeesProps) => {
  const [state, setState] = useState({
    loadingEmployees: true,
    employees: [] as Employees[],
  });

  const handleLoadEmployees = async () => {
    await axios
      .get(`${baseUrl}/api/employee/index`)
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
        console.error("Unexpected server error: ", error);
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

  useEffect(() => {
    document.title = "LIST OF EMPLOYEES | FCU HR EMS";
    handleLoadEmployees();
  }, []);

  const content = (
    <>
      <div className="mx-auto mt-3">
        <div className="table-responsive">
          <table className="table table-hover border-bottom">
            <thead>
              <tr>
                <th>NO.</th>
                <th>NAME OF EMPLOYEES</th>
                <th>POSITION</th>
                <th>DEPARTMENT</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {state.employees.map((employee, index) => (
                <tr key={employee.employee_id}>
                  <td>{index + 1}</td>
                  <td>{handleEmployeeFullName(employee)}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>
                    <div className="btn-group">
                      <Link to={"#"} className="btn btn-theme">
                        EDIT
                      </Link>
                      <Link to={"#"} className="btn btn-theme">
                        DELETE
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return <Layout content={state.loadingEmployees ? <Spinner /> : content} />;
};

export default Employees;
