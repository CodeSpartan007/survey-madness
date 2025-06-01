"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <div className="p-4 flex justify-end">
      <button
        onClick={toggleTheme}
        className="px-4 py-2 border rounded-md bg-secondary text-secondary-foreground hover:bg-muted transition"
      >
        {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
    </div>
  );
}
