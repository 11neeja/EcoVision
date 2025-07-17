import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Menu, 
  X, 
  User, 
  Shield, 
  Sun, 
  Moon,
  Bell,
  Search,
  Camera,
  BarChart3,
  FileText,
  Lightbulb,
  Brain,
  Award,
  MapPin,
  Mic
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, clearNotifications } = useNotifications();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Public navigation links (only shown when NOT authenticated)
  const publicNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' }
  ];

  // Main navbar features for authenticated users
  const mainNavFeatures = [
    { name: 'Classify', href: '/classify', icon: <Camera className="w-4 h-4" /> },
    { name: 'Dashboard', href: '/dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Eco Tips', href: '/eco-tips', icon: <Lightbulb className="w-4 h-4" /> }
  ];

  // Hamburger menu features for authenticated users
  const hamburgerFeatures = [
    { name: 'Reports', href: '/reports', icon: <FileText className="w-4 h-4" /> },
    { name: 'Quiz', href: '/quiz', icon: <Brain className="w-4 h-4" /> },
    { name: 'Voice Assistant', href: '/voice', icon: <Mic className="w-4 h-4" /> },
    { name: 'Location Finder', href: '/locations', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Certificates', href: '/certificates', icon: <Award className="w-4 h-4" /> },
    ...(isAdmin ? [{ name: 'Admin Panel', href: '/admin', icon: <Shield className="w-4 h-4" /> }] : [])
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-eco-200/50 dark:border-gray-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-r from-eco-500 via-teal-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Leaf className="w-6 h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-eco-600 via-teal-600 to-purple-600 bg-clip-text text-transparent">
                  EcoVision
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Save Earth</p>
              </div>
            </Link>
          </div>

          {/* Center - Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Show Home & About for non-authenticated users */}
            {!isAuthenticated && publicNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-eco-600 dark:text-eco-400 bg-eco-50 dark:bg-eco-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-eco-600 dark:hover:text-eco-400 hover:bg-eco-50 dark:hover:bg-eco-900/20'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Show main features for authenticated users */}
            {isAuthenticated && mainNavFeatures.map((feature) => (
              <Link
                key={feature.name}
                to={feature.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive(feature.href)
                    ? 'text-eco-600 dark:text-eco-400 bg-eco-50 dark:bg-eco-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-eco-600 dark:hover:text-eco-400 hover:bg-eco-50 dark:hover:bg-eco-900/20'
                }`}
              >
                {feature.icon}
                <span>{feature.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>

            {/* Notifications - Only for authenticated users */}
            {isAuthenticated && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleNotifications}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 max-h-96 overflow-y-auto"
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        {notifications.length > 0 && (
                          <button
                            onClick={clearNotifications}
                            className="text-xs text-eco-600 hover:text-eco-700"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification.id)}
                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-l-4 ${
                              notification.read 
                                ? 'border-gray-200 dark:border-gray-600' 
                                : 'border-eco-500 bg-eco-50 dark:bg-eco-900/20'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  {notification.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-eco-500 rounded-full ml-2 mt-1"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* User menu or Auth buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-eco-500 to-purple-500 rounded-full flex items-center justify-center">
                    {isAdmin ? <Shield className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name}
                  </span>
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-900/20"
                      >
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-eco-600 dark:hover:text-eco-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-eco-500 to-teal-500 text-white text-sm font-medium rounded-lg hover:from-eco-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Hamburger menu button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-eco-200/50 dark:border-gray-700/50"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Show features for authenticated users */}
              {isAuthenticated ? (
                <>
                  {/* Mobile view of main features */}
                  <div className="lg:hidden mb-4">
                    <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Main Features
                    </h3>
                    {mainNavFeatures.map((feature) => (
                      <Link
                        key={feature.name}
                        to={feature.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(feature.href)
                            ? 'text-eco-600 dark:text-eco-400 bg-eco-50 dark:bg-eco-900/20'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-eco-50 dark:hover:bg-eco-900/20 hover:text-eco-600 dark:hover:text-eco-400'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {feature.icon}
                        <span>{feature.name}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Additional features */}
                  <div className="mb-2">
                    <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      More Features
                    </h3>
                  </div>
                  {hamburgerFeatures.map((feature) => (
                    <Link
                      key={feature.name}
                      to={feature.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(feature.href)
                          ? 'text-eco-600 dark:text-eco-400 bg-eco-50 dark:bg-eco-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-eco-50 dark:hover:bg-eco-900/20 hover:text-eco-600 dark:hover:text-eco-400'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {feature.icon}
                      <span>{feature.name}</span>
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {/* Show Home & About for non-authenticated users on mobile */}
                  <div className="md:hidden mb-4">
                    <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Navigation
                    </h3>
                    {publicNavLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(link.href)
                            ? 'text-eco-600 dark:text-eco-400 bg-eco-50 dark:bg-eco-900/20'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-eco-50 dark:hover:bg-eco-900/20 hover:text-eco-600 dark:hover:text-eco-400'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{link.name}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Auth options for non-authenticated users */}
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Sign in to access all features
                    </p>
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        className="block w-full px-4 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block w-full px-4 py-2 border border-eco-500 text-eco-600 rounded-lg hover:bg-eco-50 transition-colors text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-eco-200/50 dark:border-gray-700/50 p-4"
          >
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search classifications, tips, reports..."
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-eco-500 focus:outline-none"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;