import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

interface ContentProps {
  content: React.ReactNode;
}

const Layout = ({ content }: ContentProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <div className="wrapper">
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <div className="main">
          <nav className="navbar navbar-expand px-3 border-bottom sticky-top">
            <button
              className="btn custom-btn"
              type="button"
              onClick={handleSidebar}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
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
