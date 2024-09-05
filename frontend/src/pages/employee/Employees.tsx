import Layout from "../layout/Layout";

const Employees = () => {
  const content = (
    <>
      <div className="mx-auto mt-3">
        <div className="table-responsive">
          <table className="table table-hover border-bottom">
            <thead>
              <tr>
                <th>NO.</th>
                <th>NAME OF EMPLOYEES</th>
                <th>POSITION</th>
                <th>DEPARTMENT</th>
                <th>ACTION</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </>
  );

  return <Layout content={content} />;
};

export default Employees;
