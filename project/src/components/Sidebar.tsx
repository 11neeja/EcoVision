import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Info, 
  Camera, 
  BarChart3, 
  FileText, 
  User, 
  Shield, 
  Lightbulb,
  X,
  Leaf
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  const menuItems = [
    { name: 'Home', href: '/', icon: Home, color: 'eco' },
    { name: 'About', href: '/about', icon: Info, color: 'purple' },
    { name: 'Eco Tips', href: '/eco-tips', icon: Lightbulb, color: 'coral' },
    ...(isAuthenticated ? [
      { name: 'Classify', href: '/classify', icon: Camera, color: 'teal' },
      { name: 'Dashboard', href: '/dashboard', icon: BarChart3, color: 'lavender' },
      { name: 'Reports', href: '/reports', icon: FileText, color: 'mint' },
      { name: 'Profile', href: '/profile', icon: User, color: 'eco' },
      ...(isAdmin ? [{ name: 'Admin Panel', href: '/admin', icon: Shield, color: 'coral' }] : [])
    ] : [])
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-eco-200/50 dark:border-gray-700/50 z-50 lg:relative lg:translate-x-0"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-eco-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-eco-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">EcoVision</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Save Earth</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive(item.href)
                        ? `bg-gradient-to-r from-${item.color}-100 to-${item.color}-50 text-${item.color}-700 shadow-lg`
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isActive(item.href)
                        ? `bg-${item.color}-500 text-white`
                        : `bg-${item.color}-100 text-${item.color}-600 group-hover:bg-${item.color}-200`
                    }`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-eco-500 rounded-full"
                      />
                    )}
                  </Link>
                ))}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-eco-200/50 dark:border-gray-700/50">
                <div className="bg-gradient-to-r from-eco-50 to-teal-50 dark:from-eco-900/20 dark:to-teal-900/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-eco-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Go Green!</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Every classification counts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;