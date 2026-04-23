import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {

  const [stage,setStage] = useState("email");  // email → otp → reset
  const [email,setEmail] = useState("");
  const [otp,setOtp] = useState("");
  const [newPass,setNewPass] = useState("");
  const [msg,setMsg] = useState("");

  const [timer,setTimer] = useState(60);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  // ================= SEND OTP =================
  const sendOTP = async(e)=>{
    e.preventDefault();
    try{
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/forgot-password`,{ email });
      setMsg("OTP Sent to Email 📩");
      setStage("otp");
      setTimer(60);
    }catch{
      setMsg("Email not found ❌");
    }
  };

  // ================= VERIFY OTP =================
  const verifyOTP = async(e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/verify-forgot-otp`,{ email, otp });
      setMsg("OTP Verified 🎉");
      setStage("reset");
    }catch{
      setMsg("Incorrect OTP ❌");
    }
    setLoading(false);
  };

  // ================= RESEND OTP =================
  const resendOTP = async()=>{
    try{
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/forgot-password`,{ email });
      setMsg("OTP Resent 🔄");
      setTimer(60);
    }catch{
      setMsg("Resend Failed ❌");
    }
  };

  // ================= RESET PASSWORD =================
  const resetPassword = async(e)=>{
    e.preventDefault();
    try{
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/reset-password`,{ email, newPass });
      setMsg("Password Updated Successfully 🎉");
      setTimeout(()=> navigate("/login"),2000);
    }catch{
      setMsg("Reset Failed ❌");
    }
  };

  // Hide messages automatically
  useEffect(()=>{
    if(!msg) return;
    let t=setTimeout(()=> setMsg(""),2000);
    return()=>clearTimeout(t);
  },[msg]);

  // Countdown Timer
  useEffect(()=>{
    if(stage==="otp" && timer>0){
      const t=setTimeout(()=>setTimer(timer-1),1000);
      return()=>clearTimeout(t);
    }
  },[stage,timer]);

  
  return(
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 relative">

    {/* Notification Popup */}
    {msg && <div className="absolute top-5 right-5 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-lg">{msg}</div>}

    <form className="w-full max-w-md bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-xl border">

      {/* TITLE */}
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        {stage==="email" && "Forgot Password"}
        {stage==="otp" && "Verify OTP"}
        {stage==="reset" && "Set New Password"}
      </h2>


      {/* STEP 1 — Enter Email */}
      {stage==="email" && (
        <>
        <div className="mb-6 relative">
          <input type="email" required onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-4 pt-5 pb-2 bg-white/80 border rounded-xl 
            focus:ring-2 focus:ring-blue-500 outline-none peer"/>
          <label className="absolute left-4 top-2 text-sm text-gray-500 peer-focus:text-blue-600 transition-all">
            Registered Email
          </label>
        </div>

        <button onClick={sendOTP}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg">
          Send OTP
        </button>
        </>
      )}


      {/* STEP 2 — Verify OTP */}
      {stage==="otp" && (
        <>
        <div className="mb-6 relative">
          <input maxLength="6" required onChange={(e)=>setOtp(e.target.value)}
          className="w-full px-4 pt-5 pb-2 bg-white/80 border rounded-xl 
          focus:ring-2 focus:ring-blue-500 text-center tracking-widest"/>
          <label className="absolute left-4 top-2 text-sm text-gray-500">Enter OTP</label>
        </div>

        {/* RESEND BUTTON LOCKED UNTIL TIMER ENDS */}
        <button type="button" onClick={resendOTP} disabled={timer>0}
        className={`w-full py-2 mb-3 font-medium ${
          timer>0 ? "text-gray-400" : "text-blue-700 hover:underline"}`}>
          {timer>0 ? `Resend OTP in ${timer}s` : "Resend OTP 🔄"}
        </button>

        <button onClick={verifyOTP}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg">
          {loading?"Verifying...":"Verify OTP"}
        </button>
        </>
      )}


      {/* STEP 3 — Reset Password */}
      {stage==="reset" && (
        <>
        <div className="mb-6 relative">
          <input type="password" required onChange={(e)=>setNewPass(e.target.value)}
            className="w-full px-4 pt-5 pb-2 bg-white/80 border rounded-xl 
            focus:ring-2 focus:ring-blue-500 outline-none peer"/>
          <label className="absolute left-4 top-2 text-sm text-gray-500">New Password</label>
        </div>

        <button onClick={resetPassword}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg">
          Update Password
        </button>
        </>
      )}

      <p className="text-center mt-6 text-gray-600">
        Remembered password? <a href="/login" className="text-blue-600 font-semibold hover:underline">Login</a>
      </p>
    
    </form>

  </div>
  )
}
