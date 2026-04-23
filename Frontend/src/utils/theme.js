// src/utils/theme.js

// ⚡ Apply theme before React mounts (prevents flash)
export const applyStoredTheme = () => {
  const saved = localStorage.getItem("theme");
  const root = document.documentElement;

  if (saved === "dark") {
    root.classList.add("dark");
  } else if (saved === "light") {
    root.classList.remove("dark");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.classList.add("dark");
  }
};

// 🌙 Toggle theme manually (used by header button)
export const toggleTheme = () => {
  const root = document.documentElement;
  const isDark = root.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
};
