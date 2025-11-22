import React, { useState } from "react";
import { Lock, Mail, LogIn, AlertTriangle } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    setIsLoading(true);

    // --- MOCK AUTHENTICATION LOGIC ---
    // In a real application, replace this mock fetch with your actual API call.
    try {
      // Simulate an API call latency
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      const mockUserData = { 
          token: "mock-jwt-token-12345", 
          user: { id: "u123", email: email } 
      };

      // Mock success condition
      const isMockSuccess = email === "test@example.com" && password === "password123";
      
      const data = isMockSuccess ? mockUserData : { msg: "Invalid credentials. Try test@example.com and password123." };

      if (isMockSuccess) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Login successful! User:", data.user);
        setError("Login Successful! Redirecting..."); 
        
      } else {
        setError(data.msg || "Login failed due to an unknown error.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error or server connection issue.");
    } finally {
      setIsLoading(false);
    }
    // --- END MOCK AUTHENTICATION LOGIC ---
  };

  return (
    <>
      {/* All CSS is embedded here as requested, 
        since only a single file can be generated.
      */}
      <style>
        {`
        /* Global Variables for Consistency */
        :root {
            --color-primary: #4f46e5; /* Indigo 600 */
            --color-primary-dark: #4338ca; /* Indigo 700 */
            --color-gradient-end: #9333ea; /* Purple 800 */
            --color-text-header: #1f2937; /* Slate 800 */
            --color-text-body: #4b5563; /* Gray 600 */
            --color-text-muted: #9ca3af; /* Gray 400 */
            --color-success: #065f46; /* Green 700 */
            --color-success-bg: #d1fae5; /* Green 100 */
            --color-error: #991b1b; /* Red 700 */
            --color-error-bg: #fee2e2; /* Red 100 */
        }

        /* Container */
        .login-page-container {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, var(--color-primary-dark), var(--color-gradient-end));
            padding: 1rem;
            font-family: 'Inter', sans-serif;
            margin: 0;
            box-sizing: border-box;
        }

        /* Card */
        .login-card {
            width: 100%;
            max-width: 28rem;
            padding: 2.5rem;
            background-color: #ffffff;
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 1px solid #f3f4f6;
        }

        /* Header */
        .login-icon {
            width: 2.5rem;
            height: 2.5rem;
            color: var(--color-primary);
            margin-bottom: 1rem;
        }

        .login-title {
            text-align: center;
            margin-bottom: 1.5rem;
            font-size: 2rem;
            font-weight: 800;
            color: var(--color-text-header);
        }

        /* Form */
        .login-form {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 1.25rem; 
        }

        /* Input Group */
        .input-wrapper {
            position: relative;
        }

        .input-icon {
            position: absolute;
            top: 50%;
            left: 0.75rem;
            transform: translateY(-50%);
            width: 1.25rem;
            height: 1.25rem;
            color: var(--color-text-muted);
            transition: color 0.15s ease;
        }

        .login-input {
            width: 100%;
            padding: 0.75rem 0.75rem 0.75rem 2.5rem;
            border-radius: 0.5rem;
            border: 1px solid #d1d5db; 
            font-size: 1rem;
            outline: none;
            transition: all 0.25s ease;
        }

        .login-input:focus {
            border-color: var(--color-primary);
            box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5); 
        }

        .input-wrapper:focus-within .input-icon {
            color: var(--color-primary);
        }

        /* Button */
        .login-button {
            width: 100%;
            padding: 0.75rem; 
            margin-top: 1rem;
            color: white;
            font-weight: 700;
            border-radius: 0.5rem;
            transition: all 0.25s ease;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.4);
        }

        .btn-active {
            background-color: var(--color-primary);
        }

        .btn-active:hover:not(:disabled) {
            background-color: var(--color-primary-dark);
            transform: translateY(-1px);
            box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }
        
        .login-button:disabled {
            background-color: #9ca3af; 
            cursor: not-allowed;
            box-shadow: none;
            opacity: 0.7;
        }

        /* Messages */
        .message {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
            font-size: 0.875rem;
            padding: 0.75rem;
            border-radius: 0.5rem;
        }

        .success-message {
            color: var(--color-success);
            background-color: var(--color-success-bg);
            border: 1px solid #a7f3d0; 
        }

        .error-message {
            color: var(--color-error);
            background-color: var(--color-error-bg);
            border: 1px solid #fca5a5; 
        }

        /* Footer Link */
        .signup-text {
            margin-top: 1.25rem;
            font-size: 0.875rem;
            text-align: center;
            color: var(--color-text-body);
        }

        .signup-link {
            color: var(--color-primary);
            font-weight: 700;
            margin-left: 0.25rem;
            text-decoration: none;
            transition: color 0.15s ease-in-out;
        }

        .signup-link:hover {
            color: var(--color-primary-dark);
        }
        `}
      </style>

      {/* Outer container ensures full height and centering */}
      <div className="login-page-container">
        
        {/* Login Card Container */}
        <div className="login-card">
          
          {/* Header and Icon */}
          <LogIn className="login-icon" />
          <h2 className="login-title">
            Welcome Back
          </h2>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            
            {/* Email Input */}
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                placeholder="Email address"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            {/* Password Input */}
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`login-button ${!isLoading ? "btn-active" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Log In"
              )}
            </button>

            {/* Error/Message Display */}
            {error && (
              <p className={`message ${
                error.includes("Successful") 
                  ? "success-message" 
                  : "error-message"
              }`}
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </p>
            )}

            {/* Sign Up Link */}
            <p className="signup-text">
              Don't have an account?
              <a
                href="#signup"
                className="signup-link"
                onClick={(e) => e.preventDefault()}
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;