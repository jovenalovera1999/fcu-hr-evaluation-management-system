import { ChangeEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ToastMessage from "../../components/ToastMessage";

interface Departments {
  department_id: number;
  department: string;
}

interface Students {
  student_id: number;
  student_no: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  department: string;
  course: string;
  section: string;
  year_level: number;
}

const Students = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingDepartments: true,
    loadingStudents: false,
    departments: [] as Departments[],
    students: [] as Students[],
    department: "",
    year_level: "",
    toastMessage: "",
    toastMessageSuccess: false,
    toastMessageVisible: false,
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
      setState((prevState) => ({
        ...prevState,
        loadingStudents: true,
      }));

      handleLoadStudents(yearLevel, departmentId);
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

  const handleLoadStudents = async (
    yearLevel: number,
    departmentId: number
  ) => {
    axiosInstance
      .get(
        `/student/load/students/by/year_level/and/department/${yearLevel}/${departmentId}`
      )
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            students: res.data.students,
            loadingStudents: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
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

  const handleDepartmentAndCourse = (student: Students) => {
    return `${student.department}/${student.course}`;
  };

  const handleYearLevelAndSection = (student: Students) => {
    return `${student.year_level}${student.section}`;
  };

  const handleToastMessageFromDeleteStudent = () => {
    if (location.state && location.state.toastMessage) {
      setState((prevState) => ({
        ...prevState,
        toastMessage: location.state.toastMessage,
        toastMessageSuccess: location.state.toastMessageSuccess,
        toastMessageVisible: location.state.toastMessageVisible,
      }));
    }
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

  useEffect(() => {
    document.title = "LIST OF STUDENTS | FCU HR EMS";

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
      handleToastMessageFromDeleteStudent();
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
        <div className="row">
          <div className="col-sm-3">
            <div className="mb-3">
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
          </div>
          <div className="col-sm-3">
            <div className="mb-3">
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
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-hover">
            <caption>LIST OF STUDENTS</caption>
            <thead>
              <tr>
                <th>NO.</th>
                <th>STUDENT NO.</th>
                <th>STUDENT NAME</th>
                <th>DEPARTMENT/COURSE</th>
                <th>SECTION</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {state.loadingStudents ? (
                <tr key={1}>
                  <td colSpan={6}>
                    <Spinner />
                  </td>
                </tr>
              ) : (
                state.students.map((student, index) => (
                  <tr key={student.student_id} className="align-middle">
                    <td>{index + 1}</td>
                    <td>{student.student_no}</td>
                    <td>{handleStudentFullName(student)}</td>
                    <td>{handleDepartmentAndCourse(student)}</td>
                    <td>{handleYearLevelAndSection(student)}</td>
                    <td>
                      <div className="btn-group">
                        <Link
                          to={`/student/edit/${student.student_id}`}
                          className="btn btn-sm btn-theme"
                        >
                          EDIT
                        </Link>
                        <Link
                          to={`/student/delete/${student.student_id}`}
                          className="btn btn-sm btn-theme"
                        >
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

export default Students;
