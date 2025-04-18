import { useEffect, useState } from "react";
import Evaluations from "../../../interfaces/Evaluations";
import EvaluationService from "../../../services/EvaluationService";
import errorHandler from "../../../handler/errorHandler";
import Semesters from "../../../interfaces/Semesters";
import AcademicYears from "../../../interfaces/AcademicYear";
import Employees from "../../../interfaces/Employees";
import { Button, Spinner, Table } from "react-bootstrap";
import CancelSingleEvaluationModal from "../../modals/evaluation/CancelSingleEvaluationModal";
import ToastMessage from "../../ToastMessage";

interface CurrentEvaluationTableProps {
  refreshCurrentEvaluations: boolean;
  academicYearId: number | null;
  semesterId: number | null;
}

const CurrentEvaluationTable = ({
  refreshCurrentEvaluations,
  academicYearId,
  semesterId,
}: CurrentEvaluationTableProps) => {
  const [state, setState] = useState({
    loadingEvaluations: true,
    loadingUpdate: false,
    evaluations: [] as Evaluations[],
    evaluation_id: 0,
    toastMessage: "",
    toastSuccess: false,
    toastVisible: false,
    showCancelSingleEvaluationModal: false,
  });

  const handleLoadCurrentEvaluations = () => {
    setState((prevState) => ({
      ...prevState,
      loadingEvaluations: true,
    }));

    EvaluationService.loadCurrentEvaluations(academicYearId, semesterId)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            evaluations: res.data.evaluations,
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
          loadingEvaluations: false,
        }));
      });
  };

  const handleEmployeeFullnameFormat = (employee: Employees) => {
    let fullName = "";

    if (employee.middle_name) {
      fullName = `${employee.last_name}, ${
        employee.first_name
      } ${employee.middle_name.charAt(0)}`;
    } else {
      fullName = `${employee.last_name}, ${employee.first_name}`;
    }

    if (employee.suffix_name) {
      fullName += ` ${employee.suffix_name}`;
    }

    return fullName;
  };

  const handleSemesterAndAcademicYearFormat = (
    semester: Semesters,
    academic_year: AcademicYears
  ) => {
    return `${semester.semester}, ${academic_year.academic_year}`;
  };

  const handleShowToastMessage = (
    message: string,
    success: boolean,
    visible: boolean
  ) => {
    setState((prevState) => ({
      ...prevState,
      toastMessage: message,
      toastSuccess: success,
      toastVisible: visible,
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

  const handleOpenCancelSingleEvaluationModal = (evaluation: Evaluations) => {
    setState((prevState) => ({
      ...prevState,
      evaluation_id: evaluation.evaluation_id,
      showCancelSingleEvaluationModal: true,
    }));
  };

  const handleCloseCancelEvaluationModal = () => {
    setState((prevState) => ({
      ...prevState,
      evaluation_id: 0,
      showCancelSingleEvaluationModal: false,
    }));
  };

  useEffect(() => {
    handleLoadCurrentEvaluations();
  }, [refreshCurrentEvaluations]);

  return (
    <>
      <ToastMessage
        body={state.toastMessage}
        success={state.toastSuccess}
        showToast={state.toastVisible}
        onClose={handleCloseToastMessage}
      />
      <CancelSingleEvaluationModal
        showModal={state.showCancelSingleEvaluationModal}
        evaluationId={state.evaluation_id}
        onEvaluationCancelled={(message) => {
          handleShowToastMessage(message, true, true);
          handleLoadCurrentEvaluations();
        }}
        onClose={handleCloseCancelEvaluationModal}
      />
      <Table responsive hover>
        <thead>
          <tr className="align-items">
            <th>NO.</th>
            <th>PERSON TO EVALUATE</th>
            <th>SEMESTER AND ACADEMIC YEAR</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {state.loadingEvaluations ? (
            <tr>
              <td colSpan={4} className="text-center">
                <Spinner as="span" animation="border" role="status" />
              </td>
            </tr>
          ) : (
            state.evaluations.map((evaluation, index) => (
              <tr className="align-middle" key={index}>
                <td>{index + 1}</td>
                <td>
                  {handleEmployeeFullnameFormat(
                    evaluation.employee_to_evaluate
                  )}
                </td>
                <td>
                  {handleSemesterAndAcademicYearFormat(
                    evaluation.semester,
                    evaluation.semester.academic_year
                  )}
                </td>
                <td>
                  <Button
                    type="button"
                    onClick={() =>
                      handleOpenCancelSingleEvaluationModal(evaluation)
                    }
                  >
                    Cancel Evaluation
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
};

export default CurrentEvaluationTable;
