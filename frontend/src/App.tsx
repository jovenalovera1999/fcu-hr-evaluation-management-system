import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Employees from "./pages/employee/Employees";
import AddEmployee from "./pages/employee/AddEmployee";
import AddStudent from "./pages/student/AddStudent";
import Students from "./pages/student/Students";
import AddQuestion from "./pages/question/AddQuestion";

const App = () => {
  const baseUrl = "http://127.0.0.1:8000";
  const csrfToken = document
    .querySelector("meta[name='csrf-token']")
    ?.getAttribute("content");

  return (
    <Router>
      <Routes>
        <Route
          path="/employee/list"
          element={<Employees baseUrl={baseUrl} />}
        />
        <Route
          path="/employee/add"
          element={<AddEmployee baseUrl={baseUrl} csrfToken={csrfToken} />}
        />
        <Route path="/student/list" element={<Students />} />
        <Route path="/student/add" element={<AddStudent />} />
        <Route path="/question/add" element={<AddQuestion />} />
      </Routes>
    </Router>
  );
};

export default App;
