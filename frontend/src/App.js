import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import FaceAnalyzer from "./components/FaceAnalyzer";  // import FaceAnalyzer

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />                 {/* Home page */}
        <Route path="/login" element={<Login />} />          {/* Login page */}
        <Route path="/signup" element={<Signup />} />        {/* Signup page */}
        <Route path="/face-analyzer" element={<FaceAnalyzer />} /> {/* Face analyser page */}
      </Routes>
    </Router>
  );
}

export default App;
