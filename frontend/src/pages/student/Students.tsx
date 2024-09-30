import { ChangeEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios, { isAxiosError } from "axios";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";

interface StudentsProps {
  baseUrl: string;
}

interface Departments {
  department_id: number;
  department: string;
}

interface Students {
  student_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  department: string;
  course: string;
  year_level: number;
}

const Students = ({ baseUrl }: StudentsProps) => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingDepartments: true,
    departments: [] as Departments[],
    students: [] as Students[],
    department: "",
    year_level: "",
  });

  const handleInput = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const yearLevel =
      name === "year_level" ? parseInt(value) : parseInt(state.year_level);
    const departmentId =
      name === "department" ? parseInt(value) : parseInt(state.department);

    if (yearLevel && departmentId) {
      handleLoadStudents(yearLevel, departmentId);
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

  const handleLoadStudents = async (
    yearLevel: number,
    departmentId: number
  ) => {
    await axios
      .get(
        `${baseUrl}/student/index/by/year_level/and/department/${yearLevel}/${departmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            students: res.data.students,
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

  const handleStudentFullName = (student: Students) => {
    let fullName = "";

    if (student.middle_name) {
      fullName = `${student.last_name}, ${
        student.first_name
      } ${student.middle_name.charAt(0)}.`;
    } else {
      fullName = `${student.last_name}, ${student.first_name}`;
    }

    if (student.suffix_name) {
      fullName += ` ${student.suffix_name}`;
    }

    return fullName;
  };

  const handleYearLevelSuffix = (student: Students) => {
    let yearLevelSuffix = "";

    if (student.year_level === 1) {
      yearLevelSuffix = `${student.year_level}ST YEAR`;
    } else if (student.year_level === 2) {
      yearLevelSuffix = `${student.year_level}ND YEAR`;
    } else if (student.year_level === 3) {
      yearLevelSuffix = `${student.year_level}RD YEAR`;
    } else {
      yearLevelSuffix = `${student.year_level}TH YEAR`;
    }

    return yearLevelSuffix;
  };

  useEffect(() => {
    document.title = "LIST OF STUDENTS | FCU HR EMS";

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
        <h4>LIST OF STUDENTS</h4>
        <div className="table-responsive">
          <div className="mb-3 col-12 col-sm-3">
            <label htmlFor="department">DEPARTMENT</label>
            <select
              name="department"
              id="department"
              className="form-select"
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
          <div className="mb-3 col-12 col-sm-3">
            <label htmlFor="year_level">YEAR LEVEL</label>
            <select
              name="year_level"
              id="year_level"
              className="form-select"
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
          </div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>NO.</th>
                <th>NAME OF STUDENTS</th>
                <th>DEPARTMENT</th>
                <th>COURSE</th>
                <th>YEAR LEVEL</th>
              </tr>
            </thead>
            <tbody>
              {state.students.map((student, index) => (
                <tr key={student.student_id}>
                  <td>{index + 1}</td>
                  <td>{handleStudentFullName(student)}</td>
                  <td>{student.department}</td>
                  <td>{student.course}</td>
                  <td>{handleYearLevelSuffix(student)}</td>
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

export default Students;
