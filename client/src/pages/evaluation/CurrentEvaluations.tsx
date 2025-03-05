import { Button, Col, Form, Row } from "react-bootstrap";
import CurrentEvaluationTable from "../../components/tables/evaluation/CurrentEvaluationTable";
import Layout from "../layout/Layout";
import { ChangeEvent, useEffect, useState } from "react";
import AcademicYearService from "../../services/AcademicYearService";
import errorHandler from "../../handler/errorHandler";
import AcademicYears from "../../interfaces/AcademicYear";
import Semesters from "../../interfaces/Semesters";
import SemesterService from "../../services/SemesterService";

const CurrentEvaluations = () => {
  const [state, setState] = useState({
    loadingAcademicYears: true,
    loadingSemesters: true,
    loadingUpdate: false,
    academicYears: [] as AcademicYears[],
    semesters: [] as Semesters[],
    academic_year: "",
    semester: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "academic_year") {
      handleLoadSemesters(parseInt(value));
    }

    if ((state.semester && name === "academic_year") || name === "semester") {
      setRefreshEvaluations((prev) => !prev);
    }
  };

  const handleLoadAcademicYears = async () => {
    setState((prevState) => ({
      ...prevState,
      loadingAcademicYears: true,
    }));

    AcademicYearService.loadAcademicYears()
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            academicYears: res.data.academicYears,
          }));
        } else {
          console.error("Unexpected status error: ", res.status);
        }
      })
      .catch((error) => {
        errorHandler(error, null, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingAcademicYears: false,
        }));
      });
  };

  const handleLoadSemesters = async (academicYearId: number) => {
    setState((prevState) => ({
      ...prevState,
      loadingSemesters: true,
    }));

    SemesterService.loadSemesters(academicYearId)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            semesters: res.data.semesters,
          }));
        } else {
          console.error("Unexpected status error: ", res.data);
        }
      })
      .catch((error) => {
        errorHandler(error, null, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingSemesters: false,
        }));
      });
  };

  const [refreshEvaluations, setRefreshEvaluations] = useState(false);

  useEffect(() => {
    handleLoadAcademicYears();
  }, []);

  const content = (
    <>
      <Row>
        <Col md={3}>
          <Form.Floating className="mb-3">
            <Form.Select
              name="academic_year"
              id="academic_year"
              value={state.academic_year}
              onChange={handleInputChange}
            >
              {state.academicYears.map((academicYear, index) => (
                <option value={academicYear.academic_year_id} key={index}>
                  {academicYear.academic_year}
                </option>
              ))}
            </Form.Select>
            <label htmlFor="academic_year">ACADEMIC YEAR</label>
          </Form.Floating>
        </Col>
        <Col md={3}>
          <Form.Floating className="mb-3">
            <Form.Select
              name="semester"
              id="semester"
              value={state.semester}
              onChange={handleInputChange}
            >
              {state.semesters.map((semester, index) => (
                <option value={semester.semester_id} key={index}>
                  {semester.semester}
                </option>
              ))}
            </Form.Select>
            <label htmlFor="semester">SEMESTER</label>
          </Form.Floating>
        </Col>
        <Col md={3}>
          <Button type="submit" className="mt-2" disabled={state.loadingUpdate}>
            CANCEL EVALUATION
          </Button>
        </Col>
      </Row>

      <CurrentEvaluationTable
        refreshCurrentEvaluations={refreshEvaluations}
        academicYearId={parseInt(state.academic_year)}
        semesterId={parseInt(state.semester)}
      />
    </>
  );

  return <Layout content={content} />;
};

export default CurrentEvaluations;
