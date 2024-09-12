import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import Spinner from "../../components/Spinner";

interface EvaluationsProps {
  baseUrl: string;
}

interface Employees {
  evaluation_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
}

const Evaluations = ({ baseUrl }: EvaluationsProps) => {
  const [state, setState] = useState({
    loadingEmployees: true,
    employees: [] as Employees[],
  });

  const handleLoadEmployees = async () => {
    await axios
      .get(`${baseUrl}/evaluation/index`)
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
      } ${employee.middle_name.charAt(0)}`;
    } else {
      fullName = `${employee.last_name}, ${employee.first_name}`;
    }

    if (employee.suffix_name) {
      fullName += ` ${employee.suffix_name}`;
    }

    return fullName;
  };

  useEffect(() => {
    document.title = "EMPLOYEES EVALUATION | FCU HR EMS";
    handleLoadEmployees();
  });

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
                </tr>
              </thead>
              <tbody>
                {state.employees.map((employee, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{handleEmployeeFullName(employee)}</td>
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
