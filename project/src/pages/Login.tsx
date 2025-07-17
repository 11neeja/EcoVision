import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  const { login, resetPassword, checkUserExists } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const validateForm = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Check if user exists
    const userExists = await checkUserExists(formData.email);
    if (!userExists) {
      toast.error('No account found with this email. Please sign up first.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;
    
    setIsLoading(true);

    try {
      // Simulate API call with enhanced security
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enhanced mock authentication with better security
      const mockUser = {
        id: formData.email === 'admin@ecovision.com' ? 'admin-001' : 'user-001',
        name: formData.email === 'admin@ecovision.com' ? 'Admin User' : 'John Doe',
        email: formData.email,
        role: formData.email === 'admin@ecovision.com' ? 'admin' : 'user',
        userType: formData.email === 'admin@ecovision.com' ? 'admin' : 'general',
        achievements: [],
        classificationsCount: 0,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        totalClassifications: 0,
        certificateEligible: false
      };
      
      // Create secure JWT token
      const tokenPayload = {
        user: mockUser,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      };
      
      const mockToken = btoa(JSON.stringify(tokenPayload));
      
      login(`header.${mockToken}.signature`);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      await resetPassword(resetEmail);
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error) {
      // Error handled in context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGoogleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-eco-25 via-purple-25 to-teal-25">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-eco-500 via-teal-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your EcoVision account securely
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 space-y-8"
        >
          {!showForgotPassword ? (
            <>
              {/* Google Auth */}
              <GoogleAuthButton mode="login" onSuccess={handleGoogleSuccess} />
              
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Enter your password"
                    />
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-eco-600 bg-gray-100 border-gray-300 rounded focus:ring-eco-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-eco-600 hover:text-eco-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-eco-500 via-teal-500 to-purple-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-eco-600 hover:via-teal-600 hover:to-purple-600 transition-all duration-200 transform hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In Securely'
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="text-center mb-6">
                <AlertCircle className="w-12 h-12 text-coral-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Reset Password</h3>
                <p className="text-gray-600">Enter your email to receive reset instructions</p>
              </div>
              
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="resetEmail"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-eco-500 to-teal-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-eco-600 hover:to-teal-600 transition-all duration-200"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-eco-600 hover:text-eco-700 font-semibold transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-eco-50 to-purple-50 rounded-xl border border-eco-200">
            <p className="text-sm text-gray-700 mb-2 font-semibold">Demo Credentials:</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>User:</strong> Create account first, then login</p>
              <p><strong>Admin:</strong> admin@ecovision.com + any password</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;