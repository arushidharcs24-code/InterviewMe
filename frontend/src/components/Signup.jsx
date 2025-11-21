import React, { useState } from "react";
import { User, Lock, Mail, LogIn, CheckCircle, AlertTriangle } from 'lucide-react';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    setIsLoading(true);

    try {
      // NOTE: Using the original endpoint for the hackathon as requested.
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Account created successfully!");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Check your network or server status.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center flex-col bg-gradient-to-br from-indigo-600 to-purple-700 p-4 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center">
        
        <LogIn className="w-10 h-10 text-indigo-600 mb-4" />
        <h2 className="text-center mb-6 text-3xl font-extrabold text-slate-800">
          Create Your Account
        </h2>

        <form onSubmit={handleSignup} className="w-full space-y-4">
          
          <div className="relative">
            <User className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Mail className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit"
            className={`w-full p-3 mt-4 text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/50 hover:scale-[1.01] active:scale-[0.98]'
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
              'Sign Up'
            )}
          </button>

          {error && (
            <p className="flex items-center gap-2 mt-4 text-sm text-red-700 bg-red-100 p-3 rounded-lg border border-red-300">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}
          {success && (
            <p className="flex items-center gap-2 mt-4 text-sm text-green-700 bg-green-100 p-3 rounded-lg border border-green-300">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {success}
            </p>
          )}

          <p className="mt-5 text-sm text-center text-gray-600">
            Already have an account?
            <a
              href="/login" // Original placeholder link
              className="text-indigo-600 font-bold ml-1 hover:text-indigo-800 transition-colors"
            >
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;