import React from "react";
import { Menu, Trophy } from "lucide-react";
import Logo from "../components/Logo";
import NotificationBell from "../components/NotificationBell";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../data/types";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { authState } = useAuth();
  const isAdmin = authState.user?.role === UserRole.ADMIN;

  return (
    <header className="h-16 glass sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10">
      <button
        className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        onClick={onMenuClick}
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex-1 hidden md:block">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
          {isAdmin ? "BragBoard Admin" : "Celebration Hub"}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {!isAdmin && (
          <div className="flex items-center px-4 py-1.5 bg-amber-50 rounded-full border border-amber-200 shadow-sm animate-fade-in">
            <Trophy className="w-4 h-4 text-amber-500 mr-2" />
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
              Recognition Pro
            </span>
          </div>
        )}

        {/* Notifications */}
        <NotificationBell />

        <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden p-1 group cursor-pointer hover:border-indigo-300 transition-all">
          <Logo className="w-full h-full group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
