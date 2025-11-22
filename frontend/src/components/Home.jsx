import React, { useState, useEffect } from "react";
import { User, BookOpen, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const startMockSession = () => {
    alert("Mock session starting soon! This feature is under development.");
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-content-wrapper">
          <div className="navbar-logo-group">
            <div className="logo-icon-box">
              <span className="logo-icon-text"> <img 
    src="logo.jpg"  // path to your logo image
    alt="Logo" 
    style={{ width: "50px", height: "40px" }} 
  />
</span>
            </div>
            <span className="logo-text">InterViewMe</span>
          </div>

          <div className="navbar-links-desktop">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>
            <button className="nav-button-with-icon">
              <BookOpen className="icon-small" />
              <span>Resources</span>
            </button>
            <a href="#privacy" className="nav-link">
              Privacy
            </a>

            <div className="profile-dropdown-container">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="profile-button"
              >
                <div className="profile-icon-box">
                  <User className="icon-small icon-white" />
                </div>
                <ChevronDown
                  className={`icon-x-small profile-chevron ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-user-info">
                    <p className="user-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>

                  <a href="#profile" className="dropdown-item">
                    <User className="icon-x-small dropdown-icon" /> My Profile
                  </a>

                  <a href="#sessions" className="dropdown-item">
                    <BookOpen className="icon-x-small dropdown-icon" /> My Sessions
                  </a>

                  <div className="dropdown-divider">
                    <button onClick={handleLogout} className="dropdown-logout-button">
                      <LogOut className="icon-x-small dropdown-icon" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="content-wrapper">
          <div className="hero-grid">
            <div className="hero-text-content">

              <h1 className="hero-title">
                Master Your Interview with <span className="hero-title-accent">Confidence</span>
              </h1>

              <p className="hero-subtitle">
                Get real-time AI feedback on eye contact, body language, voice tone, and speech
                patterns. Practice smarter, perform better.
              </p>

              <div className="hero-cta-group">
                <button onClick={startMockSession} className="btn-primary btn-large btn-shadow-hover">
                  Start Mock Interview
                </button>
                <button className="btn-secondary btn-large">Watch Demo</button>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      {/* <section className="cta-banner">
        <div className="cta-content">
          <h2 className="cta-title">Ready for your interview prep?</h2>
          <p className="cta-subtitle">Join a mock session now and get instant AI feedback</p>
          <button onClick={startMockSession} className="btn-cta btn-shadow-hover">
            Join Mock Session Now →
          </button>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="main-footer">
        <p className="footer-text">© 2024 InterViewMe. All rights reserved.</p>
      </footer>
    </div>
  );
}
