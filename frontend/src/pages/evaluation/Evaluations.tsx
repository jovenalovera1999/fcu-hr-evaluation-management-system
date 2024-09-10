import { useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";

interface EvaluationsProps {
  baseUrl: string;
  csrfToken: string | null | undefined;
}

interface Employees {
  evaluation_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
}

const Evaluations = ({ baseUrl, csrfToken }: EvaluationsProps) => {
  const [state, setState] = useState({
    loadingEmployees: true,
    employees: [] as Employees[],
  });

  const handleLoadEmployees = async () => {
    await axios.get(`${baseUrl}`).then().catch();
  };

  const content = (
    <>
      <div className="card shadow mx-auto mt-3 p-3">
        <h5 className="card-title">LIST OF TEACHERS</h5>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>NO.</th>
                  <th>NAME OF EMPLOYEES</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  return <Layout content={content} />;
};

export default Evaluations;
