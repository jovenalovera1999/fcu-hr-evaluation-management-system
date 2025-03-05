import { Button, Modal } from "react-bootstrap";
import Evaluations from "../../../interfaces/Evaluations";
import { useState } from "react";
import SpinnerSmall from "../../SpinnerSmall";

interface CancelEvaluationModal {
  showModal: boolean;
  evaluation: Evaluations | null;
  onEvaluationCancelled: (message: string) => void;
  onClose: () => void;
}

const CancelEvaluationModal = ({
  showModal,
  onEvaluationCancelled,
  onClose,
}: CancelEvaluationModal) => {
  const [state, setState] = useState({
    loadingCancel: false,
    academic_year: "",
  });

  return (
    <>
      <Modal show={showModal} onHide={onClose} backdrop="static">
        <Modal.Header>CANCEL EVALUATION?</Modal.Header>
        <Modal.Body>
          <p>ARE YOU SURE YOU WANT TO CANCEL THIS EVALUATION?</p>
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
      </Modal>
    </>
  );
};

export default CancelEvaluationModal;
