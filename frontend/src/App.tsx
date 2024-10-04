import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Employees from "./pages/employee/Employees";
import AddEmployee from "./pages/employee/AddEmployee";
import AddStudent from "./pages/student/AddStudent";
import Students from "./pages/student/Students";
import AddQuestion from "./pages/question/AddQuestion";
import Questions from "./pages/question/Questions";
import SendAnEvaluationToStudents from "./pages/evaluation/SendAnEvaluationToStudents";
import Evaluations from "./pages/evaluation/Evaluations";
import Login from "./pages/authentication/Login";
import Logout from "./pages/authentication/Logout";
import Response from "./pages/evaluation/Response";
import SendAnEvaluationToEmployees from "./pages/evaluation/SendAnEvaluationToEmployees";
import Admin from "./pages/dashboard/Admin";

const App = () => {
  const baseUrl = "http://127.0.0.1:8000/api";

  const csrfToken = document
    .querySelector("meta[name='csrf-token']")
    ?.getAttribute("content");

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard/admin"
          element={<Admin baseUrl={baseUrl} csrfToken={csrfToken} />}
        />
        <Route
          path="/"
          element={<Login baseUrl={baseUrl} csrfToken={csrfToken} />}
        />
        <Route
          path="/logout"
          element={<Logout baseUrl={baseUrl} csrfToken={csrfToken} />}
        />
        <Route
          path="/employee/list"
          element={<Employees baseUrl={baseUrl} />}
        />
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
          path="/question/list"
          element={<Questions baseUrl={baseUrl} />}
        />
        <Route
          path="/question/add"
          element={<AddQuestion baseUrl={baseUrl} csrfToken={csrfToken} />}
        />
        <Route
          path="/evaluation/to/students"
          element={
            <SendAnEvaluationToStudents
              baseUrl={baseUrl}
              csrfToken={csrfToken}
            />
          }
        />
        <Route
          path="/evaluation/to/employees"
          element={
            <SendAnEvaluationToEmployees
              baseUrl={baseUrl}
              csrfToken={csrfToken}
            />
          }
        />
        <Route
          path="/evaluation/list"
          element={<Evaluations baseUrl={baseUrl} />}
        />
        <Route
          path="/evaluation/response/:evaluation_id"
          element={<Response baseUrl={baseUrl} csrfToken={csrfToken} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
