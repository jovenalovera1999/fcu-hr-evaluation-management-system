import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";

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

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
                    className="nav-link dropdown-toggle pb-1"
                    to={"#"}
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {handleUserFullName()}
                  </Link>
                  <ul className="dropdown-menu background-theme">
                    <li className="background-theme">
                      <Link
                        className="dropdown-item dropdown-item-theme"
                        to={"/logout"}
                      >
                        LOGOUT
                      </Link>
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
    </>
  );
};

export default Layout;
