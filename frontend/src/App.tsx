import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Employees from "./pages/employee/Employees";
import AddEmployee from "./pages/employee/AddEmployee";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddEmployee />} />
      </Routes>
    </Router>
  );
};

export default App;
