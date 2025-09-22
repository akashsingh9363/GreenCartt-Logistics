import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Truck, BarChart3, Settings, Play, Menu, X, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useData();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/simulation', icon: Play, label: 'Simulation' },
    { path: '/management', icon: Settings, label: 'Management' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };
  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Truck size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">GreenCart</h1>
              <p className="text-sm text-gray-500">Logistics Dashboard</p>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6 p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-green-600" />
              <span className="font-medium text-gray-800">{user?.name}</span>
            </div>
            <p className="text-xs text-gray-600">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
              {user?.role}
            </span>
          </div>

          {/* Navigation Items */}
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Stats Card */}
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 pulse"></div>
              <span className="text-sm font-medium text-gray-700">System Status</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">All systems operational</p>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Uptime</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
          </div>

          {/* Version Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut size={16} />
              Sign Out
            </button>
            <div className="text-xs text-gray-400 text-center">
              GreenCart v2.1.0
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </>
  );
};

export default Navbar;