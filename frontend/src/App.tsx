import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Employees from "./pages/employee/Employees";
import AddEmployee from "./pages/employee/AddEmployee";
import AddStudent from "./pages/student/AddStudent";
import Students from "./pages/student/Students";
import AddQuestion from "./pages/question/AddQuestion";

const App = () => {
  const baseUrl = "http://127.0.0.1:8000/api";
  const csrfToken = document
    .querySelector("meta[name='csrf-token']")
    ?.getAttribute("content");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Employees baseUrl={baseUrl} />} />
        <Route
          path="/employee/add"
          element={<AddEmployee baseUrl={baseUrl} csrfToken={csrfToken} />}
        />
        <Route path="/student/list" element={<Students baseUrl={baseUrl} />} />
        <Route
          path="/student/add"
          element={<AddStudent baseUrl={baseUrl} csrfToken={csrfToken} />}
        />
        <Route
          path="/question/add"
          element={<AddQuestion baseUrl={baseUrl} csrfToken={csrfToken} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
