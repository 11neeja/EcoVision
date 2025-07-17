import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Trophy, 
  BarChart3, 
  Settings,
  Shield,
  Bell,
  Globe,
  Palette,
  Save,
  Edit3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useClassification } from '../contexts/ClassificationContext';
import { useNotifications } from '../contexts/NotificationContext';

const Profile = () => {
  const { user, isAdmin, updateProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { getClassificationStats } = useClassification();
  const { showSuccess, showError } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || 'Environmental enthusiast passionate about sustainable e-waste management.',
    location: user?.location || 'San Francisco, CA',
    website: user?.website || 'https://ecovision.com',
    notifications: {
      email: true,
      push: true,
      reports: true,
      achievements: true
    }
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || 'Environmental enthusiast passionate about sustainable e-waste management.',
        location: user.location || 'San Francisco, CA',
        website: user.website || 'https://ecovision.com',
        notifications: {
          email: true,
          push: true,
          reports: true,
          achievements: true
        }
      });
    }
  }, [user]);

  const stats = getClassificationStats();

  const achievements = [
    { 
      id: 'newbie', 
      name: 'Eco Newbie', 
      description: 'Classified your first item', 
      icon: '🌱',
      unlocked: stats.total >= 1,
      date: '2024-01-10',
      color: 'eco'
    },
    { 
      id: 'warrior', 
      name: 'Eco Warrior', 
      description: 'Classified 10 items', 
      icon: '⚔️',
      unlocked: stats.total >= 10,
      date: '2024-01-12',
      color: 'purple'
    },
    { 
      id: 'hero', 
      name: 'Eco Hero', 
      description: 'Classified 25+ items', 
      icon: '🦸',
      unlocked: stats.total >= 25,
      progress: Math.min(stats.total, 25),
      total: 25,
      color: 'coral'
    },
    { 
      id: 'guardian', 
      name: 'Earth Guardian', 
      description: 'Detected 50+ hazardous materials', 
      icon: '🛡️',
      unlocked: stats.hazardous >= 50,
      progress: Math.min(stats.hazardous, 50),
      total: 50,
      color: 'teal'
    }
  ];

  const profileStats = [
    { label: 'Items Classified', value: stats.total.toString(), icon: <Camera className="w-5 h-5" />, color: 'eco' },
    { label: 'Hazards Detected', value: stats.hazardous.toString(), icon: <Shield className="w-5 h-5" />, color: 'coral' },
    { label: 'Categories Explored', value: Object.keys(stats.categories).length.toString(), icon: <BarChart3 className="w-5 h-5" />, color: 'purple' },
    { label: 'Achievement Score', value: achievements.filter(a => a.unlocked).length.toString(), icon: <Trophy className="w-5 h-5" />, color: 'teal' },
  ];

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'achievements', name: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        website: formData.website
      });
      setIsEditing(false);
    } catch (error) {
      showError('Failed to update profile');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-eco-500 via-teal-500 to-purple-500 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center">
              <div className="relative mb-6 md:mb-0 md:mr-8">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  {isAdmin ? (
                    <Shield className="w-16 h-16 text-white" />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white text-eco-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{user?.name}</h1>
                <p className="text-white/90 text-lg mb-4">{user?.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                    {isAdmin ? 'Administrator' : 'User'}
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                    Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {profileStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${stat.color}-100 text-${stat.color}-600 mb-4`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-eco-500 text-eco-600 dark:text-eco-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-eco-500 focus:outline-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                      {formData.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                    {formData.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-eco-500 focus:outline-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                      {formData.location}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-eco-500 focus:outline-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                      {formData.website}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-eco-500 focus:outline-none resize-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                      {formData.bio}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-eco-500 to-teal-500 text-white rounded-lg hover:from-eco-600 hover:to-teal-600 transition-all duration-200 flex items-center font-medium shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Achievements</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        achievement.unlocked
                          ? `border-${achievement.color}-200 bg-${achievement.color}-50 dark:bg-${achievement.color}-900/20`
                          : 'border-gray-200 bg-gray-50 dark:bg-gray-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`text-4xl mr-4 ${achievement.unlocked ? '' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg mb-2 ${
                            achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                          }`}>
                            {achievement.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {achievement.description}
                          </p>
                          
                          {achievement.unlocked ? (
                            <div className="flex items-center text-sm text-eco-600 dark:text-eco-400">
                              <Trophy className="w-4 h-4 mr-1" />
                              Unlocked on {new Date(achievement.date!).toLocaleDateString()}
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <span>Progress</span>
                                <span>{achievement.progress}/{achievement.total}</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`bg-${achievement.color}-500 h-2 rounded-full transition-all duration-300`}
                                  style={{ width: `${(achievement.progress! / achievement.total!) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Bell className="w-6 h-6 mr-2" />
                  Notification Preferences
                </h2>
                
                <div className="space-y-4">
                  {Object.entries(formData.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                          {key} Notifications
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive {key} notifications about your account activity
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleNotificationChange(key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eco-300 dark:peer-focus:ring-eco-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eco-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appearance */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Palette className="w-6 h-6 mr-2" />
                  Appearance
                </h2>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-eco-500 focus:ring-offset-2 ${
                      isDark ? 'bg-eco-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={"inline-block w-4 h-4 transform bg-white rounded-full transition-transform " + (isDark ? 'translate-x-6' : 'translate-x-1')}
                    />
                  </button>
                </div>
              </div>

              {/* Security */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Lock className="w-6 h-6 mr-2" />
                  Security
                </h2>
                
                <div className="space-y-4">
                  <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white">Change Password</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Update your account password</p>
                  </button>
                  
                  <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
                  </button>
                  
                  <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white">Login History</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View recent account activity</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;