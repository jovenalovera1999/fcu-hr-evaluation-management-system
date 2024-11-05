import { Col, FormLabel, FormSelect, Row, Table } from "react-bootstrap";
import Layout from "../layout/Layout";
import { useState } from "react";

interface Results {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  position: string;
  department: string;
  poor: string;
  mediocre: string;
  satisfactory: string;
  good: string;
  excellent: string;
}

const Results = () => {
  const [state, setState] = useState({
    loadingResults: true,
    results: [] as Results[],
  });

  const content = (
    <>
      <div className="mx-auto mt-2">
        <Row>
          <Col sm={3}>
            <div className="mb-3">
              <FormLabel htmlFor="semester">SEMESTER</FormLabel>
              <FormSelect name="semester" id="semester">
                <option value="" key={1}>
                  N/A
                </option>
              </FormSelect>
            </div>
          </Col>
          <Col sm={3}>
            <div className="mb-3">
              <FormLabel>ACADEMIC YEAR</FormLabel>
              <FormSelect name="academic_year" id="academic_year">
                <option value="" key={1}>
                  N/A
                </option>
              </FormSelect>
            </div>
          </Col>
        </Row>
        <Row>
          <Table hover size="sm" responsive="sm">
            <thead>
              <tr>
                <th>NO.</th>
                <th>NAME OF EMPLOYEE</th>
                <th>POSITION</th>
                <th>POOR</th>
                <th>MEDIOCRE</th>
                <th>SATISFACTORY</th>
                <th>GOOD</th>
                <th>EXCELLENT</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr></tr>
            </tbody>
          </Table>
        </Row>
      </div>
    </>
  );

  return <Layout content={content} />;
};

export default Results;
