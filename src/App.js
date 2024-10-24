import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Dashboard from "./Components/Dashboard/Dashboard";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
    <div>
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
