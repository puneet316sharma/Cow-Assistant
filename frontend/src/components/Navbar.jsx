import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, Syringe, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-emerald-900 text-white shadow-md border-b border-emerald-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-white hover:text-emerald-200 transition">
            <span className="text-2xl">🐄</span>
            <span>Cow Assistant</span>
            <span className="text-xs bg-emerald-700 text-emerald-100 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ml-1">
              AI Platform
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/') ? 'bg-emerald-800 text-white shadow-inner' : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            <Link
              to="/register-cow"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/register-cow') ? 'bg-emerald-800 text-white shadow-inner' : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Register Cow
            </Link>

            <Link
              to="/vaccinations"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/vaccinations') ? 'bg-emerald-800 text-white shadow-inner' : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <Syringe className="w-4 h-4" />
              Vaccinations
            </Link>
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm bg-emerald-800/80 px-3 py-1.5 rounded-full border border-emerald-700">
              <UserIcon className="w-4 h-4 text-emerald-300" />
              <span className="font-semibold text-emerald-100">{user?.name}</span>
              <span className="text-xs text-emerald-300 bg-emerald-900/60 px-1.5 py-0.5 rounded uppercase">
                {user?.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-md transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
