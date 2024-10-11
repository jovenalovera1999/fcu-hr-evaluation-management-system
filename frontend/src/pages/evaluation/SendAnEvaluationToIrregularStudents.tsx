import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";

interface Students {
  student_id: number;
  student_no: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  department: string;
  course: string;
  year_level: string;
  section: string;
}

const SendAnEvaluationToIrregularStudents = () => {
  const [state, setState] = useState({
    loadingStudents: true,
    students: [] as Students[],
    search: "",
    currectPage: 1,
  });

  const handleLoadStudents = async () => {
    axiosInstance
      .get("/student/load/irregular/students")
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

  useEffect(() => {
    document.title = "SEND AN EVALUATION TO IRREGULAR STUDENTS | FCU HR EMS";
    handleLoadStudents();
  }, []);

  const content = (
    <>
      <div className="mx-auto mt-2">
        <h4>SEND AN EVALUATION TO IRREGULAR STUDENTS</h4>
        <div className="row">
          <div className="mb-3">
            <div className="table-responsive">
              <h5 className="mt-2 mb-3">LIST OF IRREGULAR STUDENTS</h5>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>
                      SELECT ALL
                      <input
                        type="checkbox"
                        className="form-check-input ms-2"
                        name="select_all"
                        id="select_all"
                      />
                    </th>
                    <th>NO.</th>
                    <th>STUDENT NO.</th>
                    <th>STUDENT NAME</th>
                    <th>DEPARTMENT/COURSE</th>
                    <th>SECTION</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return <Layout content={content} />;
};

export default SendAnEvaluationToIrregularStudents;
