import { useEffect } from "react";
import Layout from "../layout/Layout";

const AddStudent = () => {
  useEffect(() => {
    document.title = "ADD STUDENT | FCU HR EMS";
  });

  const content = (
    <>
      <form>
        <div className="card shadow mx-auto mt-3 p-3">
          <h5 className="card-title">ADD STUDENT</h5>
          <div className="row">
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="first_name">FIRST NAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  id="first_name"
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="middle_name">MIDDLE NAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="middle_name"
                  id="middle_name"
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="last_name">LAST NAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  id="last_name"
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="suffix_name">SUFFIX NAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="suffix_name"
                  id="suffix_name"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="department">DEPARTMENT</label>
                <select
                  name="department"
                  id="department"
                  className="form-select"
                >
                  <option value="" selected>
                    N/A
                  </option>
                </select>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="course">COURSE</label>
                <select name="course" id="course" className="form-select">
                  <option value="" selected>
                    N/A
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-theme">
              SAVE STUDENT
            </button>
          </div>
        </div>
      </form>
    </>
  );

  return <Layout content={content} />;
};

export default AddStudent;
