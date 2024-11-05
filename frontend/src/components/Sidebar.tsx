import { Link } from "react-router-dom";
import InnerCompanyLogo from "../assets/img/inner_company_logo.png";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  return (
    <>
      <aside id="sidebar" className={isCollapsed ? "collapsed" : ""}>
        <div className="h-100">
          <div className="sidebar-logo">
            {/* <img src={CompanyLogo} alt="Company Logo" width={50} /> */}
            <Link to={"#"}>
              {/* FCU HR EVALUATION MANAGEMENT SYSTEM */}
              <img
                src={InnerCompanyLogo}
                alt="Company Logo"
                style={{
                  width: "268px",
                  marginLeft: "-28px",
                  marginTop: "-20px",
                }}
              />
            </Link>
          </div>
          <ul className="sidebar-nav">
            {parsedUser && parsedUser.position === "ADMIN" ? (
              <>
                <li className="sidebar-item">
                  <Link to={"/dashboard/admin"} className="sidebar-link">
                    DASHBOARD
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to={"/employee/list"} className="sidebar-link">
                    EMPLOYEES
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to={"/student/list"} className="sidebar-link">
                    STUDENTS
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to={"/question/list"} className="sidebar-link">
                    QUESTIONS
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to={"/category/list"} className="sidebar-link">
                    CATEGORIES
                  </Link>
                </li>
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
                      <Link to={"/evaluation/list"} className="sidebar-link">
                        LIST
                      </Link>
                    </li>
                    <li className="sidebar-item">
                      <Link
                        to={"/evaluation/to/students"}
                        className="sidebar-link"
                      >
                        SEND AN EVALUATION TO STUDENTS
                      </Link>
                    </li>
                    <li className="sidebar-item">
                      <Link
                        to={"/evaluation/to/employees"}
                        className="sidebar-link"
                      >
                        SEND AN EVALUATION TO TEACHERS/EMPLOYEES/
                        <br />
                        STAFFS
                      </Link>
                    </li>
                    <li className="sidebar-item">
                      <Link to={"#"} className="sidebar-link">
                        RESULTS
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="sidebar-item">
                  <Link to={"/evaluation/list"} className="sidebar-link">
                    EVALUATION
                  </Link>
                </li>
              </>
            )}
            {/* <li className="sidebar-item">
              <Link to={"/logout"} className="sidebar-link">
                LOGOUT
              </Link>
            </li> */}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
