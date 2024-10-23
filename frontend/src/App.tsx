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
import SendAnEvaluationToIrregularStudents from "./pages/evaluation/SendAnEvaluationToIrregularStudents";
import EditStudent from "./pages/student/EditStudent";
import DeleteStudent from "./pages/student/DeleteStudent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard/admin" element={<Admin />} />
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/employee/list" element={<Employees />} />
        <Route path="/employee/add" element={<AddEmployee />} />
        <Route path="/student/list" element={<Students />} />
        <Route path="/student/add" element={<AddStudent />} />
        <Route path="/student/edit/:student_id" element={<EditStudent />} />
        <Route path="/student/delete/:student_id" element={<DeleteStudent />} />
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
      </Routes>
    </Router>
  );
};

export default App;
