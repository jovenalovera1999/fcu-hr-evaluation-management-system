import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  FormControl,
  FormSelect,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
import ToastMessage from "../../components/ToastMessage";
import { useNavigate } from "react-router-dom";

interface Departments {
  department_id: number;
  department: string;
}

interface Courses {
  course_id: number;
  course: string;
}

interface Sections {
  section_id: number;
  section: string;
}

interface Students {
  student_id: number;
  student_no: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  department_id: string;
  department: string;
  course_id: string;
  course: string;
  section_id: string;
  section: string;
  year_level: string;
  is_irregular: boolean;
}

interface Errors {
  student_no?: string[];
  first_name?: string[];
  middle_name?: string[];
  last_name?: string[];
  suffix_name?: string[];
  department?: string[];
  course?: string[];
  year_level?: string[];
  section?: string[];
  password?: string[];
  password_confirmation?: string[];
}

const Students = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingStudent: false,
    loadingDepartments: true,
    loadingStudents: false,
    loadingCourses: false,
    loadingSections: false,
    departments: [] as Departments[],
    students: [] as Students[],
    courses: [] as Courses[],
    sections: [] as Sections[],
    student_department: "",
    student_year_level: "",
    studentsCurrentPage: 1,
    studentsLastPage: 1,
    student_id: 0,
    student_no: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix_name: "",
    department: "",
    course: "",
    year_level: "",
    section: "",
    irregular: false,
    password: "",
    password_confirmation: "",
    errors: {} as Errors,
    showAddStudentModal: false,
    showEditStudentModal: false,
    showDeleteStudentModal: false,
    toastSuccess: false,
    toastBody: "",
    showToast: false,
  });

  const handleResetNecessaryFields = () => {
    setState((prevState) => ({
      ...prevState,
      student_id: 0,
      student_no: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      suffix_name: "",
      department: "",
      course: "",
      year_level: "",
      section: "",
      irregular: false,
      password: "",
      password_confirmation: "",
      errors: {} as Errors,
    }));
  };

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;

    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));

    // const yearLevel =
    //   name === "student_year_level"
    //     ? parseInt(value)
    //     : parseInt(state.student_year_level);
    // const departmentId =
    //   name === "student_department"
    //     ? parseInt(value)
    //     : parseInt(state.student_department);

    handleStudentsPageChange(1);

    if (name === "department") {
      setState((prevState) => ({
        ...prevState,
        loadingCourses: true,
      }));

      handleLoadCourses(parseInt(value));
    } else if (name === "course") {
      setState((prevState) => ({
        ...prevState,
        loadingSections: true,
      }));

      handleLoadSections(parseInt(value));
    }
  };

  const handleStudentsPageChange = (page: number) => {
    setState((prevState) => ({
      ...prevState,
      studentsCurrentPage: page,
    }));
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
        errorHandler(error, navigate);
      });
  };

  const handleLoadCourses = async (departmentId: number) => {
    axiosInstance
      .get(`/course/index/${departmentId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            courses: res.data.courses,
            loadingCourses: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      });
  };

  const handleLoadSections = async (courseId: number) => {
    axiosInstance
      .get(`/section/load/sections/by/course/${courseId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            sections: res.data.sections,
            loadingSections: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      });
  };

  const handleLoadStudents = async () => {
    setState((prevState) => ({
      ...prevState,
      students: [] as Students[],
      loadingStudents: true,
    }));

    let apiRoute = `/student/loadStudents?page=${state.studentsCurrentPage}`;

    if (state.student_department && state.student_year_level) {
      apiRoute = `/student/loadStudents?page=${state.studentsCurrentPage}&departmentId=${state.student_department}&yearLevel=${state.student_year_level}`;
    } else if (state.student_year_level) {
      apiRoute = `/student/loadStudents?page=${state.studentsCurrentPage}&yearLevel=${state.student_year_level}`;
    } else if (state.student_department) {
      apiRoute = `/student/loadStudents?page=${state.studentsCurrentPage}&departmentId=${state.student_department}`;
    }

    axiosInstance
      .get(apiRoute)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            students: res.data.students.data,
            studentsCurrentPage: res.data.students.current_page,
            studentsLastPage: res.data.students.last_page,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingStudents: false,
        }));
      });
  };

  const handleStoreStudent = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingStudent: true,
    }));

    axiosInstance
      .post("/student/store", state)
      .then((res) => {
        if (res.data.status === 200) {
          handleLoadStudents();

          handleResetNecessaryFields();

          setState((prevState) => ({
            ...prevState,
            courses: [] as Courses[],
            sections: [] as Sections[],
            showAddStudentModal: false,
            toastSuccess: true,
            toastBody: "STUDENT SUCCESSFULY SAVED.",
            showToast: true,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          errorHandler(error, navigate);
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingStudent: false,
        }));
      });
  };

  const handleUpdateStudent = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingStudent: true,
    }));

    axiosInstance
      .put(`/student/update/${state.student_id}`, state)
      .then((res) => {
        if (res.data.status === 200) {
          handleLoadStudents();

          handleResetNecessaryFields();

          setState((prevState) => ({
            ...prevState,
            showEditStudentModal: false,
            toastSuccess: true,
            toastBody: "STUDENT SUCCESSFULY UPDATED.",
            showToast: true,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          errorHandler(error, navigate);
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingStudent: false,
        }));
      });
  };

  const handleDeleteStudent = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingStudent: true,
    }));

    axiosInstance
      .put(`/student/delete/${state.student_id}`)
      .then((res) => {
        if (res.data.status === 200) {
          handleLoadStudents();

          handleResetNecessaryFields();

          setState((prevState) => ({
            ...prevState,
            showDeleteStudentModal: false,
            toastSuccess: true,
            toastBody: "STUDENT SUCCESSFULY DELETED.",
            showToast: true,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingStudent: false,
        }));
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

  const handleOpenAddStudentModal = () => {
    setState((prevState) => ({
      ...prevState,
      showAddStudentModal: true,
    }));
  };

  const handleCloseAddStudentModal = () => {
    setState((prevState) => ({
      ...prevState,
      student_id: 0,
      errors: {} as Errors,
      showAddStudentModal: false,
    }));
  };

  const handleOpenEditStudentModal = (student: Students) => {
    setState((prevState) => ({
      ...prevState,
      student_id: student.student_id,
      student_no: student.student_no,
      first_name: student.first_name,
      middle_name: student.middle_name,
      last_name: student.last_name,
      suffix_name: student.suffix_name,
      department: student.department_id,
      course: student.course_id,
      year_level: student.year_level,
      section: student.section_id,
      irregular: student.is_irregular,
      showEditStudentModal: true,
    }));
  };

  const handleOpenDeleteStudentModal = (student: Students) => {
    setState((prevState) => ({
      ...prevState,
      student_id: student.student_id,
      student_no: student.student_no,
      first_name: student.first_name,
      middle_name: student.middle_name,
      last_name: student.last_name,
      suffix_name: student.suffix_name,
      department: student.department,
      course: student.course,
      year_level: student.year_level,
      section: student.section,
      irregular: student.is_irregular,
      showDeleteStudentModal: true,
    }));
  };

  const handleCloseEditAndDeleteStudentModal = () => {
    setState((prevState) => ({
      ...prevState,
      student_id: 0,
      student_no: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      suffix_name: "",
      department: "",
      course: "",
      year_level: "",
      section: "",
      irregular: false,
      errors: {} as Errors,
      showEditStudentModal: false,
      showDeleteStudentModal: false,
    }));
  };

  const handleCloseToast = () => {
    setState((prevState) => ({
      ...prevState,
      toastSuccess: false,
      toastBody: "",
      showToast: false,
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
      errorHandler(401, navigate);
    } else {
      handleLoadDepartments();
      handleLoadStudents();
    }
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      if (state.department) {
        setState((prevState) => ({
          ...prevState,
          loadingCourses: true,
        }));

        await handleLoadCourses(parseInt(state.department));
      }
    };

    loadCourses();
  }, [state.department]);

  useEffect(() => {
    const loadSections = async () => {
      if (state.course) {
        setState((prevState) => ({
          ...prevState,
          loadingSections: true,
        }));

        await handleLoadSections(parseInt(state.course));
      }
    };

    loadSections();
  }, [state.course]);

  useEffect(() => {
    handleLoadStudents();
  }, [
    state.student_department,
    state.student_year_level,
    state.studentsCurrentPage,
  ]);

  const content = (
    <>
      <ToastMessage
        success={state.toastSuccess}
        body={state.toastBody}
        showToast={state.showToast}
        onClose={handleCloseToast}
      />
      <div className="mx-auto mt-2">
        <div className="mb-3">
          <div className="d-flex justify-content-end">
            <Button className="btn-theme" onClick={handleOpenAddStudentModal}>
              ADD STUDENT
            </Button>
          </div>
        </div>
        <Row>
          <div className="d-flex justify-content-between align-items-center">
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormSelect
                  name="student_department"
                  id="student_department"
                  value={state.student_department}
                  onChange={handleInput}
                >
                  <option value="">ALL DEPARTMENTS</option>
                  {state.departments.map((department) => (
                    <option
                      value={department.department_id}
                      key={department.department_id}
                    >
                      {department.department}
                    </option>
                  ))}
                </FormSelect>
                <label htmlFor="student_department">DEPARTMENT</label>
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormSelect
                  name="student_year_level"
                  id="student_year_level"
                  value={state.student_year_level}
                  onChange={handleInput}
                >
                  <option value="">ALL YEAR LEVELS</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </FormSelect>
                <label htmlFor="student_year_level">YEAR LEVEL</label>
              </Form.Floating>
            </Col>
            <ButtonGroup>
              <Button
                type="button"
                className="btn-theme"
                disabled={state.studentsCurrentPage <= 1}
                onClick={() =>
                  handleStudentsPageChange(state.studentsCurrentPage - 1)
                }
              >
                PREVIOUS
              </Button>
              <Button
                type="button"
                className="btn-theme"
                disabled={state.studentsCurrentPage >= state.studentsLastPage}
                onClick={() =>
                  handleStudentsPageChange(state.studentsCurrentPage + 1)
                }
              >
                NEXT
              </Button>
            </ButtonGroup>
          </div>
        </Row>
        <Table hover size="sm" responsive="sm">
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
              <tr key={1} className="align-middle">
                <td colSpan={6} className="text-center">
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    className="spinner-theme"
                  />
                </td>
              </tr>
            ) : (
              state.students.map((student, index) => (
                <tr key={index} className="align-middle">
                  <td>{(state.studentsCurrentPage - 1) * 10 + index + 1}</td>
                  <td>{student.student_no}</td>
                  <td>{handleStudentFullName(student)}</td>
                  <td>{handleDepartmentAndCourse(student)}</td>
                  <td>{handleYearLevelAndSection(student)}</td>
                  <td>
                    <div className="btn-group">
                      <Button
                        className="btn-theme"
                        size="sm"
                        onClick={() => handleOpenEditStudentModal(student)}
                      >
                        EDIT
                      </Button>
                      <Button
                        className="btn-theme"
                        size="sm"
                        onClick={() => handleOpenDeleteStudentModal(student)}
                      >
                        DELETE
                      </Button>
                      {/* <Link
                        to={`/student/delete/${student.student_id}`}
                        className="btn btn-sm btn-theme"
                      >
                        DELETE
                      </Link> */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <Modal
        show={state.showAddStudentModal}
        onHide={handleCloseAddStudentModal}
        fullscreen={true}
        backdrop="static"
      >
        <ModalHeader>ADD STUDENT</ModalHeader>
        <ModalBody>
          <Row>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  className={`${state.errors.student_no ? "is-invalid" : ""}`}
                  name="student_no"
                  id="student_no"
                  placeholder=""
                  value={state.student_no}
                  onChange={handleInput}
                  autoFocus
                />
                <label htmlFor="student_no">STUDENT NO</label>
                {state.errors.student_no && (
                  <p className="text-danger">{state.errors.student_no[0]}</p>
                )}
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  className={`${state.errors.first_name ? "is-invalid" : ""}`}
                  name="first_name"
                  id="first_name"
                  placeholder=""
                  value={state.first_name}
                  onChange={handleInput}
                />
                <label htmlFor="first_name">FIRST NAME</label>
                {state.errors.first_name && (
                  <p className="text-danger">{state.errors.first_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  className={`${state.errors.middle_name ? "is-invalid" : ""}`}
                  name="middle_name"
                  id="middle_name"
                  placeholder=""
                  value={state.middle_name}
                  onChange={handleInput}
                />
                <label htmlFor="middle_name">MIDDLE NAME</label>
                {state.errors.middle_name && (
                  <p className="text-danger">{state.errors.middle_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  className={`${state.errors.last_name ? "is-invalid" : ""}`}
                  name="last_name"
                  id="last_name"
                  placeholder=""
                  value={state.last_name}
                  onChange={handleInput}
                />
                <label htmlFor="last_name">LAST NAME</label>
                {state.errors.last_name && (
                  <p className="text-danger">{state.errors.last_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  className={`${state.errors.suffix_name ? "is-invalid" : ""}`}
                  name="suffix_name"
                  id="suffix_name"
                  placeholder=""
                  value={state.suffix_name}
                  onChange={handleInput}
                />
                <label htmlFor="suffix_name">SUFFIX NAME</label>
                {state.errors.suffix_name && (
                  <p className="text-danger">{state.errors.suffix_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormSelect
                  name="department"
                  id="department"
                  className={` ${state.errors.department ? "is-invalid" : ""}`}
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
                </FormSelect>
                <label htmlFor="department">DEPARTMENT</label>
                {state.errors.department && (
                  <p className="text-danger">{state.errors.department[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormSelect
                  name="course"
                  id="course"
                  className={`${state.errors.course ? "is-invalid" : ""}`}
                  value={state.course}
                  onChange={handleInput}
                >
                  <option value="">N/A</option>
                  {state.loadingCourses ? (
                    <option value="">Loading...</option>
                  ) : (
                    state.courses.map((course) => (
                      <option value={course.course_id} key={course.course_id}>
                        {course.course}
                      </option>
                    ))
                  )}
                </FormSelect>
                <label htmlFor="course">COURSE</label>
                {state.errors.course && (
                  <p className="text-danger">{state.errors.course[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormSelect
                  name="year_level"
                  id="year_level"
                  className={`${state.errors.year_level ? "is-invalid" : ""}`}
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
                </FormSelect>
                <label htmlFor="year_level">YEAR LEVEL</label>
                {state.errors.year_level && (
                  <p className="text-danger">{state.errors.year_level[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormSelect
                  name="section"
                  id="section"
                  className={`${state.errors.section ? "is-invalid" : ""}`}
                  value={state.section}
                  onChange={handleInput}
                >
                  <option value="">N/A</option>
                  {state.loadingSections ? (
                    <option value="">Loading...</option>
                  ) : (
                    state.sections.map((section) => (
                      <option
                        value={section.section_id}
                        key={section.section_id}
                      >
                        {section.section}
                      </option>
                    ))
                  )}
                </FormSelect>
                <label htmlFor="section">SECTION</label>
                {state.errors.section && (
                  <p className="text-danger">{state.errors.section[0]}</p>
                )}
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <hr />
            <Col sm={6}>
              <div className="mb-3">
                <FormCheckInput
                  type="checkbox"
                  name="irregular"
                  id="irregular"
                  value={1}
                  onChange={handleInput}
                />{" "}
                {""}
                <FormCheckLabel htmlFor="irregular">
                  IS STUDENT IRREGULAR? IF NOT, LEAVE IT.
                </FormCheckLabel>
              </div>
            </Col>
            <hr />
          </Row>
          <Row>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="password"
                  className={`${state.errors.password ? "is-invalid" : ""}`}
                  name="password"
                  id="password"
                  placeholder=""
                  value={state.password}
                  onChange={handleInput}
                />
                <label htmlFor="password">PASSWORD</label>
                {state.errors.password && (
                  <p className="text-danger">{state.errors.password[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="password"
                  className={`${
                    state.errors.password_confirmation ? "is-invalid" : ""
                  }`}
                  name="password_confirmation"
                  id="password_confirmation"
                  placeholder=""
                  value={state.password_confirmation}
                  onChange={handleInput}
                />
                <label htmlFor="password_confirmation">CONFIRM PASSWORD</label>
                {state.errors.password_confirmation && (
                  <p className="text-danger">
                    {state.errors.password_confirmation}
                  </p>
                )}
              </Form.Floating>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            className="btn-theme"
            onClick={handleCloseAddStudentModal}
            disabled={state.loadingStudent}
          >
            CLOSE
          </Button>
          <Button
            type="submit"
            className="btn-theme"
            onClick={handleStoreStudent}
            disabled={state.loadingStudent}
          >
            {state.loadingStudent ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  size="sm"
                  className="spinner-theme"
                />{" "}
                SAVING...
              </>
            ) : (
              "SAVE"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        show={state.showEditStudentModal}
        onHide={handleCloseEditAndDeleteStudentModal}
        fullscreen={true}
        backdrop="static"
      >
        <ModalHeader>EDIT STUDENT</ModalHeader>
        <ModalBody>
          <Row>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  className={`${state.errors.student_no ? "is-invalid" : ""}`}
                  name="student_no"
                  id="student_no"
                  placeholder=""
                  value={state.student_no}
                  onChange={handleInput}
                  autoFocus
                />
                <label htmlFor="student_no">STUDENT NO</label>
                {state.errors.student_no && (
                  <p className="text-danger">{state.errors.student_no[0]}</p>
                )}
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  className={`${state.errors.first_name ? "is-invalid" : ""}`}
                  name="first_name"
                  id="first_name"
                  placeholder=""
                  value={state.first_name}
                  onChange={handleInput}
                />
                <label htmlFor="first_name">FIRST NAME</label>
                {state.errors.first_name && (
                  <p className="text-danger">{state.errors.first_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  className={`${state.errors.middle_name ? "is-invalid" : ""}`}
                  name="middle_name"
                  id="middle_name"
                  placeholder=""
                  value={state.middle_name}
                  onChange={handleInput}
                />
                <label htmlFor="middle_name">MIDDLE NAME</label>
                {state.errors.middle_name && (
                  <p className="text-danger">{state.errors.middle_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  className={`${state.errors.last_name ? "is-invalid" : ""}`}
                  name="last_name"
                  id="last_name"
                  placeholder=""
                  value={state.last_name}
                  onChange={handleInput}
                />
                <label htmlFor="last_name">LAST NAME</label>
                {state.errors.last_name && (
                  <p className="text-danger">{state.errors.last_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  className={`${state.errors.suffix_name ? "is-invalid" : ""}`}
                  name="suffix_name"
                  id="suffix_name"
                  placeholder=""
                  value={state.suffix_name}
                  onChange={handleInput}
                />
                <label htmlFor="suffix_name">SUFFIX NAME</label>
                {state.errors.suffix_name && (
                  <p className="text-danger">{state.errors.suffix_name[0]}</p>
                )}
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormSelect
                  name="department"
                  id="department"
                  className={` ${state.errors.department ? "is-invalid" : ""}`}
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
                </FormSelect>
                <label htmlFor="department">DEPARTMENT</label>
                {state.errors.department && (
                  <p className="text-danger">{state.errors.department[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormSelect
                  name="course"
                  id="course"
                  className={`${state.errors.course ? "is-invalid" : ""}`}
                  value={state.course}
                  onChange={handleInput}
                >
                  <option value="">N/A</option>
                  {state.loadingCourses ? (
                    <option value="">Loading...</option>
                  ) : (
                    state.courses.map((course) => (
                      <option value={course.course_id} key={course.course_id}>
                        {course.course}
                      </option>
                    ))
                  )}
                </FormSelect>
                <label htmlFor="course">COURSE</label>
                {state.errors.course && (
                  <p className="text-danger">{state.errors.course[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormSelect
                  name="year_level"
                  id="year_level"
                  className={`${state.errors.year_level ? "is-invalid" : ""}`}
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
                </FormSelect>
                <label htmlFor="year_level">YEAR LEVEL</label>
                {state.errors.year_level && (
                  <p className="text-danger">{state.errors.year_level[0]}</p>
                )}
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormSelect
                  name="section"
                  id="section"
                  className={`${state.errors.section ? "is-invalid" : ""}`}
                  value={state.section}
                  onChange={handleInput}
                >
                  <option value="">N/A</option>
                  {state.loadingSections ? (
                    <option value="">Loading...</option>
                  ) : (
                    state.sections.map((section) => (
                      <option
                        value={section.section_id}
                        key={section.section_id}
                      >
                        {section.section}
                      </option>
                    ))
                  )}
                </FormSelect>
                <label htmlFor="section">SECTION</label>
                {state.errors.section && (
                  <p className="text-danger">{state.errors.section[0]}</p>
                )}
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <hr />
            <Col sm={6}>
              <div className="mb-3">
                <FormCheckInput
                  type="checkbox"
                  name="irregular"
                  id="irregular"
                  value={1}
                  onChange={handleInput}
                  checked={state.irregular}
                />{" "}
                {""}
                <FormCheckLabel htmlFor="irregular">
                  IS STUDENT IRREGULAR? IF NOT, LEAVE IT.
                </FormCheckLabel>
              </div>
            </Col>
            <hr />
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            className="btn-theme"
            onClick={handleCloseEditAndDeleteStudentModal}
            disabled={state.loadingStudent}
          >
            CLOSE
          </Button>
          <Button
            type="submit"
            className="btn-theme"
            onClick={handleUpdateStudent}
            disabled={state.loadingStudent}
          >
            {state.loadingStudent ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  size="sm"
                  className="spinner-theme"
                />{" "}
                UPDATING...
              </>
            ) : (
              "UPDATE"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        show={state.showDeleteStudentModal}
        onHide={handleCloseEditAndDeleteStudentModal}
        fullscreen={true}
        backdrop="static"
      >
        <ModalHeader>ARE YOU SURE YOU WANT TO DELETE THIS STUDENT?</ModalHeader>
        <ModalBody>
          <Row>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  name="student_no"
                  id="student_no"
                  value={state.student_no}
                  readOnly
                />
                <label htmlFor="student_no">STUDENT NO</label>
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={state.first_name}
                  readOnly
                />
                <label htmlFor="first_name">FIRST NAME</label>
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  name="middle_name"
                  id="middle_name"
                  value={state.middle_name}
                  readOnly
                />
                <label htmlFor="middle_name">MIDDLE NAME</label>
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={state.last_name}
                  readOnly
                />
                <label htmlFor="last_name">LAST NAME</label>
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  name="suffix_name"
                  id="suffix_name"
                  value={state.suffix_name}
                  readOnly
                />
                <label htmlFor="suffix_name">SUFFIX NAME</label>
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  name="department"
                  id="department"
                  value={state.department}
                  readOnly
                />
                <label htmlFor="department">DEPARTMENT</label>
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  type="text"
                  name="course"
                  id="course"
                  value={state.course}
                  readOnly
                />
                <label htmlFor="course">COURSE</label>
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  name="year_level"
                  id="year_level"
                  value={state.year_level}
                  readOnly
                />
                <label htmlFor="year_level">YEAR LEVEL</label>
              </Form.Floating>
            </Col>
            <Col sm={3}>
              <Form.Floating className="mb-3">
                <FormControl
                  name="section"
                  id="section"
                  value={state.section}
                  readOnly
                />
                <label htmlFor="section">SECTION</label>
              </Form.Floating>
            </Col>
          </Row>
          <Row>
            <hr />
            <Col sm={6}>
              <div className="mb-3">
                <FormCheckInput
                  type="checkbox"
                  name="irregular"
                  id="irregular"
                  value={1}
                  checked={state.irregular}
                  readOnly
                />{" "}
                {""}
                <FormCheckLabel htmlFor="irregular">
                  IS STUDENT IRREGULAR?
                </FormCheckLabel>
              </div>
            </Col>
            <hr />
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            className="btn-theme"
            onClick={handleCloseEditAndDeleteStudentModal}
            disabled={state.loadingStudent}
          >
            CLOSE
          </Button>
          <Button
            type="submit"
            className="btn-theme"
            onClick={handleDeleteStudent}
            disabled={state.loadingStudent}
          >
            {state.loadingStudent ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  size="sm"
                  className="spinner-theme"
                />{" "}
                DELETING...
              </>
            ) : (
              "YES"
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  return (
    <Layout
      content={
        state.loadingDepartments ? (
          <>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "80vh" }}
            >
              <Spinner
                as="span"
                animation="border"
                role="status"
                className="spinner-theme"
              />
            </div>
          </>
        ) : (
          content
        )
      }
    />
  );
};

export default Students;
