import { useEffect } from "react";
import Layout from "../layout/Layout";

const Logout = () => {
  useEffect(() => {
    document.title = "LOGOUT | FCU HR EMS";
  });

  const content = (
    <>
      <form>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="card shadow col-sm-4">
            <div className="row background-theme m-0">
              <h5 className="card-title mt-3">
                ARE YOU SURE YOU WANT TO LOGOUT?
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-theme w-100">
                  YES
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );

  return <Layout content={content} />;
};

export default Logout;
