import React, { useState } from "react";
import { Lock, Mail, LogIn, AlertTriangle, UserPlus } from "lucide-react";

/**
 * A single-file React component simulating a login form using Tailwind CSS.
 * This component handles internal state and mock authentication logic.
 * The Login function is renamed to App as standard for single-file React projects.
 */
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // State to simulate navigation between Login and Sign Up pages
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Function to handle the form submission (mock authentication)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    setIsLoading(true);

    // --- MOCK AUTHENTICATION LOGIC ---
    try {
      // Simulate an API call latency with exponential backoff logic (simplified)
      const maxRetries = 3;
      let delay = 1000;
      let response = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        await new Promise(resolve => setTimeout(resolve, delay));

        // Mock success condition
        const isMockSuccess = email === "test@example.com" && password === "password123";
        
        if (isMockSuccess) {
            response = { success: true };
            break; // Exit loop on success
        } else if (attempt === maxRetries - 1) {
            response = { success: false, msg: "Invalid credentials. Try test@example.com and password123." };
        } else {
            // Exponential backoff
            delay *= 2; 
        }
      }

      const data = response;

      if (data.success) {
        // NOTE: In a real app, replace localStorage with a persistent store like Firestore
        localStorage.setItem("user", JSON.stringify({ id: "u123", email: email }));
        console.log("Login successful! User:", email);
        setError("Login Successful! Welcome!"); 
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

  const handleSignUpClick = () => {
    // Simulate navigation to the sign-up form
    setIsSignUpMode(true);
    setError("");
    setEmail("");
    setPassword("");
  }
  
  const handleBackToLogin = () => {
    // Simulate navigation back to the login form
    setIsSignUpMode(false);
    setError("");
    setEmail("");
    setPassword("");
  }

  // Define shared styling classes
  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 text-base outline-none transition-all";
  const iconBaseClass = "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors";

  return (
    // Outer container ensures full height, centering, and a dark gradient background
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-700 to-purple-800 p-4 font-sans">
      
      {/* Login/Sign Up Card Container */}
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl flex flex-col items-center border border-gray-100">
        
        {/* Header and Icon */}
        {isSignUpMode ? (
            <UserPlus className="w-10 h-10 text-purple-600 mb-4" />
        ) : (
            <LogIn className="w-10 h-10 text-indigo-600 mb-4" />
        )}
        <h2 className="text-center mb-6 text-3xl font-extrabold text-gray-800">
          {isSignUpMode ? "Create Account" : "Welcome Back"}
        </h2>

        {/* Content based on Mode */}
        {isSignUpMode ? (
            // SIGN UP SIMULATION
            <div className="w-full text-center py-8">
                <p className="text-gray-600 text-lg mb-6">
                    This is the simulated Sign Up page content.
                    In a full-stack application, this is where you'd have your registration form.
                </p>
                <button
                    onClick={handleBackToLogin}
                    className="w-full py-3 px-4 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                    Back to Log In
                </button>
            </div>
        ) : (
            // LOGIN FORM
            <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
              
              {/* Email Input */}
              <div className="relative group">
                <Mail className={`${iconBaseClass} group-focus-within:text-indigo-600`} />
                <input
                  type="email"
                  placeholder="Email address"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <Lock className={`${iconBaseClass} group-focus-within:text-indigo-600`} />
                <input
                  type="password"
                  placeholder="Password"
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 px-4 mt-4 text-white font-extrabold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 
                    ${!isLoading 
                        ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/50 transform hover:scale-[1.01]" 
                        : "bg-gray-400 cursor-not-allowed opacity-80"
                    }`}
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
                <p className={`flex items-center gap-2 mt-4 text-sm p-3 rounded-lg border 
                  ${error.includes("Successful") 
                    ? "text-green-700 bg-green-50 border-green-300" 
                    : "text-red-700 bg-red-50 border-red-300"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </p>
              )}

              {/* Sign Up Link/Button */}
              <p className="mt-5 text-sm text-center text-gray-600">
                Don't have an account?
                <button
                  type="button" // Use type="button" to prevent form submission
                  onClick={handleSignUpClick}
                  className="text-indigo-600 font-bold ml-1 hover:text-indigo-800 transition-colors cursor-pointer focus:outline-none"
                >
                  Sign Up
                </button>
              </p>
            </form>
        )}
      </div>
    </div>
  );
}

export default App;