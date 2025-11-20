import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { sellerSidebarLinks } from "../pages/seller/sidebarLinks";

type SellerSidebarProps = {
  activeLink: string;
  className?: string;
  onClose?: () => void;
  showClose?: boolean;
};

export default function SellerSidebar({
  activeLink,
  className = "",
  onClose,
  showClose = false,
}: SellerSidebarProps) {
  const navigate = useNavigate();
  const userName = useStore((s) => s.userName);
  const userEmail = useStore((s) => s.userEmail);
  const initials = userName
    ? userName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "JS";

  return (
    <aside
      className={`fixed inset-y-0 left-0 w-72 bg-[#16308a] px-6 py-8 text-white flex flex-col ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Seller Dashboard</div>
        {showClose && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/40 p-2 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="mt-8 flex-1 space-y-2">
        {sellerSidebarLinks.map((link) => {
          const isActive = link.label === activeLink;
          const Icon = link.icon;
          return (
            <button
              key={link.label}
              type="button"
              onClick={() => navigate(link.path)}
              className={`flex w-full items-center gap-3 rounded-full px-3 py-2 text-sm font-semibold transition ${
                isActive ? "bg-white/15" : "hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>
      
    </aside>
  );
}
