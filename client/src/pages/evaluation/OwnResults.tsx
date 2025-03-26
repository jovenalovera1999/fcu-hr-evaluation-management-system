import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import OwnResultsTable from "../../components/tables/result/OwnResultsTable";
import OwnResultsFilterForm from "../../components/forms/OwnResultsFilterForm";
import Layout from "../layout/Layout";

const OwnResults = () => {
  const [refreshResults, setRefreshResults] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  useEffect(() => {}, []);

  const content = (
    <>
      <Row>
        <h3 className="mb-3">MY OWN RESULT</h3>
      </Row>
      <Row>
        <OwnResultsFilterForm
          onAcademicYearChange={(academicYearId) => {
            setSelectedAcademicYear(academicYearId);
            setRefreshResults(!refreshResults);
          }}
          onSemesterChange={(semesterId) => {
            setSelectedSemester(semesterId);
            setRefreshResults(!refreshResults);
          }}
        />
      </Row>
      <Row>
        <OwnResultsTable
          academicYear={selectedAcademicYear}
          semester={selectedSemester}
          refreshResults={refreshResults}
        />
      </Row>
    </>
  );

  return <Layout content={content} />;
};

export default OwnResults;
