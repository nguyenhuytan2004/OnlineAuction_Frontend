import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  BarChart3,
  Package,
  Users,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Boxes,
} from "lucide-react";

import { ROUTES } from "../constants/routes";

import { useAuth } from "../hooks/useAuth";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAuthenticated, role, logout } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const pathRequiresAuth = ["/admin"].some((path) =>
      location.pathname.startsWith(path),
    );

    if (pathRequiresAuth) {
      if (!isAuthenticated) {
        navigate(ROUTES.LOGIN, { replace: true });
        return;
      }
      if (isAuthenticated && role !== "ADMIN") {
        navigate(ROUTES.HOME, { replace: true });
        return;
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthorized(true);
  }, [isAuthenticated, role, location.pathname, navigate]);

  if (isAuthorized === false) {
    return null;
  }

  const navItems = [
    {
      label: "Bảng Điều Khiển",
      icon: BarChart3,
      path: ROUTES.ADMIN_DASHBOARD,
    },
    {
      label: "Quản Lý Danh Mục",
      icon: Package,
      path: ROUTES.ADMIN_CATEGORIES,
    },
    {
      label: "Quản Lý Sản Phẩm",
      icon: Boxes,
      path: ROUTES.ADMIN_PRODUCTS,
    },
    {
      label: "Quản Lý Người Dùng",
      icon: Users,
      path: ROUTES.ADMIN_USERS,
    },
    {
      label: "Duyệt Nâng Cấp",
      icon: ClipboardList,
      path: ROUTES.ADMIN_UPGRADE_REVIEWS,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40 shadow-xl shadow-slate-950/50">
        <div className="max-w-full px-8 h-20 flex items-center justify-between">
          {/* Left Section with Sidebar Toggle */}
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all duration-300"
              title={isSidebarOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 pr-12">
            <button
              onClick={logout}
              className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-72" : "w-24"
          } bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300 overflow-y-auto sticky top-20 h-[calc(100vh-5rem)]`}
        >
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && (
                    <span className="text-sm font-semibold truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
