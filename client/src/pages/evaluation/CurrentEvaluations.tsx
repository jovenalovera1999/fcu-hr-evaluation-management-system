import { Button, Col, Form, Row } from "react-bootstrap";
import CurrentEvaluationTable from "../../components/tables/evaluation/CurrentEvaluationTable";
import Layout from "../layout/Layout";
import { ChangeEvent, useEffect, useState } from "react";
import AcademicYearService from "../../services/AcademicYearService";
import errorHandler from "../../handler/errorHandler";
import AcademicYears from "../../interfaces/AcademicYear";
import Semesters from "../../interfaces/Semesters";
import SemesterService from "../../services/SemesterService";
import CancelEvaluationModal from "../../components/modals/evaluation/CancelEvaluationModal";
import ToastMessage from "../../components/ToastMessage";

const CurrentEvaluations = () => {
  const [state, setState] = useState({
    loadingAcademicYears: true,
    loadingSemesters: true,
    loadingUpdate: false,
    academicYears: [] as AcademicYears[],
    semesters: [] as Semesters[],
    academic_year: "",
    semester: "",
    refreshEvaluations: false,
    showCancelEvaluationModal: false,
    toastMessage: "",
    toastSuccess: false,
    toastVisible: false,
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

    if (name === "academic_year" || name === "semester") {
      setState((prevState) => ({
        ...prevState,
        refreshEvaluations: !prevState.refreshEvaluations,
      }));
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
      semester: "",
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

  const handleOpenCancelEvaluationModal = () => {
    setState((prevState) => ({
      ...prevState,
      showCancelEvaluationModal: true,
    }));
  };

  const handleCloseCancelEvaluationModal = () => {
    setState((prevState) => ({
      ...prevState,
      semesters: [] as Semesters[],
      academic_year: "",
      semester: "",
      showCancelEvaluationModal: false,
    }));
  };

  const handleCloseToastMessage = () => {
    setState((prevState) => ({
      ...prevState,
      toastMessage: "",
      toastSuccess: false,
      toastVisible: false,
    }));
  };

  useEffect(() => {
    handleLoadAcademicYears();
  }, []);

  const content = (
    <>
      <ToastMessage
        showToast={state.toastVisible}
        body={state.toastMessage}
        success={state.toastSuccess}
        onClose={handleCloseToastMessage}
      />
      <Row className="mb-3">
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
          <Button
            type="submit"
            className="mt-2"
            disabled={
              state.loadingUpdate || !state.academic_year || !state.semester
            }
            onClick={handleOpenCancelEvaluationModal}
          >
            CANCEL EVALUATION
          </Button>
        </Col>
      </Row>

      <CancelEvaluationModal
        showModal={state.showCancelEvaluationModal}
        semesterId={parseInt(state.semester)}
        academicYearId={parseInt(state.academic_year)}
        onEvaluationCancelled={(message) =>
          setState((prevState) => ({
            ...prevState,
            refreshEvaluations: !prevState.refreshEvaluations,
            toastMessage: message,
            toastSuccess: true,
            toastVisible: true,
          }))
        }
        onClose={handleCloseCancelEvaluationModal}
      />

      <CurrentEvaluationTable
        refreshCurrentEvaluations={state.refreshEvaluations}
        academicYearId={parseInt(state.academic_year)}
        semesterId={parseInt(state.semester)}
      />
    </>
  );

  return <Layout content={content} />;
};

export default CurrentEvaluations;
