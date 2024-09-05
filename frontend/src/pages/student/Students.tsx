import { useEffect } from "react";
import Layout from "../layout/Layout";

const Students = () => {
  useEffect(() => {
    document.title = "LIST OF STUDENTS | FCU HR EMS";
  });

  const content = (
    <>
      <div className="mx-auto mt-3">
        <div className="table-responsive">
          <table className="table table-hover border-bottom">
            <thead>
              <tr>
                <th>NO.</th>
                <th>NAME OF STUDENTS</th>
                <th>DEPARTMENT</th>
                <th>COURSE</th>
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

export default Students;
