import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  FormControl,
  FormLabel,
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
import AlertToastMessage from "../../components/AlertToastMessage";

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

  const [state, setState] = useState({
    loadingStudent: false,
    loadingDepartments: true,
    loadingStudents: false,
    loadingCourses: false,
    loadingSections: false,
    showAddStudentModal: false,
    showEditStudentModal: false,
    showDeleteStudentModal: false,
    departments: [] as Departments[],
    students: [] as Students[],
    courses: [] as Courses[],
    sections: [] as Sections[],
    student_department: "",
    student_year_level: "",
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
    toastSuccess: false,
    toastBody: "",
    showToast: false,
  });

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

    const yearLevel =
      name === "student_year_level"
        ? parseInt(value)
        : parseInt(state.student_year_level);
    const departmentId =
      name === "student_department"
        ? parseInt(value)
        : parseInt(state.student_department);

    if (yearLevel && departmentId) {
      setState((prevState) => ({
        ...prevState,
        loadingStudents: true,
      }));

      handleLoadStudents(yearLevel, departmentId);
    }

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
        errorHandler(error);
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
          handleLoadStudents(
            parseInt(state.student_year_level),
            parseInt(state.student_department)
          );

          setState((prevState) => ({
            ...prevState,
            courses: [] as Courses[],
            sections: [] as Sections[],
            student_no: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            suffix_name: "",
            department: "",
            course: "",
            year_level: "",
            section: "",
            password: "",
            password_confirmation: "",
            irregular: false,
            errors: {} as Errors,
            loadingStudent: false,
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
            loadingStudent: false,
          }));
        } else {
          errorHandler(error);
        }
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
          handleLoadStudents(
            parseInt(state.student_year_level),
            parseInt(state.student_department)
          );

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
            loadingStudent: false,
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
            loadingStudent: false,
          }));
        } else {
          errorHandler(error);
        }
      });
  };

  // const handleCloseToastMessage = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     toastMessage: "",
  //     toastMessageSuccess: false,
  //     toastMessageVisible: false,
  //   }));
  // };

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

  const handleCloseEditStudentModal = () => {
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
      showEditStudentModal: false,
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
      errorHandler(401);
    } else {
      handleLoadDepartments();
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

  const content = (
    <>
      <AlertToastMessage
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
          <Col sm={3}>
            <div className="mb-3">
              <FormLabel htmlFor="department">DEPARTMENT</FormLabel>
              <FormSelect
                name="student_department"
                id="student_department"
                value={state.student_department}
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
            </div>
          </Col>
          <Col sm={3}>
            <div className="mb-3">
              <FormLabel htmlFor="year_level">YEAR LEVEL</FormLabel>
              <FormSelect
                name="student_year_level"
                id="student_year_level"
                value={state.student_year_level}
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
            </div>
          </Col>
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
                <tr key={student.student_id} className="align-middle">
                  <td>{index + 1}</td>
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
              <div className="mb-3">
                <FormLabel htmlFor="student_no">STUDENT NO</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.student_no ? "is-invalid" : ""}`}
                  name="student_no"
                  id="student_no"
                  value={state.student_no}
                  onChange={handleInput}
                />
                {state.errors.student_no && (
                  <p className="text-danger">{state.errors.student_no[0]}</p>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="first_name">FIRST NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.first_name ? "is-invalid" : ""}`}
                  name="first_name"
                  id="first_name"
                  value={state.first_name}
                  onChange={handleInput}
                />
                {state.errors.first_name && (
                  <p className="text-danger">{state.errors.first_name[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="middle_name">MIDDLE NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.middle_name ? "is-invalid" : ""}`}
                  name="middle_name"
                  id="middle_name"
                  value={state.middle_name}
                  onChange={handleInput}
                />
                {state.errors.middle_name && (
                  <p className="text-danger">{state.errors.middle_name[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="last_name">LAST NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.last_name ? "is-invalid" : ""}`}
                  name="last_name"
                  id="last_name"
                  value={state.last_name}
                  onChange={handleInput}
                />
                {state.errors.last_name && (
                  <p className="text-danger">{state.errors.last_name[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="suffix_name">SUFFIX NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.suffix_name ? "is-invalid" : ""}`}
                  name="suffix_name"
                  id="suffix_name"
                  value={state.suffix_name}
                  onChange={handleInput}
                />
                {state.errors.suffix_name && (
                  <p className="text-danger">{state.errors.suffix_name[0]}</p>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="department">DEPARTMENT</FormLabel>
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
                {state.errors.department && (
                  <p className="text-danger">{state.errors.department[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="course">COURSE</FormLabel>
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
                {state.errors.course && (
                  <p className="text-danger">{state.errors.course[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="year_level">YEAR LEVEL</FormLabel>
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
                {state.errors.year_level && (
                  <p className="text-danger">{state.errors.year_level[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="section">SECTION</FormLabel>
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
                {state.errors.section && (
                  <p className="text-danger">{state.errors.section[0]}</p>
                )}
              </div>
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
              <div className="mb-3">
                <FormLabel htmlFor="password">PASSWORD</FormLabel>
                <FormControl
                  type="password"
                  className={`${state.errors.password ? "is-invalid" : ""}`}
                  name="password"
                  id="password"
                  value={state.password}
                  onChange={handleInput}
                />
                {state.errors.password && (
                  <p className="text-danger">{state.errors.password[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <FormLabel htmlFor="password_confirmation">
                CONFIRM PASSWORD
              </FormLabel>
              <FormControl
                type="password"
                className={`${
                  state.errors.password_confirmation ? "is-invalid" : ""
                }`}
                name="password_confirmation"
                id="password_confirmation"
                value={state.password_confirmation}
                onChange={handleInput}
              />
              {state.errors.password_confirmation && (
                <p className="text-danger">
                  {state.errors.password_confirmation}
                </p>
              )}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-theme"
            onClick={handleCloseAddStudentModal}
            disabled={state.loadingStudent}
          >
            CLOSE
          </Button>
          <Button
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
        onHide={handleCloseEditStudentModal}
        fullscreen={true}
        backdrop="static"
      >
        <ModalHeader>EDIT STUDENT</ModalHeader>
        <ModalBody>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="student_no">STUDENT NO</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.student_no ? "is-invalid" : ""}`}
                  name="student_no"
                  id="student_no"
                  value={state.student_no}
                  onChange={handleInput}
                />
                {state.errors.student_no && (
                  <p className="text-danger">{state.errors.student_no[0]}</p>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="first_name">FIRST NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.first_name ? "is-invalid" : ""}`}
                  name="first_name"
                  id="first_name"
                  value={state.first_name}
                  onChange={handleInput}
                />
                {state.errors.first_name && (
                  <p className="text-danger">{state.errors.first_name[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="middle_name">MIDDLE NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.middle_name ? "is-invalid" : ""}`}
                  name="middle_name"
                  id="middle_name"
                  value={state.middle_name}
                  onChange={handleInput}
                />
                {state.errors.middle_name && (
                  <p className="text-danger">{state.errors.middle_name[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="last_name">LAST NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.last_name ? "is-invalid" : ""}`}
                  name="last_name"
                  id="last_name"
                  value={state.last_name}
                  onChange={handleInput}
                />
                {state.errors.last_name && (
                  <p className="text-danger">{state.errors.last_name[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="suffix_name">SUFFIX NAME</FormLabel>
                <FormControl
                  type="text"
                  className={`${state.errors.suffix_name ? "is-invalid" : ""}`}
                  name="suffix_name"
                  id="suffix_name"
                  value={state.suffix_name}
                  onChange={handleInput}
                />
                {state.errors.suffix_name && (
                  <p className="text-danger">{state.errors.suffix_name[0]}</p>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="department">DEPARTMENT</FormLabel>
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
                {state.errors.department && (
                  <p className="text-danger">{state.errors.department[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="course">COURSE</FormLabel>
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
                {state.errors.course && (
                  <p className="text-danger">{state.errors.course[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="year_level">YEAR LEVEL</FormLabel>
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
                {state.errors.year_level && (
                  <p className="text-danger">{state.errors.year_level[0]}</p>
                )}
              </div>
            </Col>
            <Col sm={3}>
              <div className="mb-3">
                <FormLabel htmlFor="section">SECTION</FormLabel>
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
                {state.errors.section && (
                  <p className="text-danger">{state.errors.section[0]}</p>
                )}
              </div>
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
            className="btn-theme"
            onClick={handleCloseEditStudentModal}
            disabled={state.loadingStudent}
          >
            CLOSE
          </Button>
          <Button
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
