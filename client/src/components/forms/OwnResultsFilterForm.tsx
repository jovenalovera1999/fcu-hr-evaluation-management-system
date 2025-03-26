import { useEffect, useState } from "react";
import { Col, Form, FormFloating } from "react-bootstrap";
import AcademicYears from "../../interfaces/AcademicYear";
import Semesters from "../../interfaces/Semesters";
import AcademicYearService from "../../services/AcademicYearService";
import errorHandler from "../../handler/errorHandler";
import SemesterService from "../../services/SemesterService";

interface OwnResultsFilterFormProps {
  onAcademicYearChange: (academicYearId: string) => void;
  onSemesterChange: (semesterId: string) => void;
}

const OwnResultsFilterForm = ({
  onAcademicYearChange,
  onSemesterChange,
}: OwnResultsFilterFormProps) => {
  const [loadingAcademicYears, setLoadingAcademicYears] = useState(false);
  const [loadingSemesters, setLoadingSemesters] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYears[]>([]);
  const [semesters, setSemesters] = useState<Semesters[]>([]);
  const [academic_year, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");

  const handleLoadAcademicYears = () => {
    AcademicYearService.loadAcademicYears()
      .then((res) => {
        if (res.status === 200) {
          setAcademicYears(res.data.academicYears);
        } else {
          console.error(
            "Unexpected status error while loading academic years: ",
            res.status
          );
        }
      })
      .catch((error) => {
        errorHandler(error, null, null);
      })
      .finally(() => {
        setLoadingAcademicYears(false);
      });
  };

  const handleLoadSemesters = (academicYearId: number) => {
    SemesterService.loadSemesters(academicYearId)
      .then((res) => {
        if (res.status === 200) {
          setSemesters(res.data.semesters);
        } else {
          console.error(
            "Unexpected status error while loading semesters: ",
            res.status
          );
        }
      })
      .catch((error) => {
        errorHandler(error, null, null);
      })
      .finally(() => {
        setLoadingSemesters(false);
      });
  };

  useEffect(() => {
    handleLoadAcademicYears();
  }, []);

  return (
    <>
      <Col md={3}>
        <FormFloating className="mb-3">
          <Form.Select
            name="academic_year"
            id="academic_year"
            value={academic_year}
            onChange={(e) => {
              setAcademicYear(e.target.value);
              handleLoadSemesters(parseInt(e.target.value));
              onAcademicYearChange(e.target.value);
            }}
          >
            <option value="">SELECT ACADEMIC YEAR</option>
            {loadingAcademicYears ? (
              <option value="">LOADING...</option>
            ) : (
              academicYears.map((academicYear, index) => (
                <option value={academicYear.academic_year_id} key={index}>
                  {academicYear.academic_year}
                </option>
              ))
            )}
          </Form.Select>
          <label htmlFor="academic_year">ACADEMIC YEAR</label>
        </FormFloating>
      </Col>
      <Col md={3}>
        <Form.Floating>
          <Form.Select
            name="semester"
            id="semester"
            value={semester}
            onChange={(e) => {
              setSemester(e.target.value);
              onSemesterChange(e.target.value);
            }}
          >
            <option value="">SELECT SEMESTER</option>
            {loadingSemesters ? (
              <option value="">LOADING...</option>
            ) : (
              semesters.map((semester, index) => (
                <option value={semester.semester_id} key={index}>
                  {semester.semester}
                </option>
              ))
            )}
          </Form.Select>
          <label htmlFor="semester">SEMESTER</label>
        </Form.Floating>
      </Col>
    </>
  );
};

export default OwnResultsFilterForm;
