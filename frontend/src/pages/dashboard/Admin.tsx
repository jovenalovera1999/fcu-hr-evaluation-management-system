import { useEffect } from "react";
import Layout from "../layout/Layout";

const Admin = () => {
  useEffect(() => {
    document.title = "ADMIN DASHBOARD | FCU HR EMS";
  });

  const content = (
    <>
      <div className="row mb-2">
        <div className="col-sm-3">
          <label htmlFor="semester">SEMESTER</label>
          <select name="semester" id="semester" className="form-select">
            <option value="">N/A</option>
            <option value="">1ST</option>
            <option value="">2ND</option>
            <option value="">3RD</option>
            <option value="">4TH</option>
            <option value="">5TH</option>
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-3 g-2">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "73px" }}
          >
            <h5 className="card-title">TOTAL RESPONDERS</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-3 g-2">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "73px" }}
          >
            <h5 className="card-title">TOTAL RESPONDED</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-3 g-2">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "73px" }}
          >
            <h5 className="card-title">TOTAL NO. OF STUDENTS</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-3 g-2">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "73px" }}
          >
            <h5 className="card-title">TOTAL NO. OF EMPLOYEES</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "123px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED POOR</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "123px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED MEDIOCRE</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "123px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED SATISFACTORY</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "123px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED GOOD</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "123px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED EXECELLENT</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-3 g-2">Pie chart</div>
        <div className="col-sm-9 g-2">Line chart</div>
      </div>
    </>
  );

  return <Layout content={content} />;
};

export default Admin;
