import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Employees from "./pages/employee/Employees";
import Students from "./pages/student/Students";
import AddQuestion from "./pages/question/AddQuestion";
import Questions from "./pages/question/Questions";
import SendAnEvaluationToStudents from "./pages/evaluation/SendAnEvaluationToStudents";
import Evaluations from "./pages/evaluation/Evaluations";
import Login from "./pages/authentication/Login";
import Response from "./pages/evaluation/Response";
import SendAnEvaluationToEmployees from "./pages/evaluation/SendAnEvaluationToEmployees";
import Admin from "./pages/dashboard/Admin";
import SendAnEvaluationToIrregularStudents from "./pages/evaluation/SendAnEvaluationToIrregularStudents";
import Categories from "./pages/category/Categories";
import Results from "./pages/evaluation/Results";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard/admin" element={<Admin />} />
        <Route path="/" element={<Login />} />

        <Route path="/employee/list" element={<Employees />} />
        <Route path="/student/list" element={<Students />} />

        <Route path="/question/list" element={<Questions />} />
        <Route path="/question/add" element={<AddQuestion />} />

        <Route
          path="/evaluation/to/students"
          element={<SendAnEvaluationToStudents />}
        />
        <Route
          path="/evaluation/to/employees"
          element={<SendAnEvaluationToEmployees />}
        />
        <Route
          path="/evaluation/to/irregular/students"
          element={<SendAnEvaluationToIrregularStudents />}
        />
        <Route path="/evaluation/list" element={<Evaluations />} />
        <Route
          path="/evaluation/response/:evaluation_id"
          element={<Response />}
        />
        <Route path="/evaluation/results" element={<Results />} />

        <Route path="/category/list" element={<Categories />} />
      </Routes>
    </Router>
  );
};

export default App;
