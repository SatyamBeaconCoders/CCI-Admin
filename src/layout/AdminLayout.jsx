

// 📁 layout/AdminLayout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  LogOut,
  Home,
  ChevronRight,
  Menu,
  X,
  Building2,
  Clock,
  Activity,
  Star,
  Moon,
  Sun
} from "lucide-react";
import { useState, useEffect } from "react";
import SidebarItem from "../components/SidebarItem";
import logo from "../assets/logo-india.png";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [notifications] = useState(0); // Notifications removed as requested




  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Menu items with consistent color scheme
  const menuItems = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      path: "/dashboard",
      color: "primary",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Bookings",
      path: "/bookings",
      color: "orange",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      icon: Home,
      title: "Masters",
      path: "/masters",
      color: "green",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Users,
      title: "Staff",
      path: "/staff",
      color: "purple",
      gradient: "from-purple-500 to-violet-500"
    },
    // {
    //   icon: SettingsIcon,
    //   title: "Settings",
    //   path: "/settings",
    //   color: "gray",
    //   gradient: "from-gray-600 to-gray-700"
    // },
    {
      icon: FileText,
      title: "Reports",
      path: "/reports",
      color: "rose",
      gradient: "from-rose-500 to-pink-500"
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const getPageTitle = () => {
    const item = menuItems.find(item => item.path === location.pathname);
    return item ? item.title : "Dashboard";
  };

  // Current time display
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode
        ? 'dark bg-[#0f172a]'
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50/40'
      }`}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50
        md:relative md:translate-x-0
        w-72 h-screen
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
        ${darkMode
          ? 'bg-gray-900 border-r border-gray-800'
          : 'bg-white border-r border-gray-200'
        }
        shadow-2xl md:shadow-none
      `}>
        {/* Logo Section - Updated with proper logo handling */}
        <div className={`h-24 flex items-center gap-4 px-6 ${darkMode
            ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500'
          }`}>
          <div className="relative">
            {/* Logo - Now with proper styling */}
            <img
              src={logo}
              alt="Constitution Club of India"
              className="h-16 w-16 object-contain"
              style={{
                filter: darkMode ? 'none' : 'brightness(1.1) contrast(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/64/1e40af/ffffff?text=CCI";
              }}
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${darkMode ? 'border-gray-900' : 'border-white'
              }`}>
              <div className="w-full h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
            </div>
          </div>
          <div className="flex flex-col">
            {/* Club Name with Orange, Green, White Gradient */}
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wide text-white drop-shadow-md">
                <span className="bg-gradient-to-r from-amber-400 via-white to-emerald-400 bg-clip-text text-transparent">
                  Constitution Club
                </span>
              </span>
              <span className="text-xs text-white/90 tracking-tight mt-[-2px]">
                <span className="bg-gradient-to-r from-orange-300 via-white to-emerald-300 bg-clip-text text-transparent">
                  of India
                </span>
              </span>
              <p className="text-xs text-emerald-300/90 font-medium mt-1">• Luxury Hospitality •</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute right-4 top-4 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}


        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-1 py-2">
            <p className={`text-[10px] uppercase tracking-widest font-bold mb-4 px-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
              Main Menu
            </p>
            {menuItems.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                title={item.title}
                active={location.pathname === item.path}
                gradient={item.gradient}
                darkMode={darkMode}
                onClick={() => {
                  navigate(item.path);
                  window.innerWidth < 768 && setSidebarOpen(false);
                }}
              />
            ))}
          </div>

          {/* Current Time */}
          <div className={`px-4 py-4 rounded-xl mx-2 ${darkMode
              ? 'bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-700/30'
              : 'bg-gradient-to-r from-blue-50/60 to-cyan-50/60 border border-blue-100'
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Current Time</span>
              </div>
              <span className={`text-lg font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-600'
                }`}>{currentTime}</span>
            </div>
          </div>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-gray-200/30 dark:border-gray-800/30">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2">
              {darkMode ? (
                <Moon className="w-4 h-4 text-blue-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${darkMode ? 'left-7' : 'left-1'
                }`}></div>
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${darkMode
                ? 'text-gray-300 hover:text-white hover:bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 border border-gray-200 hover:border-gray-300'
              }`}
          >
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/60' : 'bg-gray-100'
              }`}>
              <LogOut className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
            </div>
            <span>Sign Out</span>
            <ChevronRight className={`w-4 h-4 ml-auto ${darkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
          </button>

          {/* Footer Text */}
          <div className="mt-4 pt-4 border-t border-gray-200/30 dark:border-gray-800/30 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"></div>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>CCI HMS v2.1 • Premium</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className={`sticky top-0 z-40 ${darkMode
            ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50'
            : 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50'
          }`}>
          <div className="h-16 px-6 flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-xl transition-colors"
              >
                <Menu className={`w-5 h-5 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`} />
              </button>

              {/* Page Title */}
              <div className="flex items-center gap-3">
                <div className={`
                  w-2 h-8 rounded-full bg-gradient-to-b
                  ${location.pathname === '/dashboard' ? 'from-blue-500 to-cyan-500' :
                    location.pathname === '/bookings' ? 'from-orange-500 to-amber-500' :
                      location.pathname === '/masters' ? 'from-emerald-500 to-teal-500' :
                        location.pathname === '/staff' ? 'from-purple-500 to-violet-500' :
                          location.pathname === '/settings' ? 'from-gray-600 to-gray-700' :
                            'from-rose-500 to-pink-500'}
                `}></div>
                <div>
                  <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    {getPageTitle()}
                  </h1>
                  <p className={`text-sm flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    <Building2 className="w-3 h-3" />
                    Constitution Club Hotel Management
                  </p>
                </div>
              </div>
            </div>
            </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-0">

          {/* Scrollable Content Region */}
          <div className="flex-1 overflow-y-auto pt-3 px-4 pb-12 md:pt-4 md:px-8 md:pb-20 lg:px-10 transition-all duration-300">
            <Outlet />
          </div>

          {/* Modern Premium Footer */}
          <footer className={`relative border-t ${
            darkMode 
              ? 'border-gray-800 bg-gray-900/80 backdrop-blur-xl' 
              : 'border-gray-200 bg-white/80 backdrop-blur-xl'
          }`}>

            {/* subtle top gradient line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

            <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">

              {/* LEFT */}
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                  © {new Date().getFullYear()}
                </span>

                <span className={`font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Constitution Club of India
                </span>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">

                {/* status dot */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                    System Live
                  </span>
                </div>

                {/* divider */}
                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>

                {/* credit */}
                <div className="flex items-center gap-1.5 text-xs md:text-sm">
                  <span className={darkMode ? 'text-gray-500' : 'text-gray-400 font-medium'}>
                    Developed and managed by
                  </span>

                  <a
                    href="https://www.beaconcoders.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-extrabold transition-all ${
                      darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    } hover:underline decoration-2 underline-offset-4 tracking-tight`}
                  >
                    Beacon Coders
                  </a>
                </div>

              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}