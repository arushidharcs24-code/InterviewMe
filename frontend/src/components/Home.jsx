import React, { useState, useEffect } from "react";
import { User, BookOpen, LogOut, ChevronDown } from 'lucide-react';
// Import the separate CSS file for styling
import './Home.css'; 

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // NOTE: Use React Router's useNavigate hook instead of window.location.href in a real app
      window.location.href = '/login'; 
    }
  };

  const startMockSession = () => {
    alert('Mock session starting soon! This feature is under development.');
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-content-wrapper">
          <div className="navbar-logo-group">
            <div className="logo-icon-box">
                <span className="logo-icon-text">IV</span>
            </div>
            <span className="logo-text">InterViewMe</span>
          </div>

          <div className="navbar-links-desktop">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <button className="nav-button-with-icon">
                <BookOpen className="icon-small" />
                <span>Resources</span>
            </button>
            <a href="#privacy" className="nav-link">Privacy</a>

            <div className="profile-dropdown-container">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="profile-button"
                >
                  <div className="profile-icon-box">
                    <User className="icon-small icon-white" />
                  </div>
                  <ChevronDown className={`icon-x-small profile-chevron ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="profile-dropdown-menu">
                    <div className="dropdown-user-info">
                      <p className="user-name">John Doe</p>
                      <p className="user-email">john@example.com</p>
                    </div>
                    <a href="#profile" className="dropdown-item">
                      <User className="icon-x-small dropdown-icon" />
                      My Profile
                    </a>
                    <a href="#sessions" className="dropdown-item">
                      <BookOpen className="icon-x-small dropdown-icon" />
                      My Sessions
                    </a>
                    <div className="dropdown-divider">
                      <button 
                        onClick={handleLogout}
                        className="dropdown-logout-button"
                      >
                        <LogOut className="icon-x-small dropdown-icon" />
                        Logout
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
              <div className="hero-tag">
                <span className="hero-tag-text">🚀 AI-Powered Interview Prep</span>
              </div>
              <h1 className="hero-title">
                Master Your Interview
                <span className="hero-title-accent">Confidence</span>
              </h1>
              <p className="hero-subtitle">
                Get real-time AI feedback on eye contact, body language, voice tone, and speech patterns. Practice smarter, perform better.
              </p>

              <div className="hero-cta-group">
                <button 
                  onClick={startMockSession}
                  className="btn-primary btn-large btn-shadow-hover"
                >
                  Start Mock Interview
                </button>
                <button className="btn-secondary btn-large">
                  Watch Demo
                </button>
              </div>

              <div className="hero-stats-group">
                <div className="stat-item">
                  <p className="stat-value">10K+</p>
                  <p className="stat-label">Practice Sessions</p>
                </div>
                <div className="stat-item">
                  <p className="stat-value">95%</p>
                  <p className="stat-label">Success Rate</p>
                </div>
                <div className="stat-item">
                  <p className="stat-value">4.9★</p>
                  <p className="stat-label">User Rating</p>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-card">
                <div className="video-placeholder">
                  <div className="video-icon-box">
                    <span className="video-icon">🎥</span>
                  </div>
                  <p className="video-text">Live Interview Simulation</p>
                </div>
                
                <div className="metrics-grid">
                  <div className="metric-box metric-green">
                    <p className="metric-value">85%</p>
                    <p className="metric-label">Eye Contact</p>
                  </div>
                  <div className="metric-box metric-blue">
                    <p className="metric-value">92%</p>
                    <p className="metric-label">Confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2 className="cta-title">Ready for your interview prep?</h2>
          <p className="cta-subtitle">Join a mock session now and get instant AI feedback</p>
          <button 
            onClick={startMockSession}
            className="btn-cta btn-shadow-hover"
          >
            Join Mock Session Now →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <p className="footer-text">© 2024 InterViewMe. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;