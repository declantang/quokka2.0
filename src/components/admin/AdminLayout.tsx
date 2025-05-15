import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white shadow-md transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="p-4 border-b flex justify-between items-center">
          {!collapsed && <h2 className="text-xl font-bold">Admin Portal</h2>}
          <Button variant="ghost" size="sm" onClick={toggleSidebar}>
            {collapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </Button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-2 rounded-md hover:bg-gray-100",
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-700",
                    collapsed && "justify-center",
                  )
                }
                title="Dashboard"
              >
                <LayoutDashboard
                  className={cn("h-5 w-5", collapsed ? "" : "mr-2")}
                />
                {!collapsed && "Dashboard"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/competitions"
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-2 rounded-md hover:bg-gray-100",
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-700",
                    collapsed && "justify-center",
                  )
                }
                title="Competitions"
              >
                <Trophy className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
                {!collapsed && "Competitions"}
                {!collapsed && (
                  <Badge
                    variant="outline"
                    className="ml-auto bg-blue-50 text-blue-600"
                  >
                    New
                  </Badge>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-2 rounded-md hover:bg-gray-100",
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-700",
                    collapsed && "justify-center",
                  )
                }
                title="Settings"
              >
                <Settings className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
                {!collapsed && "Settings"}
              </NavLink>
            </li>
          </ul>
          <div
            className={cn(
              "left-0 right-0 p-4",
              collapsed
                ? "absolute bottom-4"
                : "absolute bottom-4 left-4 right-4",
            )}
          >
            <Separator className="my-4" />
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 w-full",
                collapsed && "justify-center",
              )}
              title="Logout"
            >
              <LogOut className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
              {!collapsed && "Logout"}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              {location.pathname === "/admin" && "Dashboard"}
              {location.pathname.includes("/admin/competitions") &&
                "Competition Management"}
              {location.pathname === "/admin/settings" && "Settings"}
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>

              <div className="relative">
                <Avatar
                  className="cursor-pointer"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">Admin User</p>
                      <p className="text-xs text-gray-500">admin@example.com</p>
                    </div>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
