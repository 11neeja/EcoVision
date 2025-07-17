import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  userType: 'general' | 'admin';
  achievements: string[];
  classificationsCount: number;
  avatar?: string;
  googleId?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
  quizScore?: number;
  totalClassifications: number;
  certificateEligible: boolean;
  bio?: string;
  location?: string;
  website?: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  signup: (userData: any) => Promise<void>;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  checkUserExists: (email: string) => Promise<boolean>;
  resetUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          if (decoded.exp * 1000 > Date.now()) {
            setUser(decoded.user);
            await updateLastLogin(decoded.user.id);
          } else {
            localStorage.removeItem('token');
            toast.error('Session expired. Please login again.');
          }
        } catch (error) {
          localStorage.removeItem('token');
          console.error('Token validation error:', error);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const updateLastLogin = async (userId: string) => {
    try {
      console.log('Updating last login for user:', userId);
    } catch (error) {
      console.error('Failed to update last login:', error);
    }
  };

  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      return existingUsers.some((u: any) => u.email === email);
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  };

  const resetUserData = () => {
    if (!user) return;
    
    // Clear user-specific data
    localStorage.removeItem(`classifications_${user.id}`);
    localStorage.removeItem(`reports_${user.id}`);
    localStorage.removeItem(`quizScores_${user.id}`);
    localStorage.removeItem(`notifications_${user.id}`);
    
    // Reset user stats
    const updatedUser = {
      ...user,
      totalClassifications: 0,
      classificationsCount: 0,
      achievements: [],
      certificateEligible: false,
      quizScore: 0
    };
    
    setUser(updatedUser);
    
    // Update stored user data
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = existingUsers.map((u: any) => 
      u.id === user.id ? updatedUser : u
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Update token
    const tokenPayload = {
      user: updatedUser,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    };
    
    const newToken = btoa(JSON.stringify(tokenPayload));
    localStorage.setItem('token', `header.${newToken}.signature`);
    
    toast.success('User data has been reset successfully!');
  };

  const signup = async (userData: any) => {
    try {
      setIsLoading(true);
      
      const userExists = await checkUserExists(userData.email);
      if (userExists) {
        throw new Error('User already exists. Please login instead.');
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name.trim(),
        email: userData.email.toLowerCase(),
        role: userData.userType === 'admin' ? 'admin' : 'user',
        userType: userData.userType,
        achievements: [],
        classificationsCount: 0,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        totalClassifications: 0,
        certificateEligible: false,
        bio: '',
        location: '',
        website: ''
      };
      
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      
      const tokenPayload = {
        user: newUser,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
      };
      
      const mockToken = btoa(JSON.stringify(tokenPayload));
      login(`header.${mockToken}.signature`);
      
      toast.success('Account created successfully! Welcome to EcoVision!');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string) => {
    try {
      localStorage.setItem('token', token);
      const decoded: any = jwtDecode(token);
      setUser(decoded.user);
      toast.success(`Welcome back, ${decoded.user.name}!`, {
        icon: '👋',
        duration: 4000,
      });
    } catch (error) {
      toast.error('Invalid authentication token');
      throw error;
    }
  };

  const loginWithGoogle = async (googleToken: string) => {
    try {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const googleUser = {
        id: 'google-user-001',
        name: 'Google User',
        email: 'user@gmail.com',
        role: 'user' as const,
        userType: 'general' as const,
        achievements: [],
        classificationsCount: 0,
        googleId: 'google-123456',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        totalClassifications: 0,
        certificateEligible: false,
        bio: '',
        location: '',
        website: ''
      };
      
      const tokenPayload = {
        user: googleUser,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
      };
      
      const mockToken = btoa(JSON.stringify(tokenPayload));
      login(mockToken);
    } catch (error) {
      toast.error('Google login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const userExists = await checkUserExists(email);
      if (!userExists) {
        throw new Error('No account found with this email address.');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password reset email sent successfully!', {
        icon: '📧',
        duration: 5000,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset email');
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...userData } as User;
      setUser(updatedUser);
      
      // Update stored user data
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedUsers = existingUsers.map((u: any) => 
        u.id === user?.id ? updatedUser : u
      );
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      const tokenPayload = {
        user: updatedUser,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
      };
      
      const newToken = btoa(JSON.stringify(tokenPayload));
      localStorage.setItem('token', `header.${newToken}.signature`);
      
      toast.success('Profile updated successfully!', {
        icon: '✅',
        duration: 3000,
      });
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully', {
      icon: '👋',
      duration: 3000,
    });
  };

  const value = {
    user,
    login,
    logout,
    signup,
    loginWithGoogle,
    resetPassword,
    updateProfile,
    checkUserExists,
    resetUserData,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.userType === 'admin',
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};