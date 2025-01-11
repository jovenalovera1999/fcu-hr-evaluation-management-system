import {
  Button,
  Col,
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
import Layout from "../layout/Layout";
import { ChangeEvent, useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import { useNavigate } from "react-router-dom";

interface AcademicYears {
  academic_year_id: number;
  academic_year: string;
}

interface Semesters {
  semester_id: number;
  semester: string;
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

interface Categories {
  category_id: number;
  category: string;
}

interface Questions {
  question_id: number;
  question: string;
  totalPoor: string;
  totalUnsatisfactory: string;
  totalSatisfactory: string;
  totalVerySatisfactory: string;
  totalOutstanding: string;
}

interface Comments {
  comment_id: number;
  comment: string;
}

const Results = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingAcademicYears: true,
    loadingSemesters: false,
    loadingEmployees: false,
    loadingCategories: false,
    loadingQuestions: false,
    loadingComments: false,
    loadingResult: false,
    academicYears: [] as AcademicYears[],
    semesters: [] as Semesters[],
    employees: [] as Employees[],
    categories: [] as Categories[],
    questions: {} as { [key: number]: Questions[] },
    comments: [] as Comments[],
    academic_year: "",
    semester: "",
    category: "",
    totalPoor: 0,
    totalUnsatisfactory: 0,
    totalSatisfactory: 0,
    totalVerySatisfactory: 0,
    totalOutstanding: 0,
    poorPercentage: 0,
    unsatisfactoryPercentage: 0,
    satisfactoryPercentage: 0,
    verySatisfactoryPercentage: 0,
    outstandingPercentage: 0,
    showResultModal: false,
  });

  const handleInput = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "academic_year") {
      setState((prevState) => ({
        ...prevState,
        loadingSemesters: true,
      }));

      handleLoadSemesters(parseInt(value));
    }

    const academicYearId =
      name === "academic_year"
        ? parseInt(value)
        : parseInt(state.academic_year);
    const semesterId =
      name === "semester" ? parseInt(value) : parseInt(state.semester);

    if (academicYearId && semesterId) {
      setState((prevState) => ({
        ...prevState,
        loadingEmployees: true,
      }));

      handleLoadEmployees(academicYearId, semesterId);
    }
  };

  const handleLoadAcademicYears = async () => {
    axiosInstance
      .get("/academic_year/index")
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            academicYears: res.data.academicYears,
            loadingAcademicYears: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      });
  };

  const handleLoadSemesters = async (academicYearId: number) => {
    axiosInstance
      .get(`/semester/load/semesters/by/academic_year/${academicYearId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            semesters: res.data.semesters,
            loadingSemesters: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      });
  };

  const handleLoadEmployees = async (
    academicYearId: number,
    semesterId: number
  ) => {
    axiosInstance
      .get(
        `/employee/load/by/academic_year/and/semester/${academicYearId}/${semesterId}`
      )
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            employees: res.data.employees,
            loadingEmployees: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
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

  const handleLoadCountOverallTotalResponses = async (
    employeeId: number,
    semesterId: number
  ) => {
    axiosInstance
      .get(
        `/response/count/overall/total/responses/${employeeId}/${semesterId}`
      )
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            totalPoor: res.data.overallTotalResponses.poor,
            totalUnsatisfactory: res.data.overallTotalResponses.unsatisfactory,
            totalSatisfactory: res.data.overallTotalResponses.satisfactory,
            totalVerySatisfactory:
              res.data.overallTotalResponses.very_satisfactory,
            totalOutstanding: res.data.overallTotalResponses.outstanding,
            poorPercentage: res.data.overallTotalResponses.poor_percentage,
            unsatisfactoryPercentage:
              res.data.overallTotalResponses.unsatisfactory_percentage,
            satisfactoryPercentage:
              res.data.overallTotalResponses.satisfactory_percentage,
            verySatisfactoryPercentage:
              res.data.overallTotalResponses.very_satisfactory_percentage,
            outstandingPercentage:
              res.data.overallTotalResponses.outstanding_percentage,
            loadingResult: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      });
  };

  const handleLoadQuestionsWithCountOfResponses = async (
    employeeId: number,
    semesterId: number,
    categoryId: number
  ) => {
    setState((prevState) => ({
      ...prevState,
      loadingQuestions: true,
    }));

    axiosInstance
      .get(
        `/response/load/questions/with/count/of/responses/${employeeId}/${semesterId}/${categoryId}`
      )
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            questions: {
              ...prevState.questions,
              [categoryId]: res.data.questionsAndResponses,
            },
            loadingQuestions: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      });
  };

  const handleOpenResultModal = (employee: Employees) => {
    setState((prevState) => ({
      ...prevState,
      loadingResult: true,
    }));

    handleLoadCountOverallTotalResponses(
      employee.employee_id,
      parseInt(state.semester)
    );

    const handleLoadCategories = async () => {
      setState((prevState) => ({
        ...prevState,
        loadingCategories: true,
      }));

      axiosInstance
        .get("/response/load/categories")
        .then((res) => {
          if (res.status === 200) {
            res.data.categories.map((category: Categories) => {
              handleLoadQuestionsWithCountOfResponses(
                employee.employee_id,
                parseInt(state.semester),
                category.category_id
              );
            });
            setState((prevState) => ({
              ...prevState,
              categories: res.data.categories,
              loadingCategories: false,
            }));
          } else {
            console.error("Unexpected status error: ", res.status);
          }
        })
        .catch((error) => {
          errorHandler(error, navigate);
        });
    };

    handleLoadCategories();

    setState((prevState) => ({
      ...prevState,
      showResultModal: true,
    }));
  };

  const handleCloseResultModal = () => {
    setState((prevState) => ({
      ...prevState,
      questions: {} as { [key: number]: Questions[] },
      totalPoor: 0,
      totalUnsatisfactory: 0,
      totalSatisfactory: 0,
      totalVerySatisfactory: 0,
      totalOutstanding: 0,
      poorPercentage: 0,
      unsatisfactoryPercentage: 0,
      satisfactoryPercentage: 0,
      verySatisfactoryPercentage: 0,
      outstandingPercentage: 0,
      showResultModal: false,
    }));
  };

  useEffect(() => {
    document.title = "RESULTS | FCU HR EMS";
    handleLoadAcademicYears();
  }, []);

  const content = (
    <>
      <Row className="mt-2">
        <Col sm={3}>
          <div className="mb-3">
            <FormLabel htmlFor="academic_year">ACADEMIC YEAR</FormLabel>
            <FormSelect
              name="academic_year"
              id="academic_year"
              value={state.academic_year}
              onChange={handleInput}
            >
              <option value="">N/A</option>
              {state.academicYears.map((academicYear) => (
                <option
                  value={academicYear.academic_year_id}
                  key={academicYear.academic_year_id}
                >
                  {academicYear.academic_year}
                </option>
              ))}
            </FormSelect>
          </div>
        </Col>
        <Col sm={3}>
          <div className="mb-3">
            <FormLabel htmlFor="semester">SEMESTER</FormLabel>
            <FormSelect
              name="semester"
              id="semester"
              value={state.semester}
              onChange={handleInput}
            >
              <option value="">N/A</option>
              {state.loadingSemesters ? (
                <option value="">LOADING...</option>
              ) : (
                state.semesters.map((semester) => (
                  <option
                    value={semester.semester_id}
                    key={semester.semester_id}
                  >
                    {semester.semester}
                  </option>
                ))
              )}
            </FormSelect>
          </div>
        </Col>
      </Row>
      <Table hover size="sm" responsive="sm">
        <thead>
          <tr>
            <th>NO.</th>
            <th>NAME OF EMPLOYEE</th>
            <th>DEPARTMENT</th>
            <th>POSITION</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {state.loadingEmployees ? (
            <tr>
              <td colSpan={5} className="text-center">
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  className="spinner-theme"
                />
              </td>
            </tr>
          ) : (
            state.employees.map((employee, index) => (
              <tr key={employee.employee_id} className="align-middle">
                <td>{index + 1}</td>
                <td>{handleEmployeeFullName(employee)}</td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>
                  <Button
                    className="btn-theme"
                    size="sm"
                    onClick={() => handleOpenResultModal(employee)}
                  >
                    VIEW RESULT
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal
        fullscreen={true}
        show={state.showResultModal}
        onHide={handleCloseResultModal}
      >
        <ModalHeader>EVALUATION RESULT</ModalHeader>
        <ModalBody>
          {state.loadingResult ||
          state.loadingCategories ||
          state.loadingQuestions ? (
            <>
              <div className="d-flex justify-content-center align-items center">
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  className="spinner-theme"
                />
              </div>
            </>
          ) : (
            <>
              <Row>
                <Col>
                  <div className="mb-3">
                    POOR
                    <br />
                    <p className="fs-3">
                      {`${state.totalPoor} (${state.poorPercentage}%)`}
                    </p>
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    UNSATISFACTORY
                    <br />
                    <p className="fs-3">{`${state.totalUnsatisfactory} (${state.unsatisfactoryPercentage}%)`}</p>
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    SATISFACTORY
                    <br />
                    <p className="fs-3">{`${state.totalSatisfactory} (${state.satisfactoryPercentage}%)`}</p>
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    VERY SATISFACTORY
                    <br />
                    <p className="fs-3">{`${state.totalVerySatisfactory} (${state.verySatisfactoryPercentage}%)`}</p>
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    OUTSTANDING
                    <br />
                    <p className="fs-3">{`${state.totalOutstanding} (${state.outstandingPercentage}%)`}</p>
                  </div>
                </Col>
              </Row>
              {state.categories.map((category) => (
                <Row key={category.category_id}>
                  <Table hover size="sm" responsive="sm">
                    <caption>{category.category}</caption>
                    <thead>
                      <tr className="align-middle">
                        <th className="text-center">NO.</th>
                        <th className="text-center">QUESTION</th>
                        <th className="text-center">POOR</th>
                        <th className="text-center">UNSATISFACTORY</th>
                        <th className="text-center">SATISFACTORY</th>
                        <th className="text-center">VERY SATISFACTORY</th>
                        <th className="text-center">OUTSTANDING</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.questions[category.category_id] ? (
                        state.questions[category.category_id].map(
                          (question, index) => (
                            <tr
                              className="align-middle"
                              key={question.question_id}
                            >
                              <td className="text-center">{index + 1}</td>
                              <td>{question.question}</td>
                              <td className="text-center">
                                {question.totalPoor}
                              </td>
                              <td className="text-center">
                                {question.totalUnsatisfactory}
                              </td>
                              <td className="text-center">
                                {question.totalSatisfactory}
                              </td>
                              <td className="text-center">
                                {question.totalVerySatisfactory}
                              </td>
                              <td className="text-center">
                                {question.totalOutstanding}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr className="align-middle">
                          <td colSpan={7} className="text-center">
                            <Spinner
                              as="span"
                              animation="border"
                              role="status"
                              className="spinner-theme"
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Row>
              ))}
              <Row>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>NO.</th>
                      <th>COMMENTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.loadingComments ? (
                      <tr className="align-middle">
                        <td colSpan={2}>
                          <Spinner
                            as="span"
                            animation="border"
                            role="status"
                            className="spinner-theme"
                          />
                        </td>
                      </tr>
                    ) : (
                      state.comments.map((comment, index) => (
                        <tr className="align-middle" key={comment.comment_id}>
                          <td>{index + 1}</td>
                          <td>{comment.comment}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Row>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button className="btn-theme" onClick={handleCloseResultModal}>
            CLOSE
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  return (
    <Layout
      content={
        state.loadingAcademicYears ? (
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

export default Results;
