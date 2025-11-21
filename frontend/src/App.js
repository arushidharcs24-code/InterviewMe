import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import FaceAnalyser from "./components/FaceAnalyser";  // import FaceAnalyser

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />                 {/* Home page */}
        <Route path="/login" element={<Login />} />          {/* Login page */}
        <Route path="/signup" element={<Signup />} />        {/* Signup page */}
        <Route path="/face-analyser" element={<FaceAnalyser />} /> {/* Face analyser page */}
      </Routes>
    </Router>
  );
}

export default App;
