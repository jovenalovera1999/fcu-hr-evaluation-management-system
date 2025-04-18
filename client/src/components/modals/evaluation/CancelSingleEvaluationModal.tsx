import { Button, Modal } from "react-bootstrap";
import SpinnerSmall from "../../SpinnerSmall";
import { FormEvent, useState } from "react";
import EvaluationService from "../../../services/EvaluationService";

interface CancelSingleEvaluationModal {
  showModal: boolean;
  evaluationId: number;
  onEvaluationCancelled: (message: string) => void;
  onClose: () => void;
}

const CancelSingleEvaluationModal = ({
  showModal,
  evaluationId,
  onEvaluationCancelled,
  onClose,
}: CancelSingleEvaluationModal) => {
  const [state, setState] = useState({
    loadingCancel: false,
    academic_year: "",
    semester: "",
  });

  const handleCancelledEvaluation = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingCancel: true,
    }));

    try {
      const res = await EvaluationService.updateSingleEvaluationToCancelled(
        evaluationId
      );

      if (res.status === 200) {
        onEvaluationCancelled(res.data.message);
        onClose();
      } else {
        console.error(
          "Unexpected status error occurred during cancel single evaluation: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during cancel single evaluation: ",
        error
      );
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={onClose} backdrop="static">
        <Modal.Header>CANCEL EVALUATION?</Modal.Header>
        <form onSubmit={handleCancelledEvaluation}>
          <Modal.Body>
            <p>
              {`ARE YOU SURE DO YOU WANT TO CANCEL THIS EVALUATION FROM ${state.semester}, A.Y. ${state.academic_year}?`}
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

export default CancelSingleEvaluationModal;
