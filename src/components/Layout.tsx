import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Heart, User, History, LogOut, Home, BarChart } from 'lucide-react';

const Layout: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-xl font-bold text-gray-800">BP Monitor</h1>
          </div>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-1">
            {[
              { path: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
              { path: '/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
              { path: '/readings', label: 'History', icon: <History className="h-5 w-5" /> },
              { path: '/stats', label: 'Statistics', icon: <BarChart className="h-5 w-5" /> },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-3 mt-6 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;