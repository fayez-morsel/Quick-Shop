import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const getInitialTheme = () => {
  if (typeof window === "undefined") return false;
  const saved = window.localStorage.getItem("theme");
  if (saved) return saved === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((prev) => !prev)}
      className="hidden rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:inline-flex sm:items-center sm:gap-1.5 md:text-sm"
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4" aria-hidden />
          Light
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" aria-hidden />
          Dark
        </>
      )}
    </button>
  );
}
