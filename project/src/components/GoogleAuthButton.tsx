import React from 'react';
import { motion } from 'framer-motion';
import { Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface GoogleAuthButtonProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ mode, onSuccess }) => {
  const { loginWithGoogle, isLoading } = useAuth();

  const handleGoogleAuth = async () => {
    try {
      // Simulate Google OAuth flow
      // In production, this would integrate with Google OAuth 2.0
      const mockGoogleToken = 'mock-google-token';
      await loginWithGoogle(mockGoogleToken);
      onSuccess?.();
    } catch (error) {
      console.error('Google authentication failed:', error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGoogleAuth}
      disabled={isLoading}
      className="w-full flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center">
          <Chrome className="w-4 h-4 text-white" />
        </div>
        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
          {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
        </span>
      </div>
      {isLoading && (
        <div className="ml-3 w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      )}
    </motion.button>
  );
};

export default GoogleAuthButton;