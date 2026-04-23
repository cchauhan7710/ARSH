import { Link } from "react-router-dom";
import { Rocket, PlayCircle } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center 
                 min-h-[90vh] px-6 overflow-hidden 
                 bg-gradient-to-b from-[#f8fbff] via-white to-[#f5f9ff] 
                 dark:from-gray-950 dark:via-black dark:to-gray-950 
                 text-gray-800 dark:text-gray-100 transition-all duration-700"
    >
      {/* 🌈 Gradient Glows */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(66,133,244,0.12),_transparent_70%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(0,100,255,0.2),_transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,105,180,0.12),_transparent_70%)] dark:bg-[radial-gradient(circle_at_bottom_right,_rgba(255,0,150,0.2),_transparent_70%)]"></div>
      </div>

      {/* 💎 Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ===== Heading ===== */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-4 
                     bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 
                     dark:from-white dark:via-gray-100 dark:to-gray-400 
                     text-transparent bg-clip-text transition-all duration-700"
        >
          <span className="block mb-2">SAMADHAN</span>
           <span
    className="block text-xl sm:text-2xl md:text-3xl font-semibold
               bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
               dark:from-blue-400 dark:via-indigo-400 dark:to-pink-400 
               bg-clip-text text-transparent"
  >
    AI-driven ticketing that keeps your workflow smooth and stress-free.
  </span>
        </h1>

        {/* ===== Subtext ===== */}
        <p
          className="text-gray-600 dark:text-gray-400 
                     max-w-2xl mx-auto text-base sm:text-lg md:text-xl 
                     leading-relaxed mt-4 mb-12 transition-colors duration-500"
        >
          AI-powered ticketing, real-time analytics, and intelligent automation — 
          designed to simplify IT operations and empower your support teams.
        </p>

        {/* ===== Buttons ===== */}
        <div className="flex flex-col sm:flex-row justify-center gap-5">

          {/* View Dashboard */}
          <Link
            to="/login"
            className="px-8 py-3.5 text-lg font-semibold rounded-xl 
                       bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                       shadow-md hover:shadow-blue-500/30 hover:scale-[1.03] 
                       hover:brightness-110 active:scale-[0.98] 
                       transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-2"
          >
            <Rocket size={20} /> View Dashboard
          </Link>

          {/* Watch Demo */}
          <button
            className="px-8 py-3.5 text-lg font-semibold rounded-xl border border-gray-300 dark:border-white/20 
                       bg-white/80 dark:bg-white/10 text-gray-800 dark:text-gray-100 
                       hover:bg-white dark:hover:bg-white/20 
                       hover:scale-[1.03] shadow-sm hover:shadow-lg backdrop-blur-md
                       active:scale-[0.98]
                       transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-2"
          >
            <PlayCircle size={22} /> Watch Demo
          </button>

        </div>

        {/* ===== Stats Section ===== */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-10 text-center">
          <Stat number="10K+" label="Tickets Resolved" />
          <Stat number="95%" label="Customer Satisfaction" />
          <Stat number="2.4 hrs" label="Avg Response Time" />
          <Stat number="24/7" label="Support Availability" />
        </div>

      </div>

      {/* ✨ Decorative Bottom Line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-px 
                      bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
    </section>
  );
}

/* ===== Reusable Stat Component ===== */
function Stat({ number, label }) {
  return (
    <div className="group transition-transform duration-500 hover:scale-[1.05]">
      <span
        className="block text-3xl sm:text-4xl font-extrabold 
                   bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                   dark:from-blue-400 dark:via-indigo-400 dark:to-pink-400 
                   bg-clip-text text-transparent mb-1 
                   group-hover:opacity-90 transition-all duration-300"
      >
        {number}
      </span>
      <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
        {label}
      </span>
    </div>
  );
}
