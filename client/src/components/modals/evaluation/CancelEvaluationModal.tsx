import { Button, Modal } from "react-bootstrap";
import { FormEvent, useEffect, useState } from "react";
import SpinnerSmall from "../../SpinnerSmall";
import EvaluationService from "../../../services/EvaluationService";
import errorHandler from "../../../handler/errorHandler";
import AcademicYearService from "../../../services/AcademicYearService";
import SemesterService from "../../../services/SemesterService";

interface CancelEvaluationModal {
  showModal: boolean;
  academicYearId: number | null;
  semesterId: number | null;
  onEvaluationCancelled: (message: string) => void;
  onClose: () => void;
}

const CancelEvaluationModal = ({
  showModal,
  academicYearId,
  semesterId,
  onEvaluationCancelled,
  onClose,
}: CancelEvaluationModal) => {
  const [state, setState] = useState({
    loadingCancel: false,
    academic_year_id: 0,
    semester_id: 0,
    academic_year: "",
    semester: "",
  });

  const handleFetchAcademicYear = (academicYearId: number) => {
    AcademicYearService.fetchAcademicYear(academicYearId)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            academic_year: res.data.academicYear.academic_year,
          }));
        } else {
          console.error("Unexpected status error: ", res.status);
        }
      })
      .catch((error) => {
        errorHandler(error, null, null);
      });
  };

  const handleFetchSemester = (semesterId: number) => {
    SemesterService.fetchSemester(semesterId)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            semester: res.data.semester.semester,
          }));
        } else {
          console.error("Unexpected status error: ", res.status);
        }
      })
      .catch();
  };

  const handleCancelledEvaluation = (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingCancel: true,
    }));

    EvaluationService.updateEvaluationToCancelled(
      state.semester_id,
      state.academic_year_id
    )
      .then((res) => {
        if (res.status === 200) {
          onEvaluationCancelled(res.data.message);
          onClose();
        } else {
          console.error("Unexpected error status: ", res.status);
        }
      })
      .catch((error) => {
        errorHandler(error, null, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingCancel: false,
        }));
      });
  };

  useEffect(() => {
    if (academicYearId && semesterId) {
      setState((prevState) => ({
        ...prevState,
        academic_year_id: academicYearId,
        semester_id: semesterId,
      }));

      handleFetchAcademicYear(academicYearId);
      handleFetchSemester(semesterId);
    }
  }, [academicYearId, semesterId]);

  return (
    <>
      <Modal show={showModal} onHide={onClose} backdrop="static">
        <Modal.Header>CANCEL EVALUATION?</Modal.Header>
        <form onSubmit={handleCancelledEvaluation}>
          <Modal.Body>
            <p>
              {`ARE YOU SURE DO YOU WANT TO CANCEL THE EVALUATION FROM ${state.semester}, A.Y. ${state.academic_year}?`}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              disabled={state.loadingCancel}
              onClick={onClose}
            >
              CLOSE
            </Button>
            <Button type="submit" disabled={state.loadingCancel}>
              {state.loadingCancel ? (
                <>
                  <SpinnerSmall /> CANCELING...
                </>
              ) : (
                "YES"
              )}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default CancelEvaluationModal;
