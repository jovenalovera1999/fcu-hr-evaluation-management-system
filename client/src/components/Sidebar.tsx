import { Link, NavLink } from "react-router-dom";
import CompanyLogoWithLabel from "../assets/img/CompanyLogoWithLabel.png";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  return (
    <>
      <aside
        id="sidebar"
        className={`${isCollapsed ? "collapsed" : ""} sticky-top`}
      >
        <div className="h-100">
          <div className="sidebar-logo">
            {/* <img src={CompanyLogo} alt="Company Logo" width={50} /> */}
            <Link to={"#"}>
              {/* FCU HR EVALUATION MANAGEMENT SYSTEM */}
              <img
                src={CompanyLogoWithLabel}
                alt="Company Logo"
                style={{
                  width: "230px",
                  height: "100px",
                  marginLeft: "-10px",
                  marginTop: "-10px",
                }}
              />
            </Link>
          </div>
          <ul className="sidebar-nav">
            {parsedUser && parsedUser.position === "ADMIN" ? (
              <>
                <li className="sidebar-item">
                  <NavLink
                    to={"/dashboard/admin"}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                  >
                    DASHBOARD
                  </NavLink>
                </li>
                <li className="sidebar-item">
                  <NavLink
                    to={"/employee/list"}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                  >
                    EMPLOYEES
                  </NavLink>
                </li>
                <li className="sidebar-item">
                  <NavLink
                    to={"/student/list"}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                  >
                    STUDENTS
                  </NavLink>
                </li>
                <li className="sidebar-item">
                  <NavLink
                    to={"/question/list"}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                  >
                    QUESTIONS
                  </NavLink>
                </li>
                {/* <li className="sidebar-item">
                  <NavLink
                    to={"/category/list"}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                  >
                    CATEGORIES
                  </NavLink>
                </li> */}
                <li className="sidebar-item">
                  <Link
                    to={"#"}
                    className="sidebar-link collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#evaluations"
                    aria-expanded="false"
                    aria-controls="evaluations"
                  >
                    EVALUATIONS
                  </Link>
                  <ul
                    id="evaluations"
                    className="sidebar-dropdown list-unstyled collapse"
                    data-bs-parent="#sidebar"
                  >
                    <li className="sidebar-item">
                      <NavLink
                        to={"/evaluation/list"}
                        className={({ isActive }) =>
                          `sidebar-link ${isActive ? "active" : ""}`
                        }
                      >
                        LIST
                      </NavLink>
                    </li>
                    <li className="sidebar-item">
                      <NavLink
                        to={"/evaluation/current"}
                        className={({ isActive }) =>
                          `sidebar-link ${isActive ? "active" : ""}`
                        }
                      >
                        CURRENT EVALUATIONS
                      </NavLink>
                    </li>
                    <li className="sidebar-item">
                      <NavLink
                        to={"/evaluation/to/students"}
                        className={({ isActive }) =>
                          `sidebar-link ${isActive ? "active" : ""}`
                        }
                      >
                        SEND AN EVALUATION TO STUDENTS
                      </NavLink>
                    </li>
                    <li className="sidebar-item">
                      <NavLink
                        to={"/evaluation/to/employees"}
                        className={({ isActive }) =>
                          `sidebar-link ${isActive ? "active" : ""}`
                        }
                      >
                        SEND AN EVALUATION TO TEACHERS/EMPLOYEES/
                        <br />
                        STAFFS
                      </NavLink>
                    </li>
                    <li className="sidebar-item">
                      <NavLink
                        to={"/evaluation/results"}
                        className={({ isActive }) =>
                          `sidebar-link ${isActive ? "active" : ""}`
                        }
                      >
                        RESULTS
                      </NavLink>
                    </li>
                    <li className="sidebar-item">
                      <NavLink
                        to={"/evaluation/own/results"}
                        className={({ isActive }) =>
                          `sidebar-link ${isActive ? "active" : ""}`
                        }
                      >
                        OWN RESULTS
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="sidebar-item">
                  <NavLink
                    to={"/evaluation/list"}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                  >
                    EVALUATION
                  </NavLink>
                </li>
                {!parsedUser.is_student && (
                  <li className="sidebar-item">
                    <NavLink
                      to={"/evaluation/own/results"}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      OWN RESULTS
                    </NavLink>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
