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

interface AcademicYears {
  academic_year_id: number;
  academic_year: string;
}

interface Semesters {
  semester_id: number;
  semester: string;
}

interface Results {
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
  question_poor: string;
  question_unsatisfactory: string;
  question_satisfactory: string;
  question_very_satisfactory: string;
  question_outstanding: string;
}

const Results = () => {
  const [state, setState] = useState({
    loadingAcademicYears: true,
    loadingSemesters: false,
    loadingResults: false,
    loadingSummary: false,
    loadingCategories: false,
    loadingQuestions: false,
    academicYears: [] as AcademicYears[],
    semesters: [] as Semesters[],
    results: [] as Results[],
    categories: [] as Categories[],
    questions: {} as { [key: number]: Questions[] },
    employee_id: 0,
    academic_year: "",
    semester: "",
    poor: 0,
    unsatisfactory: 0,
    satisfactory: 0,
    very_satisfactory: 0,
    outstanding: 0,
    showSummaryResponseModal: false,
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
    } else if (name === "semester") {
      setState((prevState) => ({
        ...prevState,
        loadingResults: true,
      }));

      handleLoadResults(parseInt(value));
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
        errorHandler(error);
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
        errorHandler(error);
      });
  };

  const handleLoadResults = async (semesterId: number) => {
    axiosInstance
      .get(`/response/load/results/${semesterId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            results: res.data.results,
            loadingResults: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const handleLoadSummary = async (employeeId: number, semesterId: number) => {
    axiosInstance
      .get(`/response/load/summary/${employeeId}/${semesterId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            poor: res.data.summary.poor,
            unsatisfactory: res.data.summary.unsatisfactory,
            satisfactory: res.data.summary.satisfactory,
            very_satisfactory: res.data.summary.very_satisfactory,
            outstanding: res.data.summary.outstanding,
            loadingSummary: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        console.error("Unexpected server error: ", error);
      });
  };

  const handleLoadCategories = async () => {
    setState((prevState) => ({
      ...prevState,
      loadingCategories: true,
    }));

    axiosInstance
      .get("/category/index")
      .then((res) => {
        if (res.data.status === 200) {
          res.data.categories.map((category: Categories) => {
            setState((prevState) => ({
              ...prevState,
              loadingQuestions: true,
            }));

            handleLoadQuestions(category.category_id);
          });

          setState((prevState) => ({
            ...prevState,
            categories: res.data.categories,
            loadingCategories: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const handleLoadQuestions = async (categoryId: number) => {
    setState((prevState) => ({
      ...prevState,
      loadingQuestions: true,
    }));

    axiosInstance
      .get(
        `/response/load/response/answers/${state.employee_id}/${state.semester}/${categoryId}`
      )
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            questions: {
              ...prevState.questions,
              [categoryId]: res.data.responses,
            },
            loadingQuestions: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const handleOpenResponseSummary = (employee: Results) => {
    setState((prevState) => ({
      ...prevState,
      loadingSummary: true,
      employee_id: employee.employee_id,
      showSummaryResponseModal: true,
    }));

    handleLoadCategories();
    handleLoadSummary(employee.employee_id, parseInt(state.semester));
  };

  const handleCloseResponseSummary = () => {
    setState((prevState) => ({
      ...prevState,
      showSummaryResponseModal: false,
    }));
  };

  const handleEmployeeFullName = (employee: Results) => {
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
    document.title = "EVALUATION RESULTS | FCU HR EMS";
    handleLoadAcademicYears();
  }, []);

  const content = (
    <>
      <div className="mx-auto mt-2">
        <Row>
          <Col sm={3}>
            <div className="mb-3">
              <FormLabel htmlFor="academic_year">ACADEMIC YEAR</FormLabel>
              <FormSelect
                name="academic_year"
                id="academic_year"
                value={state.academic_year}
                onChange={handleInput}
                autoFocus
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
        <Row>
          <Table hover size="sm" responsive="sm">
            <thead>
              <tr>
                <th>NO.</th>
                <th>NAME OF EMPLOYEE</th>
                <th>POSITION</th>
                <th>DEPARTMENT</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {state.loadingResults ? (
                <tr className="align-middle">
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
                state.results.map((result, index) => (
                  <tr key={result.employee_id} className="align-middle">
                    <td>{index + 1}</td>
                    <td>{handleEmployeeFullName(result)}</td>
                    <td>{result.position}</td>
                    <td>{result.department}</td>
                    <td>
                      <Button
                        className="btn-theme"
                        size="sm"
                        onClick={() => handleOpenResponseSummary(result)}
                      >
                        VIEW RATING
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Row>
      </div>

      <Modal
        show={state.showSummaryResponseModal}
        onHide={handleCloseResponseSummary}
        fullscreen={true}
      >
        <ModalHeader>RESPONSE SUMMARY</ModalHeader>
        <ModalBody>
          {state.loadingSummary ||
          state.loadingCategories ||
          state.loadingQuestions ? (
            <>
              <div className="d-flex justify-content-center align-items-center">
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
                  POOR
                  <br />
                  <p className="fs-3">{state.poor}</p>
                </Col>
                <Col>
                  UNSATISFACTORY
                  <br />
                  <p className="fs-3">{state.unsatisfactory}</p>
                </Col>
                <Col>
                  SATISFACTORY
                  <br />
                  <p className="fs-3">{state.satisfactory}</p>
                </Col>
                <Col>
                  VERY SATISFACTORY
                  <br />
                  <p className="fs-3">{state.very_satisfactory}</p>
                </Col>
                <Col>
                  OUTSTANDING
                  <br />
                  <p className="fs-3">{state.outstanding}</p>
                </Col>
              </Row>
              {state.categories.map((category) => (
                <Row>
                  <Table hover size="sm" responsive="sm">
                    <caption>{category.category}</caption>
                    <thead>
                      <tr className="align-middle">
                        <td className="text-center">NO.</td>
                        <td className="text-center">QUESTION</td>
                        <td className="text-center">POOR</td>
                        <td className="text-center">UNSATISFACTORY</td>
                        <td className="text-center">SATISFACTORY</td>
                        <td className="text-center">VERY SATISFACTORY</td>
                        <td className="text-center">OUTSTANDING</td>
                      </tr>
                    </thead>
                    <tbody>
                      {state.questions[category.category_id] ? (
                        state.questions[category.category_id].map(
                          (question, index) => (
                            <tr className="align-middle">
                              <td className="text-center">{index + 1}</td>
                              <td>{question.question}</td>
                              <td className="text-center">
                                {question.question_poor}
                              </td>
                              <td className="text-center">
                                {question.question_unsatisfactory}
                              </td>
                              <td className="text-center">
                                {question.question_satisfactory}
                              </td>
                              <td className="text-center">
                                {question.question_very_satisfactory}
                              </td>
                              <td className="text-center">
                                {question.question_outstanding}
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
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Row>
              ))}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button className="btn-theme" onClick={handleCloseResponseSummary}>
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
