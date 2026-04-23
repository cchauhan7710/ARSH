import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const [msg, setMsg] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const otpValue = otp.join("");

  // OTP input handler
  const handleOtpChange = (value, idx) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) inputRefs.current[idx + 1].focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  };

  // Send OTP
  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.name.length < 3) return setMsg("⚠️ Name must be at least 3 characters.");
    if (!form.email.includes("@")) return setMsg("⚠️ Enter a valid email address.");
    if (form.password.length < 6) return setMsg("⚠️ Password must be at least 6 characters.");

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/signup/request-otp`,
        form
      );
      setMsg(res.data.message || "📩 OTP sent to your email!");
      setStep(2);
      setCooldown(30);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "❌ Failed to send OTP.");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 4000);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpValue.length !== 6) return setMsg("⚠️ Enter full 6-digit OTP.");
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/signup/verify-otp`,
        { email: form.email, otp: otpValue }
      );
      setMsg(res.data.message || "✅ Account verified!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "❌ Incorrect OTP.");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 4000);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/signup/request-otp`,
        form
      );
      setMsg(res.data.message || "📩 OTP resent!");
      setCooldown(30);
    } catch {
      setMsg("❌ Failed to resend OTP.");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 4000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden 
                 bg-gradient-to-b from-[#f9fbff] via-white to-[#f5f9ff]
                 dark:from-gray-950 dark:via-black dark:to-gray-950
                 text-gray-800 dark:text-gray-100 transition-all duration-700"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(66,133,244,0.12),_transparent_70%)] dark:bg-[radial-gradient(circle_at_bottom_left,_rgba(0,100,255,0.2),_transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 blur-[100px]"></div>
      </div>

      {/* Signup Card */}
      <div
        className="relative z-10 w-full max-w-md bg-white/70 dark:bg-white/10 backdrop-blur-2xl 
                   border border-gray-200/50 dark:border-white/10 rounded-3xl p-8 sm:p-10 
                   shadow-[0_0_25px_rgba(0,0,0,0.08)] dark:shadow-[0_0_40px_rgba(255,255,255,0.05)]
                   transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        <h2 className="text-3xl font-extrabold text-center mb-3 
                       bg-gradient-to-r from-blue-700 to-indigo-700 
                       dark:from-blue-300 dark:to-indigo-300 
                       bg-clip-text text-transparent">
          {step === 1 ? "Create an Account ✨" : "Verify Your Email 🔐"}
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-sm">
          {step === 1
            ? "Join SAMADHAN to simplify your workflow."
            : "Enter the OTP sent to your email."}
        </p>

        {msg && (
          <p
            className={`text-center mb-4 text-sm font-medium ${
              msg.includes("✅") || msg.includes("📩")
                ? "text-green-500"
                : msg.includes("⚠️")
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {msg}
          </p>
        )}

        {/* STEP 1 — SIGNUP FORM */}
        {step === 1 && (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/60 dark:bg-black/30 
                         border border-gray-300/70 dark:border-white/20 rounded-xl 
                         focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 
                         text-gray-800 dark:text-gray-100 transition-all duration-300"
            />

            <input
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/60 dark:bg-black/30 
                         border border-gray-300/70 dark:border-white/20 rounded-xl 
                         focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 
                         text-gray-800 dark:text-gray-100 transition-all duration-300"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 bg-white/60 dark:bg-black/30 
                         border border-gray-300/70 dark:border-white/20 rounded-xl 
                         focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 
                         text-gray-800 dark:text-gray-100 transition-all duration-300"
            />

            {/* ROLE DROPDOWN (WITH HEADADMIN) */}
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-3 bg-white/60 dark:bg-black/30 
                         border border-gray-300/70 dark:border-white/20 rounded-xl 
                         focus:ring-2 focus:ring-blue-500 outline-none 
                         text-gray-800 dark:text-gray-100 transition-all duration-300"
            >
              <option value="employee">Employee</option>
              <option value="technician">Technician</option>
              <option value="admin">Admin</option>
              <option value="headadmin">Head Admin</option> {/* ADDED */}
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl font-semibold text-lg
                         bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                         hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(80,160,255,0.3)]
                         active:scale-[0.98] transition-all duration-500"
            >
              {loading ? "Sending OTP..." : "Create Account"}
            </button>
          </form>
        )}

        {/* STEP 2 — OTP VERIFICATION */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  ref={(el) => (inputRefs.current[i] = el)}
                  className="w-12 h-12 text-center text-lg font-semibold bg-white/70 dark:bg-black/30 
                             border border-gray-300/70 dark:border-white/20 rounded-xl 
                             focus:ring-2 focus:ring-blue-500 outline-none 
                             text-gray-800 dark:text-gray-100 transition-all duration-200"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-lg
                         bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                         hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(80,160,255,0.3)]
                         active:scale-[0.98] transition-all duration-500"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={cooldown > 0 || loading}
              className="w-full mt-2 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:text-gray-400"
            >
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
            </button>
          </form>
        )}

        {/* Switch to Login */}
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>  
    </div>
  );
}
