import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  User as UserIcon,
  LogOut,
  Trophy,
  Settings,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../data/types";
import Logo from "../components/Logo";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const isAdmin = authState.user?.role === UserRole.ADMIN;

  const navItems = isAdmin
    ? [
        { label: "Admin Dashboard", path: "/admin", icon: LayoutDashboard },
        { label: "Employee Directory", path: "/admin/employees", icon: Users },
        { label: "Performance Reports", path: "/admin/reports", icon: FileText },
      ]
    : [
        { label: "Feed", path: "/dashboard", icon: LayoutDashboard },
        { label: "My Profile", path: "/profile", icon: UserIcon },
        { label: "Leaderboard", path: "/leaderboard", icon: Trophy },
        { label: "Marketplace", path: "/marketplace", icon: ShoppingBag },
        { label: "Settings", path: "/settings", icon: Settings },
      ];

  const activeClass =
    "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600";
  const inactiveClass =
    "text-slate-500 hover:bg-slate-50 hover:text-slate-800";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 w-64 glass border-r z-50 transition-transform duration-300 transform
        lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <Link to="/" className="flex items-center space-x-3">
              <Logo className="w-10 h-10" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                BragBoard
              </span>
            </Link>
          </div>

          {!isAdmin && authState.user && (
            <div className="mx-4 mt-6 p-4 bg-slate-900 rounded-3xl text-white shadow-xl">
              <div className="flex items-center gap-3 mb-1">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  BragPoints
                </span>
              </div>
              <p className="text-2xl font-black">
                {authState.user.points}{" "}
                <span className="text-amber-500 text-sm">BP</span>
              </p>
              <Link
                to="/marketplace"
                className="mt-3 block py-2 bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase text-center rounded-xl transition-colors"
              >
                Open Marketplace
              </Link>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto py-6">
            <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isAdmin ? "Management" : "Navigation"}
            </div>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-6 py-3.5 mb-1 transition-all group ${
                  location.pathname === item.path ? activeClass : inactiveClass
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 ${
                    location.pathname === item.path
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t bg-slate-50/50">
            <div className="flex items-center space-x-3 mb-4 p-2">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-indigo-600 font-bold">
                {authState.user?.fullName?.charAt(0) ?? ""}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {authState.user?.fullName}
                </p>
                <p className="text-xs text-slate-500 truncate capitalize">
                  {authState.user?.role ? String(authState.user.role).toLowerCase() : ""}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
