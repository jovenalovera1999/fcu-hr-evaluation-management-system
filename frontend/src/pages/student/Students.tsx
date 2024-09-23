import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";

interface StudentsProps {
  baseUrl: string;
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
    loadingStudents: true,
    students: [] as Students[],
  });

  const handleLoadStudents = async () => {
    await axios
      .get(`${baseUrl}/student/index`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
      handleLoadStudents();
    }
  }, []);

  const content = (
    <>
      <div className="mx-auto mt-2">
        <h4>LIST OF STUDENTS</h4>
        <div className="table-responsive">
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
                  <td>{`${student.year_level}${
                    student.year_level === 1 ? "st" : "th"
                  } year`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return <Layout content={state.loadingStudents ? <Spinner /> : content} />;
};

export default Students;
