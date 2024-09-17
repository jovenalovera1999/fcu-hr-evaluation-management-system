import { useState } from "react";
import Layout from "../layout/Layout";

interface ResponseProps {
  baseUrl: string;
}

interface CategoriesWithQuestions {
  response_id: number;
  questions: string;
}

const Response = ({ baseUrl }: ResponseProps) => {
  const [state, setState] = useState({
    loadingSubmitEvaluation: false,
    loadingCategoriesWithQuestions: true,
  });

  const content = (
    <>
      <div className="card shadow mx-auto mt-3 p-3">
        <h5 className="card-title">EVALUATION RESPONSE</h5>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-4">
              <p className="fs-6">
                <strong>TEACHER NAME: </strong>
                <u>NAME OF TEACHER</u>
              </p>
            </div>
            <div className="col-sm-4">
              <p className="fs-6">
                <strong>DEPARTMENT: </strong>
                <u>NAME OF DEPARTMENT</u>
              </p>
            </div>
            <div className="col-sm-4">
              <p className="fs-6">
                <strong>POSITION: </strong>
                <u>NAME OF POSITION</u>
              </p>
            </div>
          </div>
          <div className="table-responsive mb-3">
            <h5></h5>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>NO.</th>
                  <th>QUESTION</th>
                  <th>POOR</th>
                  <th>MEDIOCRE</th>
                  <th>SATISFACTORY</th>
                  <th>GOOD</th>
                  <th>EXCELLETE</th>
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

export default Response;
