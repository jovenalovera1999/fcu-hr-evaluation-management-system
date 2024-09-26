import { ChangeEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";

interface EmployeesProps {
  baseUrl: string;
}

interface Departments {
  department_id: number;
  department: string;
}

interface AcademicYears {
  academic_year_id: number;
  academic_year: string;
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
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingDepartments: true,
    departments: [] as Departments[],
    academicYears: [] as AcademicYears[],
    employees: [] as Employees[],
    department: "",
  });

  const handleInput = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "department" || name === "academic_year") {
    }
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
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        console.error("Unexpected server error: ", error);
      });
  };

  const handleLoadEmployees = async (
    departmentId: number,
    academicYear: number
  ) => {
    await axios
      .get(`${baseUrl}/employee/indexByDepartment/${departmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            employees: res.data.employees,
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
      <div className="mx-auto mt-2">
        <h4>LIST OF EMPLOYEES</h4>
        <div className="table-responsive">
          <div className="mb-3 col-12 col-sm-3">
            <label htmlFor="department">DEPARTMENT</label>
            <select className="form-select" name="department" id="department">
              <option value="">N/A</option>
            </select>
          </div>
          <div className="mb-3 col-12 col-sm-3">
            <label htmlFor="academic_year">ACADEMIC YEAR</label>
            <select
              className="form-select"
              name="academic_year"
              id="academic_year"
            >
              <option value="">N/A</option>
            </select>
          </div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>NO.</th>
                <th>NAME OF EMPLOYEES</th>
                <th>POSITION</th>
              </tr>
            </thead>
            <tbody>
              {state.employees.map((employee, index) => (
                <tr key={employee.employee_id}>
                  <td>{index + 1}</td>
                  <td>{handleEmployeeFullName(employee)}</td>
                  <td>{employee.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return <Layout content={state.loadingDepartments ? <Spinner /> : content} />;
};

export default Employees;
