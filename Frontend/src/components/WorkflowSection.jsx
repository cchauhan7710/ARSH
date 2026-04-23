import { TicketPlus, GitBranch, Lightbulb } from "lucide-react";

export default function WorkflowSection() {
  const steps = [
    {
      num: "01",
      name: "Create Ticket",
      icon: <TicketPlus size={42} className="text-blue-600 dark:text-blue-300" />,
      desc: "Users submit requests through the portal, email, or mobile app in seconds.",
    },
    {
      num: "02",
      name: "Smart Routing",
      icon: <GitBranch size={42} className="text-blue-600 dark:text-blue-300" />,
      desc: "AI instantly assigns each ticket to the right technician based on expertise.",
    },
    {
      num: "03",
      name: "Resolve & Learn",
      icon: <Lightbulb size={42} className="text-blue-600 dark:text-blue-300" />,
      desc: "Monitor, analyze, and continuously improve resolution efficiency.",
    },
  ];

  return (
    <section
      className="relative py-28 overflow-hidden 
                 bg-linear-to-b from-[#f8fbff] via-white to-[#f5f9ff]
                 dark:from-gray-950 dark:via-black dark:to-gray-950
                 text-gray-800 dark:text-gray-100 transition-all duration-700"
    >
      {/* 🌈 Background Glows */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(66,133,244,0.12),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(0,100,255,0.25),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,105,180,0.1),transparent_60%)] dark:bg-[radial-gradient(circle_at_bottom_right,rgba(255,0,150,0.2),transparent_60%)]"></div>
      </div>

      {/* ===== Heading ===== */}
      <div className="relative z-10 text-center mb-20 px-4">
        <h2
          className="text-4xl sm:text-5xl font-extrabold mb-4 
                     bg-linear-to-r from-blue-700 via-indigo-700 to-blue-500 
                     dark:from-blue-300 dark:via-indigo-300 dark:to-pink-300 
                     bg-clip-text text-transparent drop-shadow-sm"
        >
          Simple & Efficient{" "}
          <span className="text-blue-600 dark:text-blue-400">Workflow</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          From ticket creation to resolution — SAMADHAN streamlines every step with automation and insight.
        </p>
      </div>

      {/* ===== Workflow Steps ===== */}
      <div className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-16 px-6 max-w-6xl mx-auto">
        
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-22 left-1/2 -translate-x-1/2 w-[70%] h-[3px]
                        bg-linear-to-r from-blue-400/30 via-blue-500/50 to-pink-400/30 rounded-full blur-[1px]"></div>

        {steps.map((s, i) => (
          <div
            key={s.num}
            className="group relative flex flex-col items-center text-center transform-gpu
                       backdrop-blur-xl bg-white/70 dark:bg-white/10 
                       border border-gray-200/60 dark:border-white/10 
                       rounded-2xl p-8 w-[260px] sm:w-[300px]
                       shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_25px_rgba(255,255,255,0.05)]
                       hover:shadow-[0_25px_45px_-10px_rgba(80,160,255,0.25)]
                       hover:-translate-y-2 hover:scale-[1.03]
                       transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          >
            {/* Glow Layer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                            bg-linear-to-br from-blue-400/10 via-indigo-400/10 to-pink-400/10 
                            blur-2xl transition-all duration-700 ease-out"></div>

            {/* Reflection Line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 
                            bg-linear-to-r from-blue-400/30 via-indigo-400/40 to-pink-400/30 blur-sm transition-all duration-700"></div>

            {/* Icon */}
            <div className="mb-5 transition-all duration-700 group-hover:scale-110">
              {s.icon}
            </div>

            {/* Step Number */}
            <div
              className="relative bg-linear-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-400 
                         text-white h-20 w-20 rounded-full flex items-center justify-center font-extrabold text-2xl 
                         shadow-lg ring-2 ring-blue-400/40 
                         transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] 
                         group-hover:scale-110 group-hover:ring-blue-500/60"
            >
              {s.num}
            </div>

            {/* Step Content */}
            <h3 className="mt-6 text-xl font-bold text-blue-700 dark:text-blue-400 group-hover:text-indigo-500 dark:group-hover:text-blue-300 transition-all duration-500">
              {s.name}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm sm:text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-all duration-500">
              {s.desc}
            </p>

            {/* Mobile Connector */}
            {i < steps.length - 1 && (
              <div className="md:hidden w-0.5 h-12 bg-linear-to-b from-blue-400/30 to-pink-400/30 mt-6 rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-linear-to-r from-transparent via-blue-500/40 to-transparent"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-linear-to-r from-transparent via-pink-500/40 to-transparent"></div>
    </section>
  );
}
