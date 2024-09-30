import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import ToastMessage from "../../components/ToastMessage";

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
  const location = useLocation();

  const [loadingLogin, setLoadingLogin] = useState(true);

  const [state, setState] = useState({
    username: "",
    password: "",
    errors: {} as Errors,
    toastMessage: "",
    toastMessageSuccess: false,
    toastMessageVisible: false,
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

    setLoadingLogin(true);

    await axios
      .post(`${baseUrl}/user/process/login`, state, {
        headers: { "X-CSRF-TOKEN": csrfToken },
      })
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.token);

          const user = localStorage.getItem("user");
          const parsedUser = user ? JSON.parse(user) : null;

          if (parsedUser.position === "ADMIN") {
            navigate("/employee/list");
          } else {
            navigate("/evaluation/list");
          }
        } else {
          setLoadingLogin(false);

          setState((prevState) => ({
            ...prevState,
            toastMessage: "INCORRECT USERNAME OR PASSWORD, PLEASE TRY AGAIN.",
            toastMessageVisible: true,
          }));
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.errors) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));

          setLoadingLogin(false);
        } else {
          console.error("Unexpect server error: ", error);
        }
      });
  };

  const handleToastMessageFromLogout = () => {
    if (location.state) {
      setState((prevState) => ({
        ...prevState,
        toastMessage: location.state.toastMessage,
        toastMessageSuccess: location.state.toastMessageSuccess,
        toastMessageVisible: location.state.toastMessageVisible,
      }));
    }
  };

  const handleCloseToastMessage = () => {
    navigate(".", {
      replace: true,
      state: {
        ...location.state,
        toastMessage: "",
        toastMessageSuccess: false,
        toastMessageVisible: false,
      },
    });

    setState((prevState) => ({
      ...prevState,
      toastMessage: "",
      toastMessageSuccess: false,
      toastMessageVisible: false,
    }));
  };

  useEffect(() => {
    document.title = "USER AUTHENTICATION | FCU HR EMS";

    setLoadingLogin(false);
    handleToastMessageFromLogout();
  }, [location.state]);

  const content = (
    <>
      <ToastMessage
        message={state.toastMessage}
        success={state.toastMessageSuccess}
        visible={state.toastMessageVisible}
        onClose={handleCloseToastMessage}
      />
      <form onSubmit={handleLogin}>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="card shadow col-sm-3">
            <div className="row bg-theme m-0">
              <h5 className="card-title mt-3">
                USER AUTHENTICATION | FCU HR EMS
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="username">USERNAME</label>
                <input
                  type="text"
                  className={`form-control ${
                    state.errors.username ? "is-invalid" : ""
                  }`}
                  name="username"
                  id="username"
                  value={state.username}
                  onChange={handleInput}
                />
                {state.errors.username && (
                  <p className="text-danger">{state.errors.username[0]}</p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password">PASSWORD</label>
                <input
                  type="password"
                  className={`form-control ${
                    state.errors.password ? "is-invalid" : ""
                  }`}
                  name="password"
                  id="password"
                  value={state.password}
                  onChange={handleInput}
                />
                {state.errors.password && (
                  <p className="text-danger">{state.errors.password[0]}</p>
                )}
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-theme w-100">
                  LOGIN
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );

  return loadingLogin ? <Spinner /> : content;
};

export default Login;
