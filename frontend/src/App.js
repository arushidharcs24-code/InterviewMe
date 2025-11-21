import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import FaceAnalyzer from "./components/FaceAnalyzer";  // import FaceAnalyzer
import SpeechToText from "./components/SpeechToText"; // import SpeechToText
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />                 {/* Home page */}
        <Route path="/login" element={<Login />} />          {/* Login page */}
        <Route path="/signup" element={<Signup />} />        {/* Signup page */}
        <Route path="/face-analyzer" element={<FaceAnalyzer />} /> {/* Face analyser page */}
        <Route path="/speech" element={<SpeechToText />} />        {/* SpeechToText page */}
      </Routes>
    </Router>
  );
}

export default App;
