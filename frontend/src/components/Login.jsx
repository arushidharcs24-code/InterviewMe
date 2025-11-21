import React, { useState } from "react";
import { Lock, Mail, LogIn, CheckCircle, AlertTriangle } from "lucide-react";

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
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data)); // save login info
        window.location.href = "/home"; // redirect
      } else {
        setError(data.msg || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Check your backend or network.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-600 to-purple-700 p-4 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center">
        <LogIn className="w-10 h-10 text-indigo-600 mb-4" />
        <h2 className="text-center mb-6 text-3xl font-extrabold text-slate-800">
          Log In
        </h2>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
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
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`w-full p-3 mt-4 text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2
              ${isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/50 hover:scale-[1.01] active:scale-[0.98]"
              }`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Log In"}
          </button>

          {error && (
            <p className="flex items-center gap-2 mt-4 text-sm text-red-700 bg-red-100 p-3 rounded-lg border border-red-300">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </p>
          )}

          <p className="mt-5 text-sm text-center text-gray-600">
            Don't have an account?
            <a
              href="/signup"
              className="text-indigo-600 font-bold ml-1 hover:text-indigo-800 transition-colors"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
