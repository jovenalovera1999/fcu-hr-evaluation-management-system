import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  baseUrl: string;
  csrfToken: string | null | undefined;
}

interface Errors {
  username?: string[];
  password?: string[];
}

const Login = ({ baseUrl, csrfToken }: LoginProps) => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    loading: true,
    loadingLogin: false,
    username: "",
    password: "",
    errors: {} as Errors,
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingLogin: true,
    }));

    await axios
      .post(`${baseUrl}/user/process/login`, state, {
        headers: { "X-CSRF-TOKEN": csrfToken },
      })
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.token);

          navigate("/employee/list");
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.errors) {
          setState((prevState) => ({
            ...prevState,
            loadingLogin: false,
            errors: error.response.data.errors,
          }));
        } else {
          console.error("Unexpect server error: ", error);
        }
      });
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="card shadow col-sm-3">
            <div className="row background-theme m-0">
              <h5 className="card-title mt-3">
                USER AUTHENTICATION | FCU HR EMS
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="username">USERNAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  id="username"
                  value={state.username}
                  onChange={handleInput}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password">PASSWORD</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  value={state.password}
                  onChange={handleInput}
                />
              </div>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-theme">
                  LOGIN
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
