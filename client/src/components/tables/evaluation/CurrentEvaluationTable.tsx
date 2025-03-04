import { useEffect, useState } from "react";
import { Button, ButtonGroup, Spinner, Table } from "react-bootstrap";
import Evaluations from "../../../interfaces/Evaluations";
import EvaluationService from "../../../services/EvaluationService";
import errorHandler from "../../../handler/errorHandler";

const CurrentEvaluationTable = () => {
  const [state, setState] = useState({
    loadingEvaluations: true,
    loadingUpdate: false,
    evaluations: [] as Evaluations[],
    evaluation_id: 0,
  });

  const handleLoadCurrentEvaluations = () => {
    EvaluationService.loadCurrentEvaluations()
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

  useEffect(() => {
    handleLoadCurrentEvaluations();
  }, []);

  const handleEmployeeFullName = (
    first_name: string = "",
    middle_name: string = "",
    last_name: string = "",
    suffix_name: string = ""
  ) => {
    let fullName = "";

    if (middle_name) {
      fullName = `${last_name}, ${first_name} ${middle_name.charAt(0)}.`;
    } else {
      fullName = `${last_name}, ${first_name}`;
    }

    if (suffix_name) {
      fullName += ` ${suffix_name}`;
    }

    return fullName;
  };

  return (
    <>
      <Table responsive hover>
        <thead>
          <tr className="align-items">
            <th>NO.</th>
            <th>EVALUATION FOR</th>
            <th>ACADEMIC YEAR</th>
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
              <tr className="align-middle" key={evaluation.evaluation_id}>
                <td>{index + 1}</td>
                <td>
                  {handleEmployeeFullName(
                    evaluation.employee_to_evaluate.first_name,
                    evaluation.employee_to_evaluate.middle_name,
                    evaluation.employee_to_evaluate.last_name,
                    evaluation.employee_to_evaluate.suffix_name
                  )}
                </td>
                <td>{evaluation.semester.academic_year.academic_year}</td>
                <td>
                  <ButtonGroup>
                    <Button type="button">CANCEL EVALUATION</Button>
                  </ButtonGroup>
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
