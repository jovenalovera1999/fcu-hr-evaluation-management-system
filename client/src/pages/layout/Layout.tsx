import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Navbar,
  Spinner,
} from "react-bootstrap";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import AlertToastMessage from "../../components/ToastMessage";
import BackToTop from "../../components/BackToTop";

interface ContentProps {
  content: React.ReactNode;
}

interface Errors {
  password: string[];
  password_confirmation: string[];
  current_password: string[];
}

const Layout = ({ content }: ContentProps) => {
  const navigate = useNavigate();

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  if (!parsedUser) {
    return null;
  }

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [state, setState] = useState({
    loadingUser: false,
    loadingLogout: false,
    password: "",
    password_confirmation: "",
    current_password: "",
    errors: {} as Errors,
    showLogoutModal: false,
    showChangePasswordModal: false,
    toastSuccess: false,
    toastBody: "",
    showToast: false,
  });

  const handleResetNecessaryFields = () => {
    setState((prevState) => ({
      ...prevState,
      password: "",
      password_confirmation: "",
      current_password: "",
      errors: {} as Errors,
    }));
  };

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateUserPassword = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingUser: true,
    }));

    axiosInstance
      .put(`/user/update/password/${parsedUser.user_id}`, state)
      .then((res) => {
        if (res.data.status === 200) {
          handleResetNecessaryFields();
          setState((prevState) => ({
            ...prevState,
            loadingUser: false,
            showChangePasswordModal: false,
            toastSuccess: true,
            toastBody: "YOUR PASSWORD HAS BEEN SUCCESSFULLY UPDATED.",
            showToast: true,
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            loadingUser: false,
            toastSuccess: false,
            toastBody: "INCORRECT CURRENT PASSWORD.",
            showToast: true,
          }));
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
            loadingUser: false,
          }));
        } else {
          errorHandler(error, navigate, null);
        }
      });
  };

  const handleLogoutUser = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingLogout: true,
    }));

    axiosInstance
      .post("/user/process/logout", parsedUser)
      .then((res) => {
        if (res.data.status === 200) {
          handleResetNecessaryFields();
          localStorage.clear();

          navigate("/", {
            state: {
              toastSuccess: true,
              toastBody: "YOU HAVE SUCCESSFULLY LOGGED OUT.",
              showToast: true,
            },
          });
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate, null);
      });
  };

  const handleUserFullName = () => {
    let fullName = "";

    if (parsedUser.middle_name) {
      fullName = `${parsedUser.last_name}, ${
        parsedUser.first_name
      } ${parsedUser.middle_name.charAt(0)}.`;
    } else {
      fullName = `${parsedUser.last_name}, ${parsedUser.first_name}`;
    }

    if (parsedUser.suffix_name) {
      fullName += ` ${parsedUser.suffix_name}`;
    }

    return fullName;
  };

  const handleOpenLogoutModal = () => {
    setState((prevState) => ({
      ...prevState,
      showLogoutModal: true,
    }));
  };

  const handleOpenChangePasswordModal = () => {
    setState((prevState) => ({
      ...prevState,
      user_id: parsedUser.user_id,
      showChangePasswordModal: true,
    }));
  };

  const handleCloseLogoutModal = () => {
    setState((prevState) => ({
      ...prevState,
      showLogoutModal: false,
    }));
  };

  const handleCloseChangePasswordModal = () => {
    handleResetNecessaryFields();

    setState((prevState) => ({
      ...prevState,
      showChangePasswordModal: false,
    }));
  };

  const handleCloseToast = () => {
    setState((prevState) => ({
      ...prevState,
      toastSuccess: false,
      toastBody: "",
      showToast: false,
    }));
  };

  const handleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    if (!parsedUser) {
      errorHandler(401, navigate, null);
    }
  }, [parsedUser, navigate]);

  return (
    <>
      <AlertToastMessage
        success={state.toastSuccess}
        body={state.toastBody}
        showToast={state.showToast}
        onClose={handleCloseToast}
      />
      <div className="wrapper">
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <div className="main">
          <Navbar expand className="px-2 border-bottom">
            <div className="d-flex justify-content-between align-items-center w-100">
              <Button
                className="btn sidebar-toggler-btn"
                type="button"
                onClick={handleSidebar}
              >
                <span className="navbar-toggler-icon"></span>
              </Button>
              <div className="ms-auto">
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to={"#"}
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ paddingTop: "1px" }}
                  >
                    {handleUserFullName()}
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end bg-theme">
                    <li className="bg-theme">
                      <Button
                        className="dropdown-item dropdown-item-theme"
                        onClick={handleOpenChangePasswordModal}
                      >
                        CHANGE PASSWORD
                      </Button>
                    </li>
                    <li className="bg-theme">
                      <Button
                        className="dropdown-item dropdown-item-theme"
                        onClick={handleOpenLogoutModal}
                      >
                        LOGOUT
                      </Button>
                    </li>
                  </ul>
                </li>
              </div>
            </div>
          </Navbar>
          <main className="content px-3 py-2">
            <Container fluid>
              <div className="mb-3">{content}</div>
              <BackToTop />
            </Container>
          </main>
        </div>
      </div>

      <Modal
        show={state.showChangePasswordModal}
        onHide={handleCloseChangePasswordModal}
        size="sm"
        backdrop="static"
      >
        <ModalHeader>CHANGE PASSWORD</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <FormLabel htmlFor="password">NEW PASSWORD</FormLabel>
            <FormControl
              type="password"
              className={`${state.errors.password ? "is-invalid" : ""}`}
              name="password"
              id="password"
              value={state.password}
              onChange={handleInput}
              autoFocus
            />
            {state.errors.password && (
              <p className="text-danger">{state.errors.password[0]}</p>
            )}
          </div>
          <div className="mb-3">
            <FormLabel htmlFor="password_confirmation">
              PASSWORD CONFIRMATION
            </FormLabel>
            <FormControl
              type="password"
              className={`${
                state.errors.password_confirmation ? "is-invalid" : ""
              }`}
              name="password_confirmation"
              id="password_confirmation"
              value={state.password_confirmation}
              onChange={handleInput}
            />
            {state.errors.password_confirmation && (
              <p className="text-danger">
                {state.errors.password_confirmation}
              </p>
            )}
          </div>
          <div className="mb-3">
            <FormLabel htmlFor="current_password">CURRENT PASSWORD</FormLabel>
            <FormControl
              type="password"
              className={`${state.errors.current_password ? "is-invalid" : ""}`}
              name="current_password"
              id="current_password"
              value={state.current_password}
              onChange={handleInput}
            />
            {state.errors.current_password && (
              <p className="text-danger">{state.errors.current_password[0]}</p>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-theme"
            onClick={handleCloseChangePasswordModal}
            disabled={state.loadingUser}
          >
            CLOSE
          </Button>
          <Button
            className="btn-theme"
            onClick={handleUpdateUserPassword}
            disabled={state.loadingUser}
          >
            {state.loadingUser ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  size="sm"
                  className="spinner-theme"
                />{" "}
                UPDATING...
              </>
            ) : (
              "SAVE"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        show={state.showLogoutModal}
        onHide={handleCloseLogoutModal}
        backdrop="static"
      >
        <ModalHeader>LOGOUT</ModalHeader>
        <ModalBody>ARE YOU SURE YOU WANT TO LOGOUT?</ModalBody>
        <ModalFooter>
          <Button
            className="btn-theme"
            onClick={handleCloseLogoutModal}
            disabled={state.loadingLogout}
          >
            CLOSE
          </Button>
          <Button
            className="btn-theme"
            onClick={handleLogoutUser}
            disabled={state.loadingLogout}
          >
            {state.loadingLogout ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  size="sm"
                  className="spinner-theme"
                />{" "}
                LOGGING OUT...
              </>
            ) : (
              "YES"
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Layout;
