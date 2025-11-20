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
      
    </div>
  );
}
