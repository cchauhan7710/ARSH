import { Link } from "react-router-dom";
import { Rocket, MessageCircle } from "lucide-react";

export default function CTASection() {
  return (
    <section
      className="relative py-28 overflow-hidden
                 bg-gradient-to-b from-[#f9fbff] via-white to-[#f5f9ff]
                 dark:from-gray-950 dark:via-black dark:to-gray-950
                 text-gray-800 dark:text-gray-100 transition-all duration-700"
    >
      {/* 🌈 Gradient Glows */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(66,133,244,0.12),_transparent_60%)]
                        dark:bg-[radial-gradient(circle_at_top_left,_rgba(0,100,255,0.2),_transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,105,180,0.1),_transparent_60%)]
                        dark:bg-[radial-gradient(circle_at_bottom_right,_rgba(255,0,150,0.2),_transparent_60%)]"></div>
      </div>

      {/* 💎 Glass Overlay */}
      <div className="absolute inset-0 bg-white/40 dark:bg-white/10 backdrop-blur-2xl 
                      border-t border-gray-200/50 dark:border-white/10"></div>

      {/* ===== Content ===== */}
      <div className="relative z-10 text-center px-6">
        <h2
          className="text-4xl sm:text-5xl font-extrabold mb-4 
                     bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-500
                     dark:from-blue-300 dark:via-indigo-300 dark:to-pink-300
                     bg-clip-text text-transparent drop-shadow-sm"
        >
          Ready to Transform Your IT Support?
        </h2>

        <p
          className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed 
                     transition-colors duration-300"
        >
          Join forward-thinking organizations using{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">SAMADHAN</span>{" "}
          for seamless, intelligent IT operations.
        </p>

        {/* ===== CTA Buttons ===== */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">

          {/* Primary Button */}
          <Link
            to="/login"
            className="relative px-8 py-3.5 text-lg font-semibold rounded-xl overflow-hidden
                       bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                       shadow-[0_0_25px_rgba(80,160,255,0.3)]
                       hover:shadow-[0_0_40px_rgba(80,160,255,0.5)]
                       hover:scale-[1.04] active:scale-[0.97]
                       flex items-center gap-2
                       transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          >
            <Rocket size={22} className="relative z-10" />
            <span className="relative z-10">Explore Dashboard</span>

            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 
                            opacity-0 hover:opacity-100 transition-all duration-500"></div>
          </Link>

          {/* Secondary Button — Contact Us */}
          <Link
  to="/contact"
  className="relative px-8 py-3.5 text-lg font-semibold rounded-xl border border-blue-400/40 
             text-blue-700 dark:text-blue-300 overflow-hidden
             bg-white/70 dark:bg-white/5 backdrop-blur-xl
             hover:text-white hover:border-blue-400
             before:absolute before:inset-0 before:bg-gradient-to-r 
             before:from-blue-500/40 before:to-purple-500/40
             before:opacity-0 hover:before:opacity-100
             before:transition-all before:duration-500
             hover:scale-[1.04] active:scale-[0.97]
             hover:shadow-[0_0_30px_rgba(80,160,255,0.3)]
             transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
             flex items-center gap-2"
>
  <MessageCircle size={22} className="relative z-10" />
  <span className="relative z-10">Contact Us</span>
</Link>

        </div>
      </div>

      {/* ✨ Decorative Glow Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px 
                      bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-px 
                      bg-gradient-to-r from-transparent via-pink-500/40 to-transparent"></div>
    </section>
  );
}
