import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { toggleTheme } from "../utils/theme.js";

import {
  Menu,
  X,
  Home,
  Sparkles,
  Workflow,
  MessageSquare,
  UserRound,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [user, setUser] = useState({ name: "", role: "", token: "" });

  useEffect(() => {
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (name && role && token) setUser({ name, role, token });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleToggle = () => {
    setDark(!dark);
    toggleTheme();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const navItems = [
    { name: "Home", icon: <Home size={18} />, link: "#home" },
    { name: "Features", icon: <Sparkles size={18} />, link: "#features" },
    { name: "Workflow", icon: <Workflow size={18} />, link: "#workflow" },
    { name: "Contact", icon: <MessageSquare size={18} />, link: "#contact" },
  ];

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50 
        backdrop-blur-2xl bg-white/60 dark:bg-black/40
        border-b border-white/30 dark:border-white/10
        shadow-[0_6px_30px_-5px_rgba(0,0,0,0.15)]
        transition-all duration-700
      "
    >
      <div className="flex items-center justify-between px-6 sm:px-10 py-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <Logo className="w-12 h-12 group-hover:scale-110 transition-all duration-300" />


          <h1
            className="
              text-2xl font-extrabold tracking-tight
              bg-gradient-to-r from-blue-600 to-indigo-600 
              dark:from-blue-300 dark:to-indigo-300 
              bg-clip-text text-transparent
              group-hover:opacity-90 transition-all
            "
          >
            SAMADHAN
          </h1>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-10 font-medium">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="
                relative flex items-center gap-2
                text-gray-700 dark:text-gray-200 
                hover:text-blue-600 dark:hover:text-blue-400
                transition-all group
              "
            >
              {item.icon}
              {item.name}

              {/* underline animation */}
              <span
                className="
                  absolute left-0 -bottom-1 h-[2px] w-0 
                  bg-gradient-to-r from-blue-500 to-indigo-500
                  rounded-full
                  group-hover:w-full 
                  transition-all duration-300
                "
              ></span>
            </a>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-5">

          {/* THEME TOGGLE */}
          <button
            onClick={handleToggle}
            className="
              p-2 rounded-xl backdrop-blur-xl
              border border-white/40 dark:border-white/10
              bg-white/60 dark:bg-white/5
              hover:scale-110 hover:shadow-lg
              transition-all duration-300
            "
          >
            {dark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-400" />}
          </button>

          {/* USER MENU */}
          {user.token ? (
            <div className="flex items-center gap-4">

              <div
                className="
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-blue-100 dark:bg-blue-500/10
                  text-blue-700 dark:text-blue-300 
                  shadow-sm backdrop-blur-xl
                "
              >
                <UserRound size={18} />
                {user.name}
                <span className="text-sm opacity-70">({user.role})</span>
              </div>

              <button
                onClick={handleLogout}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  text-red-500 border border-red-400/50
                  dark:text-red-400 dark:border-red-400/30
                  hover:bg-red-50 dark:hover:bg-red-500/10
                  hover:scale-[1.04]
                  transition-all duration-300
                "
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">

              <Link
                to="/login"
                className="
                  px-4 py-2 rounded-xl
                  border border-blue-500/50 text-blue-600 dark:text-blue-300 
                  hover:bg-blue-50 dark:hover:bg-blue-500/10
                  hover:scale-[1.04]
                  transition-all duration-300
                "
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="
                  px-4 py-2 rounded-xl text-white font-semibold
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  shadow-md hover:scale-[1.05] hover:shadow-blue-500/30
                  transition-all duration-300
                "
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-gray-800 dark:text-gray-200 transition-all"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div
          className="
            md:hidden backdrop-blur-2xl bg-white/70 dark:bg-black/70
            border-t border-white/20 dark:border-white/10
            px-4 py-6 space-y-6 text-center
            animate-fadeIn
          "
        >
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              onClick={() => setOpen(false)}
              className="
                flex items-center justify-center gap-2 text-lg
                text-gray-700 dark:text-gray-200
                hover:text-blue-500 dark:hover:text-blue-400
                transition-all
              "
            >
              {item.icon}
              {item.name}
            </a>
          ))}

          {/* MOBILE USER SECTION */}
          {user.token ? (
            <>
              <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-300 font-semibold">
                <UserRound size={18} />
                {user.name} <span className="text-sm opacity-70">({user.role})</span>
              </div>

              <button
                onClick={handleLogout}
                className="
                  w-10/12 mx-auto px-5 py-2 rounded-xl
                  border border-red-500/50 text-red-600 dark:text-red-400 
                  hover:bg-red-50 dark:hover:bg-red-500/10
                  transition-all
                "
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                onClick={() => setOpen(false)}
                to="/login"
                className="
                  block w-10/12 mx-auto px-5 py-2 rounded-xl
                  border border-blue-500/50 text-blue-600 dark:text-blue-300
                  hover:bg-blue-50 dark:hover:bg-blue-500/10
                  transition-all
                "
              >
                Login
              </Link>

              <Link
                onClick={() => setOpen(false)}
                to="/signup"
                className="
                  block w-10/12 mx-auto px-5 py-2 rounded-xl text-white font-semibold
                  bg-linear-to-r from-blue-600 to-indigo-600
                  shadow-md hover:scale-[1.05]
                  transition-all
                "
              >
                Sign Up
              </Link>
            </>
          )}

          {/* MOBILE THEME TOGGLE */}
          <button
            onClick={handleToggle}
            className="
              flex items-center justify-center w-10/12 mx-auto gap-2
              px-4 py-2 rounded-xl
              border border-white/20 dark:border-white/10
              bg-white/50 dark:bg-white/10 backdrop-blur-xl
              hover:scale-[1.05]
              transition-all duration-300
            "
          >
            {dark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-400" />}
            <span>{dark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      )}
    </header>
  );
}
