import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import Spinner from "../../components/Spinner";
import { debounce } from "chart.js/helpers";

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
    loadingPage: false,
    loadingSearch: false,
    students: [] as Students[],
    search: "",
    currentPage: 1,
    lastPage: 1,
  });

  const handleLoadStudents = async (page: number = state.currentPage) => {
    let endpoint = `/student/load/irregular/students?page=${page}`;

    if (state.search) {
      endpoint = `/student/load/irregular/students/search?page=${page}&search=${state.search}`;
    }

    axiosInstance
      .get(endpoint)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            students: res.data.students.data,
            loadingStudents: false,
            loadingPage: false,
            loadingSearch: false,
            currentPage: res.data.students.current_page,
            lastPage: res.data.students.last_page,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const debouncedPageChange = useCallback(
    debounce((page: number) => {
      if (page > 0 && state.currentPage <= state.lastPage) {
        setState((prevState) => ({
          ...prevState,
          loadingPage: true,
        }));

        handleLoadStudents(page);
      }
    }, 550),
    [state.lastPage, state.search]
  );

  const handlePageChange = (page: number) => {
    debouncedPageChange(page);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      search: e.target.value,
      currentPage: 1,
      loadingSearch: false,
    }));
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

  useEffect(() => {
    document.title = "SEND AN EVALUATION TO IRREGULAR STUDENTS | FCU HR EMS";
    handleLoadStudents();
  }, [state.currentPage, state.search]);

  const content = (
    <>
      <div className="mx-auto mt-2">
        <h4>SEND AN EVALUATION TO IRREGULAR STUDENTS</h4>
        <div className="row">
          <div className="col-sm-3">
            <div className="mb-3">
              <label htmlFor="search">SEARCH</label>
              <input
                type="text"
                className="form-control"
                value={state.search}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="mb-3">
            <div className="table-responsive">
              <h5 className="mt-2 mb-3">LIST OF IRREGULAR STUDENTS</h5>
              <div className="d-flex justify-content-end">
                <div className="btn-group">
                  <button
                    className="btn btn-theme"
                    disabled={state.loadingPage || state.currentPage <= 1}
                    onClick={() => handlePageChange(state.currentPage - 1)}
                  >
                    PREVIOUS
                  </button>
                  <button
                    className="btn btn-theme"
                    disabled={
                      state.loadingPage || state.currentPage >= state.lastPage
                    }
                    onClick={() => handlePageChange(state.currentPage + 1)}
                  >
                    NEXT
                  </button>
                </div>
              </div>
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
                <tbody>
                  {state.loadingPage || state.loadingSearch ? (
                    <tr>
                      <td colSpan={6}>
                        <Spinner />
                      </td>
                    </tr>
                  ) : (
                    state.students.map((student, index) => (
                      <tr key={student.student_id}>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="select"
                            id={`select_${student.student_id}`}
                          />
                        </td>
                        <td>{(state.currentPage - 1) * 10 + index + 1}</td>
                        <td>{student.student_no}</td>
                        <td>{handleStudentFullName(student)}</td>
                        <td>{handleDepartmentAndCourse(student)}</td>
                        <td>{handleYearLevelAndSection(student)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="d-flex justify-content-end">
                <div className="btn-group">
                  <button
                    className="btn btn-theme"
                    disabled={state.loadingPage || state.currentPage <= 1}
                    onClick={() => handlePageChange(state.currentPage - 1)}
                  >
                    PREVIOUS
                  </button>
                  <button
                    className="btn btn-theme"
                    disabled={
                      state.loadingPage || state.currentPage >= state.lastPage
                    }
                    onClick={() => handlePageChange(state.currentPage + 1)}
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return <Layout content={state.loadingStudents ? <Spinner /> : content} />;
};

export default SendAnEvaluationToIrregularStudents;
