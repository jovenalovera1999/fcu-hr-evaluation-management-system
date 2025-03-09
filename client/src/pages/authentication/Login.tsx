import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "../../assets/img/company_logo.png";
import LoginBackgroundImage from "../../assets/img/LoginPageBackground.jpg";
import ToastMessage from "../../components/ToastMessage";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";

interface Errors {
  username?: string[];
  password?: string[];
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState({
    loadingLogin: false,
    username: "",
    password: "",
    errors: {} as Errors,
    toastSuccess: false,
    toastBody: "",
    showToast: false,
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
      .post("http://127.0.0.1:8000/api/user/process/login", state, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.token);

          const user = localStorage.getItem("user");
          const parsedUser = user ? JSON.parse(user) : null;

          setState((prevState) => ({
            ...prevState,
            loadingLogin: false,
          }));

          if (parsedUser.position === "ADMIN") {
            navigate("/dashboard/admin");
          } else {
            navigate("/evaluation/list");
          }
        } else {
          setState((prevState) => ({
            ...prevState,
            loadingLogin: false,
            toastSuccess: false,
            toastBody: "INCORRECT USERNAME OR PASSWORD, PLEASE TRY AGAIN.",
            showToast: true,
          }));
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.errors) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));

          setState((prevState) => ({
            ...prevState,
            loadingLogin: false,
          }));
        } else {
          console.error("Unexpect server error: ", error);
        }
      });
  };

  const handleToastMessageFromLogout = () => {
    if (location.state) {
      setState((prevState) => ({
        ...prevState,
        toastSuccess: location.state.toastSuccess,
        toastBody: location.state.toastBody,
        showToast: location.state.showToast,
      }));
    }
  };

  const handleCloseToast = () => {
    navigate(".", {
      replace: true,
      state: {
        ...location.state,
        toastSuccess: "",
        toastBody: false,
        showToast: false,
      },
    });

    setState((prevState) => ({
      ...prevState,
      toastSuccess: false,
      toastBody: "",
      showToast: false,
    }));
  };

  useEffect(() => {
    document.title = "USER AUTHENTICATION | FCU HR EMS";
    handleToastMessageFromLogout();
  }, [location.state]);

  const content = (
    <>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <div
          style={{
            backgroundImage: `url(${LoginBackgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
            filter: "blur(3px)",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <ToastMessage
          success={state.toastSuccess}
          body={state.toastBody}
          showToast={state.showToast}
          onClose={handleCloseToast}
        />
        <form onSubmit={handleLogin}>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
          >
            <Card className="card shadow col-md-3">
              <Row className="m-0">
                <CardTitle className="mt-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <CardImg
                      variant="top"
                      src={CompanyLogo}
                      style={{ width: "115px" }}
                    />
                    USER AUTHENTICATION | FCU HR EMS
                  </div>
                </CardTitle>
              </Row>
              <CardBody>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="text"
                    className={`${state.errors.username ? "is-invalid" : ""}`}
                    name="username"
                    id="username"
                    placeholder=""
                    onChange={handleInput}
                    value={state.username}
                    autoFocus
                  />
                  <label htmlFor="username">USERNAME</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="password"
                    className={`${state.errors.password ? "is-invalid" : ""}`}
                    name="password"
                    id="password"
                    placeholder=""
                    onChange={handleInput}
                    value={state.password}
                  />
                  <label htmlFor="password">PASSWORD</label>
                  {state.errors.password && (
                    <p className="text-danger">{state.errors.password[0]}</p>
                  )}
                </Form.Floating>
                <div className="d-flex justify-content-center">
                  <Button
                    type="submit"
                    className="btn-theme w-100"
                    disabled={state.loadingLogin}
                  >
                    {state.loadingLogin ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          role="status"
                          size="sm"
                          className="spinner-theme"
                        />{" "}
                        LOGGING IN...
                      </>
                    ) : (
                      "LOGIN"
                    )}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </form>
      </div>
    </>
  );

  return content;
};

export default Login;
