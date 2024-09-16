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

const App = () => {
  const baseUrl = "http://127.0.0.1:8000/api";

  const csrfToken = document
    .querySelector("meta[name='csrf-token']")
    ?.getAttribute("content");

  // const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
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
          path="/evaluation/list"
          element={<Evaluations baseUrl={baseUrl} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
