import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import Home from "./Home"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />         {/* Home page */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
