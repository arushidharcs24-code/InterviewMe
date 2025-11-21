import React, { useEffect } from "react";
import { Link } from "react-router-dom";


function Home() {

  useEffect(() => {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });

    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    document.querySelectorAll(".feature-card, .step").forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.6s ease-out";
      observer.observe(el);
    });

  }, []);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
          overflow-x: hidden;
        }
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1.2rem 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }
        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }
        .nav-links a {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: color 0.3s;
        }
        .nav-links a:hover {
          color: #667eea;
        }
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 5% 4rem;
        }
        .hero-content {
          max-width: 1200px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .hero-text h1 {
          font-size: 3.5rem;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        .hero-text p {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .cta-button {
          display: inline-block;
          padding: 1.2rem 3rem;
          background: white;
          color: #667eea;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          transition: all 0.3s;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          margin-right: 1rem;
        }
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        .features {
          background: white;
          padding: 6rem 5%;
        }
        .features-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 3rem;
        }
        .section-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #333;
        }
        .feature-card {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2.5rem;
          border-radius: 15px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .feature-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: white;
        }
        .how-it-works {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 6rem 5%;
          color: white;
        }
        .steps {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
        }
        .step {
          text-align: center;
          padding: 2rem;
        }
        .privacy-banner {
          background: #2d3748;
          color: white;
          padding: 3rem 5%;
          text-align: center;
        }
      `}</style>

      <nav className="navbar">
        <div className="logo">InterViewMe</div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#privacy">Privacy</a></li>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Master Your Interview Confidence</h1>
            <p>Get real-time AI feedback on eye contact, body language, voice tone, and speech patterns.</p>
            
            <Link to="/signup" className="cta-button">Sign Up</Link>
            <Link to="/login" className="cta-button">Sign In</Link>


          </div>
        </div>
      </section>

      <section className="features" id="features">
        <h2 className="section-title">Comprehensive AI Analysis</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👁️</div>
            <h3>Eye Contact Tracking</h3>
            <p>Advanced computer vision measures your gaze patterns.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧍</div>
            <h3>Body Language Analysis</h3>
            <p>Detects posture and micro-expressions.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎤</div>
            <h3>Speech Pattern Recognition</h3>
            <p>Identifies filler words and tone.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Performance Report Card</h3>
            <p>Get detailed, data-driven feedback after each session.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Feedback</h3>
            <p>Receive instant analysis during your practice.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step"><div className="step-number">1</div><h3>Set Up Your Session</h3><p>Choose interview type, allow camera & mic.</p></div>
          <div className="step"><div className="step-number">2</div><h3>Practice Your Interview</h3><p>AI analyzes your performance in real-time.</p></div>
          <div className="step"><div className="step-number">3</div><h3>Review Results</h3><p>Get a full performance report.</p></div>
          <div className="step"><div className="step-number">4</div><h3>Improve & Iterate</h3><p>Practice again & boost your confidence.</p></div>
        </div>
      </section>

      <section className="privacy-banner" id="privacy">
        <h3>🔒 Your Privacy is Our Priority</h3>
        <p>
          All processing happens locally in your browser.  
          Your interview footage never leaves your device.
        </p>
      </section>
    </>
  );
}

export default Home;
