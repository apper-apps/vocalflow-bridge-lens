import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

const navItems = [
    { to: "/", icon: "Home", label: "Dashboard" },
    { to: "/practice", icon: "Calendar", label: "Practice" },
    { to: "/exercises", icon: "Dumbbell", label: "Exercises" },
    { to: "/community", icon: "Users", label: "Community" },
    { to: "/messages", icon: "MessageCircle", label: "Messages" },
    { to: "/events", icon: "Calendar", label: "Events" }
  ];
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 glass-card border-r border-gray-700 z-50 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 p-6 border-b border-gray-700">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <ApperIcon name="Mic" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold gradient-text">VocalFlow</h1>
              <p className="text-xs text-gray-400">Master Your Voice</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive(item.to)
                    ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-white shadow-glow"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <ApperIcon
                  name={item.icon}
                  size={20}
                  className={cn(
                    "transition-colors duration-200",
                    isActive(item.to) ? "text-primary" : "text-gray-400 group-hover:text-white"
                  )}
                />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-surface/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <ApperIcon name="User" size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Sarah Chen</p>
                <p className="text-xs text-gray-400">Soprano • Level 3</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;