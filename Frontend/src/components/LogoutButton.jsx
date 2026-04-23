import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className="relative w-full px-5 py-2.5 mt-6 
                 bg-gradient-to-br from-red-500/90 to-pink-500/90 
                 text-white font-semibold rounded-xl
                 shadow-[0_0_20px_rgba(255,0,80,0.25)]
                 backdrop-blur-xl border border-red-400/30
                 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                 hover:shadow-[0_0_35px_rgba(255,100,100,0.35)] 
                 hover:scale-[1.03] active:scale-[0.98]
                 flex items-center justify-center gap-2"
    >
      <LogOut size={20} className="relative z-10" />
      <span className="relative z-10">Logout</span>

      {/* Subtle glowing ring effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                      bg-linear-to-r from-red-400/20 to-pink-400/20 
                      blur-md transition-all duration-700"
      ></div>
    </button>
  );
}
