import { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/login`, form);

      // Save user session
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("email", res.data.user.email);

      setMsg("✅ Login Successful!");

      // ROLE-BASED REDIRECT
      setTimeout(() => {
        const role = res.data.user.role;

        if (role === "headadmin") {
          window.location.href = "/headadmin-dashboard";
        } else if (role === "admin") {
          window.location.href = "/admin-dashboard";
        } else if (role === "technician") {
          window.location.href = "/tech-dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      }, 800);

    } catch {
      setMsg("❌ Invalid credentials, please try again");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden 
                bg-gradient-to-b from-[#f9fbff] via-white to-[#f5f9ff]
                dark:from-gray-950 dark:via-black dark:to-gray-950
                text-gray-800 dark:text-gray-100 transition-all duration-700"
    >
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(66,133,244,0.12),_transparent_70%)] dark:bg-[radial-gradient(circle_at_bottom_left,_rgba(0,100,255,0.2),_transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 blur-[100px]"></div>
      </div>

      {/* Login Card */}
      <div
        className="relative z-10 w-full max-w-md 
                  bg-white/70 dark:bg-white/10 backdrop-blur-2xl 
                  border border-gray-200/50 dark:border-white/10 
                  rounded-3xl p-8 sm:p-10 
                  shadow-[0_0_25px_rgba(0,0,0,0.08)] dark:shadow-[0_0_40px_rgba(255,255,255,0.05)]
                  transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        <h2 className="text-3xl font-extrabold text-center mb-3 
                      bg-gradient-to-r from-blue-700 to-indigo-700 
                      dark:from-blue-300 dark:to-indigo-300 
                      bg-clip-text text-transparent">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-sm">
          Log in to your <span className="font-semibold text-blue-600 dark:text-blue-400">SAMADHAN</span> account
        </p>

        {/* Status Message */}
        {msg && (
          <p
            className={`text-center mb-4 text-sm font-medium ${
              msg.includes("✅")
                ? "text-green-500"
                : msg.includes("❌")
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {msg}
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            required
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-500
                       bg-white/70 dark:bg-black/30 border border-gray-300/70 dark:border-white/20
                       focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500
                       hover:border-blue-400 dark:hover:border-blue-300
                       hover:bg-white/80 dark:hover:bg-white/10
                       shadow-inner transition-all duration-300"
          />

          {/* Password */}
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-500
                       bg-white/70 dark:bg-black/30 border border-gray-300/70 dark:border-white/20
                       focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500
                       hover:border-blue-400 dark:hover:border-blue-300
                       hover:bg-white/80 dark:hover:bg-white/10
                       shadow-inner transition-all duration-300"
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-xl font-semibold text-lg
                      bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                      hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(80,160,255,0.3)]
                      active:scale-[0.98] transition-all duration-500"
          >
            Sign In
          </button>
        </form>

        {/* Bottom */}
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-8">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
