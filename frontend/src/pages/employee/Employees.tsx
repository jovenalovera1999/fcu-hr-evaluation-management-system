import { ChangeEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import { Link } from "react-router-dom";

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

const Employees = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const [state, setState] = useState({
    loadingDepartments: true,
    loadingEmployees: false,
    departments: [] as Departments[],
    academicYears: [] as AcademicYears[],
    employees: [] as Employees[],
    department: "",
    academic_year: "",
  });

  const handleInput = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "department") {
      setState((prevState) => ({
        ...prevState,
        loadingEmployees: true,
      }));

      handleLoadEmployees(parseInt(value));
    }
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

  const handleLoadEmployees = async (departmentId: number) => {
    axiosInstance
      .get(`/employee/index/by/department/${departmentId}`)
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
        errorHandler(error);
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
      <div className="mx-auto mt-2">
        <div className="row">
          <div className="col-sm-3">
            <div className="mb-3">
              <label htmlFor="department">DEPARTMENT</label>
              <select
                className="form-select"
                name="department"
                id="department"
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
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-hover">
            <caption>LIST OF EMPLOYEES</caption>
            <thead>
              <tr>
                <th>NO.</th>
                <th>NAME OF EMPLOYEES</th>
                <th>POSITION</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {state.loadingEmployees ? (
                <tr key={1}>
                  <td colSpan={4}>
                    <Spinner />
                  </td>
                </tr>
              ) : (
                state.employees.map((employee, index) => (
                  <tr key={employee.employee_id} className="align-middle">
                    <td>{index + 1}</td>
                    <td>{handleEmployeeFullName(employee)}</td>
                    <td>{employee.position}</td>
                    <td>
                      <div className="btn-group">
                        <Link
                          to={`/employee/edit/${employee.employee_id}`}
                          className="btn btn-sm btn-theme"
                        >
                          EDIT
                        </Link>
                        <Link to={"#"} className="btn btn-sm btn-theme">
                          DELETE
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return <Layout content={state.loadingDepartments ? <Spinner /> : content} />;
};

export default Employees;
