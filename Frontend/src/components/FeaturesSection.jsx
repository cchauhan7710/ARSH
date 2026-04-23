import { 
  Zap, 
  Bell, 
  BarChart3, 
  ShieldCheck, 
  Hourglass, 
  Users2 
} from "lucide-react";

export default function FeaturesSection() {
  const data = [
    { icon: <Zap size={50} />, title: "AI-Powered Routing", desc: "Automatically categorize and assign tickets with intelligent algorithms." },
    { icon: <Bell size={50} />, title: "Real-time Updates", desc: "Keep teams and clients informed with instant live notifications." },
    { icon: <BarChart3 size={50} />, title: "Analytics Dashboard", desc: "Visualize performance data with dynamic charts and reports." },
    { icon: <ShieldCheck size={50} />, title: "Enterprise Security", desc: "Your data stays safe with end-to-end encryption and secure access." },
    { icon: <Hourglass size={50} />, title: "SLA Management", desc: "Automated response tracking and breach-prevention alerts." },
    { icon: <Users2 size={50} />, title: "Team Collaboration", desc: "Work together effortlessly with shared notes and file attachments." },
  ];

  return (
    <section
      className="relative py-28 overflow-hidden
                 bg-gradient-to-b from-[#f9fbff] via-white to-[#f1f6ff]
                 dark:from-[#0b0e13] dark:via-black dark:to-[#0b0d10]
                 text-gray-800 dark:text-gray-100 transition-all duration-700"
    >
      {/* Background Glows */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(66,133,244,0.18),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(0,110,255,0.22),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,105,180,0.14),transparent_60%)] dark:bg-[radial-gradient(circle_at_bottom_right,rgba(255,0,150,0.22),transparent_60%)]"></div>
      </div>

      {/* Heading */}
      <div className="relative z-10 text-center mb-20 px-4">
        <h2
          className="text-4xl sm:text-5xl font-extrabold mb-4
                     bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-600
                     dark:from-blue-300 dark:via-indigo-300 dark:to-pink-300
                     bg-clip-text text-transparent drop-shadow-xl"
        >
          Everything You Need for{" "}
          <span className="text-blue-600 dark:text-blue-400">Next-Gen IT Support</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Empower your helpdesk with intelligent automation, analytics, and collaboration — 
          all in one sleek platform.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-6">
        {data.map((item, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-3xl transform-gpu
                       border border-white/30 dark:border-white/10
                       bg-white/70 dark:bg-white/5 backdrop-blur-2xl
                       shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.35)]

                       transition-all duration-[600ms] ease-[cubic-bezier(0.18,1,0.25,1)]
                       hover:-translate-y-2 hover:scale-[1.03]
                       hover:shadow-[0_25px_60px_-10px_rgba(75,140,255,0.25)]"
          >
            {/* Glow Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                            bg-gradient-to-br from-blue-400/15 via-indigo-400/15 to-pink-400/15
                            blur-2xl transition-opacity duration-700"></div>

            {/* Top Reflection Line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100
                            bg-gradient-to-r from-blue-400/40 via-indigo-400/50 to-pink-400/40
                            blur-sm transition-all duration-700"></div>

            {/* Content */}
            <div className="relative p-10 flex flex-col justify-between h-full">
              {/* Icon */}
              <div className="mb-6 text-blue-600 dark:text-blue-300 
                              transition-transform duration-700 group-hover:scale-110">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 
                             mb-3 group-hover:text-indigo-500 dark:group-hover:text-blue-200
                             transition-all duration-500">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed
                            group-hover:text-gray-700 dark:group-hover:text-gray-300
                            transition-all duration-500">
                {item.desc}
              </p>

              {/* Underline Animation */}
              <div className="h-[3px] w-0 bg-gradient-to-r from-blue-500 to-indigo-400 
                              mt-6 rounded-full group-hover:w-full 
                              transition-all duration-[900ms]"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px 
                      bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-px 
                      bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
    </section>
  );
}
