import { useEffect, useState } from "react";
import Evaluations from "../../../interfaces/Evaluations";
import EvaluationService from "../../../services/EvaluationService";
import errorHandler from "../../../handler/errorHandler";
import Semesters from "../../../interfaces/Semesters";
import AcademicYears from "../../../interfaces/AcademicYear";
import Employees from "../../../interfaces/Employees";
import { Spinner, Table } from "react-bootstrap";

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
  });

  const handleLoadCurrentEvaluations = () => {
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

  useEffect(() => {
    handleLoadCurrentEvaluations();
  }, [refreshCurrentEvaluations]);

  return (
    <>
      <Table responsive hover>
        <thead>
          <tr className="align-items">
            <th>NO.</th>
            <th>PERSON TO EVALUATE</th>
            <th>SEMESTER AND ACADEMIC YEAR</th>
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
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
};

export default CurrentEvaluationTable;
