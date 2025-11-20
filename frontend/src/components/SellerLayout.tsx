import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import SellerSidebar from "./SellerSidebar";

type SellerLayoutProps = {
  activeLink: string;
  children: React.ReactNode;
  showHeader?: boolean;
};

export default function SellerLayout({
  activeLink,
  children,
  showHeader = true,
}: SellerLayoutProps) {
  const navigate = useNavigate();
  const logout = useStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isWide, setIsWide] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1800 : false
  );

  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth >= 1800);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(isWide);
  }, [isWide]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <div className="flex min-h-screen min-w-[250px] bg-white text-slate-900">
      {sidebarOpen && !isWide && (
        <div
          className="fixed inset-0 z-30 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <SellerSidebar
        activeLink={activeLink}
        className={`z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClose={() => setSidebarOpen(false)}
        showClose={sidebarOpen && !isWide}
      />
      <main
        className="flex-1 min-w-[250px] px-6 py-8"
        style={{
          marginLeft: sidebarOpen && isWide ? 288 : 0,
          paddingLeft: sidebarOpen && isWide ? 32 : 24,
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {showHeader && (
            <header className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="rounded-full border border-slate-200 bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#0b3ca9]"
                >
                  {sidebarOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/seller")}
                  className="rounded-full px-4 py-2 text-xl font-bold text-white"
                >
                  <span className="text-emerald-200">Quick</span>
                  <span className="text-yellow-300">Shop</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-200 bg-[#0d4bc9] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#0b3ba2]"
              >
                Log out
              </button>
            </header>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
