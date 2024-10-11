import Layout from "../layout/Layout";

const SendAnEvaluationToIrregularStudents = () => {
  const content = (
    <>
      <div className="mx-auto mt-2">
        <h4>SEND AN EVALUATION TO IRREGULAR STUDENTS</h4>
        <div className="row">
          <div className="mb-3">
            <div className="table-responsive">
              <h5 className="mt-2 mb-3">LIST OF IRREGULAR STUDENTS</h5>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>NO.</th>
                    <th>STUDENT NO.</th>
                    <th>STUDENT NAME</th>
                    <th>DEPARTMENT/COURSE</th>
                    <th>SECTION</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return <Layout content={content} />;
};

export default SendAnEvaluationToIrregularStudents;
