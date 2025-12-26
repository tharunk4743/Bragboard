import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Trophy,
  FileText,
  LogOut,
  User as UserIcon,
  Menu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../data/types";
import Logo from "../components/Logo";

const MainLayout: React.FC = () => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
      ];

  const activeClass =
    "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600";
  const inactiveClass =
    "text-slate-500 hover:bg-slate-50 hover:text-slate-800";

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 w-64 glass border-r z-50 transition-transform duration-300 transform
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link to="/" className="flex items-center space-x-3">
              <Logo className="w-10 h-10" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                BragBoard
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isAdmin ? "Management" : "My Experience"}
            </div>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center px-6 py-3.5 mb-1 transition-all group
                  ${
                    location.pathname === item.path ? activeClass : inactiveClass
                  }
                `}
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

          {/* User Section */}
          <div className="p-4 border-t bg-slate-50/50">
            <div className="flex items-center space-x-3 mb-4 p-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm">
                <UserIcon className="w-6 h-6 text-indigo-600" />
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 glass sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10">
          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 hidden md:block">
            <h1 className="text-lg font-semibold text-slate-800">
              {isAdmin ? "Admin Portal" : "Team Celebrations"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {!isAdmin && (
              <div className="flex items-center px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                <Trophy className="w-4 h-4 text-amber-500 mr-2" />
                <span className="text-xs font-bold text-amber-700">
                  Level 1 Champ
                </span>
              </div>
            )}
            <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
              <Logo className="w-full h-full" />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
