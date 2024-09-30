import { FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";

interface LogoutProps {
  baseUrl: string;
  csrfToken: string | null | undefined;
}

const Logout = ({ baseUrl, csrfToken }: LogoutProps) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const [loadingLogout, setLoadingLogout] = useState(true);

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();

    setLoadingLogout(true);

    await axios
      .post(`${baseUrl}/user/process/logout`, parsedUser, {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.clear();
          navigate("/", {
            state: {
              toastMessage: "YOU HAVE SUCCESSFULLY LOGGED OUT!",
              toastMessageSuccess: true,
              toastMessageVisible: true,
            },
          });
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        console.error("Unexpected server error: ", error);
      });
  };

  useEffect(() => {
    document.title = "LOGOUT | FCU HR EMS";
    setLoadingLogout(false);
  }, []);

  const content = (
    <>
      <form onSubmit={handleLogout}>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="card shadow col-sm-5">
            <div className="row bg-theme m-0">
              <h5 className="card-title mt-3">
                ARE YOU SURE DO YOU WANT TO LOGOUT?
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

  return <Layout content={loadingLogout ? <Spinner /> : content} />;
};

export default Logout;
