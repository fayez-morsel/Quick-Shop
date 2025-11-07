import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    () => (document.documentElement.getAttribute("data-theme") ?? "light") === "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
      setDark(saved === "dark");
    }
  }, []);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className={`px-3 py-1.5 rounded-md border text-sm transition-all duration-300
        ${
          dark
            ? "bg-linear-to-r from-(--color-primary) to-indigo-600 text-white border-(--color-primary) hover:opacity-90"
            : "bg-(--bg-card) text-(--text-main) border-(--border-color) hover:bg-(--color-primary)/10"
        }`}
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
