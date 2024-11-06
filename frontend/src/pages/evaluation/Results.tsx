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

const Results = () => {
  const [state, setState] = useState({
    loadingAcademicYears: true,
    loadingSemesters: false,
    loadingResults: false,
    academicYears: [] as AcademicYears[],
    semesters: [] as Semesters[],
    results: [] as Results[],
    academic_year: "",
    semester: "",
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
      .get(`/evaluation/load/results/${semesterId}`)
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

  const handleOpenResponseSummary = () => {
    setState((prevState) => ({
      ...prevState,
      showSummaryResponseModal: true,
    }));
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
                        onClick={handleOpenResponseSummary}
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
        size="lg"
      >
        <ModalHeader>RESPONSE SUMMARY</ModalHeader>
        <ModalBody>
          <Row>
            <h3></h3>
            <Col>
              POOR
              <br />
              <p className="fs-3">5</p>
            </Col>
            <Col>
              MEDIOCRE
              <br />
              <p className="fs-3">5</p>
            </Col>
            <Col>
              SATISFACTORY
              <br />
              <p className="fs-3">5</p>
            </Col>
            <Col>
              GOOD
              <br />
              <p className="fs-3">5</p>
            </Col>
            <Col>
              EXCELLENT
              <br />
              <p className="fs-3">5</p>
            </Col>
          </Row>
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
