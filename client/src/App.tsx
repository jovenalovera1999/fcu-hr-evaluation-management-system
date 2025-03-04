import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Employees from "./pages/employee/Employees";
import Students from "./pages/student/Students";
import SendAnEvaluationToStudents from "./pages/evaluation/SendAnEvaluationToRegularStudents";
import Evaluations from "./pages/evaluation/Evaluations";
import Login from "./pages/authentication/Login";
import Response from "./pages/evaluation/Response";
import SendAnEvaluationToEmployees from "./pages/evaluation/SendAnEvaluationToEmployees";
import Admin from "./pages/dashboard/Admin";
import SendAnEvaluationToIrregularStudents from "./pages/evaluation/SendAnEvaluationToIrregularStudents";
import Categories from "./pages/category/Categories";
import Results from "./pages/evaluation/Results";
import Questions from "./pages/question/Questions";
import CurrentEvaluations from "./pages/evaluation/CurrentEvaluations";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/dashboard/admin", element: <Admin /> },
  { path: "/employee/list", element: <Employees /> },
  { path: "/student/list", element: <Students /> },
  { path: "/question/list", element: <Questions /> },
  { path: "/evaluation/to/students", element: <SendAnEvaluationToStudents /> },
  {
    path: "/evaluation/to/employees",
    element: <SendAnEvaluationToEmployees />,
  },
  {
    path: "/evaluation/to/irregular/students",
    element: <SendAnEvaluationToIrregularStudents />,
  },
  { path: "/evaluation/list", element: <Evaluations /> },
  { path: "/evaluation/response/:evaluation_id", element: <Response /> },
  { path: "/evaluation/results", element: <Results /> },
  { path: "/evaluation/current", element: <CurrentEvaluations /> },
  { path: "/category/list", element: <Categories /> },
]);

const App = () => <RouterProvider router={router} />;

export default App;
