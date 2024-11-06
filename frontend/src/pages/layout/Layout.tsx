import React, { FormEvent, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "react-bootstrap";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";

interface ContentProps {
  content: React.ReactNode;
}

const Layout = ({ content }: ContentProps) => {
  const navigate = useNavigate();

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  if (!parsedUser) {
    return null;
  }

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();

    setLoadingLogout(true);

    axiosInstance
      .post("/user/process/logout", parsedUser)
      .then((res) => {
        if (res.data.status === 200) {
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
        errorHandler(error);
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

  const handleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    if (!parsedUser) {
      navigate("/");
    }
  }, [parsedUser, navigate]);

  return (
    <>
      <div className="wrapper">
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <div className="main">
          <nav className="navbar navbar-expand px-3 border-bottom sticky-top">
            <div className="d-flex justify-content-between align-items-end w-100">
              <div>
                <button
                  className="btn custom-btn"
                  type="button"
                  onClick={handleSidebar}
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              </div>
              <div className="ms-auto text-white">
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle pb-1 pe-2"
                    to={"#"}
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {handleUserFullName()}
                  </Link>
                  <ul className="dropdown-menu bg-theme">
                    <li className="bg-theme">
                      <Button
                        className="dropdown-item dropdown-item-theme"
                        onClick={() => setShowModal(true)}
                      >
                        LOGOUT
                      </Button>
                    </li>
                  </ul>
                </li>
              </div>
            </div>
          </nav>
          <main className="content px-3 py-2">
            <div className="container-fluid">
              <div className="mb-3">{content}</div>
            </div>
          </main>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
      >
        <ModalHeader>LOGOUT</ModalHeader>
        <ModalBody>ARE YOU SURE YOU WANT TO LOGOUT?</ModalBody>
        <ModalFooter>
          <Button
            className="btn-theme"
            onClick={() => setShowModal(false)}
            disabled={loadingLogout}
          >
            CLOSE
          </Button>
          <Button
            className="btn-theme"
            onClick={handleLogout}
            disabled={loadingLogout}
          >
            {loadingLogout ? (
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
