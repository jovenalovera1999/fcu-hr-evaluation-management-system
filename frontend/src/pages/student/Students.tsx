import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import Spinner from "../../components/Spinner";

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
  const [state, setState] = useState({
    loadingStudents: true,
    students: [] as Students[],
  });

  const handleLoadStudents = async () => {
    await axios
      .get(`${baseUrl}/student/index`)
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
        console.error("Unexpected server error: ", error);
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
    handleLoadStudents();
  }, []);

  const content = (
    <>
      <div className="mx-auto mt-3">
        <h5 className="mb-3">LIST OF STUDENTS</h5>
        <div className="table-responsive">
          <table className="table table-hover border-bottom">
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
                  <td>{student.year_level}</td>
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
