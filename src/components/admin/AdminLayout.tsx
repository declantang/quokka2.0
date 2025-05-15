import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Trophy, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Admin Portal</h2>
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
                  )
                }
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/competitions"
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-2 rounded-md hover:bg-gray-100",
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-700",
                  )
                }
              >
                <Trophy className="mr-2 h-5 w-5" />
                Competitions
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-2 rounded-md hover:bg-gray-100",
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-700",
                  )
                }
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </NavLink>
            </li>
          </ul>
          <div className="absolute bottom-4 left-4 right-4">
            <button className="flex items-center w-full p-2 text-gray-700 rounded-md hover:bg-gray-100">
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Competition Management</h1>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
