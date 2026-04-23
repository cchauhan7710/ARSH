export default function Footer() {
  return (
    <footer
      className="relative py-16 overflow-hidden 
                 bg-gradient-to-b from-[#f8fbff] via-white to-[#f5f9ff]
                 dark:from-gray-950 dark:via-black dark:to-gray-950
                 text-gray-700 dark:text-gray-400 
                 transition-all duration-700"
    >
      {/* 🌈 Soft Gradient Glows for Both Themes */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(66,133,244,0.15),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(0,100,255,0.25),_transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,105,180,0.1),_transparent_60%)] dark:bg-[radial-gradient(circle_at_bottom_right,_rgba(255,0,150,0.2),_transparent_60%)]"></div>
      </div>

      {/* 💎 Glass Overlay */}
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-t border-gray-200 dark:border-white/10"></div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Logo / Brand */}
        <h3
          className="text-3xl font-extrabold mb-3 bg-gradient-to-r 
                     from-blue-600 via-indigo-600 to-purple-600 
                     dark:from-blue-400 dark:via-indigo-400 dark:to-pink-400
                     bg-clip-text text-transparent drop-shadow-sm"
        >
          SAMADHAN
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-base mb-2">
          Built for Scale & Efficiency — crafted with 💙 by{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400 hover:text-pink-600 dark:hover:text-pink-400 transition-all">
            Peacemaker Team
          </span>
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          Powering smarter IT management — one ticket at a time 🚀
        </p>

        {/* Navigation Links */}
        <div className="flex justify-center gap-8 text-sm font-medium flex-wrap text-gray-600 dark:text-gray-400 mb-10">
          <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 transition-all">
            Features
          </a>
          <a href="#workflow" className="hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 transition-all">
            Workflow
          </a>
          <a href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 transition-all">
            Contact
          </a>
        </div>

        {/* Divider Line */}
        <div className="w-[80%] mx-auto h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mb-8"></div>

        {/* Copyright */}
        <p className="text-xs text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-blue-600 dark:text-blue-400 font-semibold">SAMADHAN</span>. All rights reserved.
        </p>
      </div>

      {/* ✨ Decorative gradient lines */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>
    </footer>
  );
}
