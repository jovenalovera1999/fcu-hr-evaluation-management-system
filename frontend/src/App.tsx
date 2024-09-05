import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Employees from "./pages/employee/Employees";
import AddEmployee from "./pages/employee/AddEmployee";
import AddStudent from "./pages/student/AddStudent";
import Students from "./pages/student/Students";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/employee/list" element={<Employees />} />
        <Route path="/employee/add" element={<AddEmployee />} />
        <Route path="/student/list" element={<Students />} />
        <Route path="/student/add" element={<AddStudent />} />
      </Routes>
    </Router>
  );
};

export default App;
