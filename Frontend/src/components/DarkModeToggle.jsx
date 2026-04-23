import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark" ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 
                 hover:bg-gray-100 dark:hover:bg-gray-700 
                 text-gray-700 dark:text-gray-200 transition-all"
    >
      {dark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-600" />}
      <span className="hidden sm:inline text-sm font-medium">
        {dark ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  );
}
