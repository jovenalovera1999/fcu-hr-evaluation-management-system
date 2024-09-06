import { Link } from "react-router-dom";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  return (
    <>
      <aside id="sidebar" className={isCollapsed ? "collapsed" : ""}>
        <div className="h-100">
          <div className="sidebar-logo">
            <Link to={"#"}>FCU HR EVALUATION MANAGEMENT SYSTEM</Link>
          </div>
          <ul className="sidebar-nav">
            <li className="sidebar-item">
              <Link
                to={"#"}
                className="sidebar-link collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#employees"
                aria-expanded="false"
                aria-controls="employees"
              >
                EMPLOYEES
              </Link>
              <ul
                id="employees"
                className="sidebar-dropdown list-unstyled collapse"
                data-bs-parent="#sidebar"
              >
                <li className="sidebar-item">
                  <Link to={"/"} className="sidebar-link">
                    LIST
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to={"/employee/add"} className="sidebar-link">
                    ADD
                  </Link>
                </li>
              </ul>
            </li>
            <li className="sidebar-item">
              <Link
                to={"#"}
                className="sidebar-link collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#students"
                aria-expanded="false"
                aria-controls="students"
              >
                STUDENTS
              </Link>
              <ul
                id="students"
                className="sidebar-dropdown list-unstyled collapse"
                data-bs-parent="#sidebar"
              >
                <li className="sidebar-item">
                  <Link to={"/student/list"} className="sidebar-link">
                    LIST
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to={"/student/add"} className="sidebar-link">
                    ADD
                  </Link>
                </li>
              </ul>
            </li>
            <li className="sidebar-item">
              <Link
                to={"#"}
                className="sidebar-link collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#questions"
                aria-expanded="false"
                aria-controls="questions"
              >
                QUESTIONS
              </Link>
              <ul
                id="questions"
                className="sidebar-dropdown list-unstyled collapse"
                data-bs-parent="#sidebar"
              >
                <li className="sidebar-item">
                  <Link to={"/question/list"} className="sidebar-link">
                    LIST
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to={"/question/add"} className="sidebar-link">
                    ADD
                  </Link>
                </li>
              </ul>
            </li>
            {/* <li className="sidebar-item">
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
                  <Link to={"/question/list"} className="sidebar-link">
                    LIST
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to={"/question/add"} className="sidebar-link">
                    ADD
                  </Link>
                </li>
              </ul>
            </li> */}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
