import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, BarChart3, Camera, Trophy, Star, Target, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useClassification } from '../contexts/ClassificationContext';
import { useNotifications } from '../contexts/NotificationContext';

const Dashboard = () => {
  const { user, resetUserData } = useAuth();
  const { getClassificationStats, resetUserClassifications } = useClassification();
  const { showSuccess } = useNotifications();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  const stats = getClassificationStats();

  // Show welcome message for new users only once
  useEffect(() => {
    if (user && stats.total === 0 && !hasShownWelcome) {
      const timer = setTimeout(() => {
        showSuccess('Welcome! Start classifying e-waste items to see your dashboard data.');
        setHasShownWelcome(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, stats.total, showSuccess, hasShownWelcome]);

  const achievements = [
    { 
      id: 'newbie', 
      name: 'Eco Newbie', 
      description: 'Classify your first item', 
      icon: <Star className="w-6 h-6" />,
      unlocked: stats.total >= 1,
      color: 'eco',
      progress: Math.min(stats.total, 1),
      total: 1
    },
    { 
      id: 'warrior', 
      name: 'Eco Warrior', 
      description: 'Classify 10 items', 
      icon: <Award className="w-6 h-6" />,
      unlocked: stats.total >= 10,
      color: 'purple',
      progress: Math.min(stats.total, 10),
      total: 10
    },
    { 
      id: 'hero', 
      name: 'Eco Hero', 
      description: 'Classify 25+ items', 
      icon: <Trophy className="w-6 h-6" />,
      unlocked: stats.total >= 25,
      color: 'coral',
      progress: Math.min(stats.total, 25),
      total: 25
    }
  ];

  const dashboardStats = [
    { 
      label: 'Items Classified', 
      value: stats.total.toString(), 
      icon: <Camera className="w-6 h-6" />, 
      color: 'eco',
      description: 'Total e-waste items you\'ve classified'
    },
    { 
      label: 'Hazards Detected', 
      value: stats.hazardous.toString(), 
      icon: <Target className="w-6 h-6" />, 
      color: 'coral',
      description: 'Items with hazardous materials identified'
    },
    { 
      label: 'Categories Explored', 
      value: Object.keys(stats.categories).length.toString(), 
      icon: <BarChart3 className="w-6 h-6" />, 
      color: 'purple',
      description: 'Different e-waste categories you\'ve worked with'
    },
    { 
      label: 'Achievement Score', 
      value: achievements.filter(a => a.unlocked).length.toString(), 
      icon: <Trophy className="w-6 h-6" />, 
      color: 'teal',
      description: 'Badges earned through your contributions'
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'eco';
      case 'medium': return 'coral';
      case 'high': return 'red';
      default: return 'gray';
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all your classification data? This action cannot be undone.')) {
      resetUserClassifications();
      resetUserData();
      setHasShownWelcome(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, <span className="bg-gradient-to-r from-eco-600 to-purple-600 bg-clip-text text-transparent">{user?.name}!</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {stats.total === 0 
                  ? 'Start your e-waste classification journey today'
                  : 'Track your environmental impact and achievements'
                }
              </p>
            </div>
            
            {stats.total > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetData}
                className="mt-4 lg:mt-0 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Data</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${stat.color}-100 text-${stat.color}-600 mb-4`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>

        {stats.total === 0 ? (
          /* Empty State for New Users */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 bg-gradient-to-r from-eco-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Camera className="w-16 h-16 text-eco-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Your E-Waste Journey?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Begin classifying electronic waste items to track your environmental impact, 
              earn achievements, and contribute to a sustainable future.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/classify'}
              className="px-8 py-4 bg-gradient-to-r from-eco-500 to-purple-500 text-white rounded-xl font-semibold hover:from-eco-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Classifying Now
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Achievements Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-eco-600" />
                Achievements
              </h2>
              
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      achievement.unlocked
                        ? `border-${achievement.color}-200 bg-${achievement.color}-50 dark:bg-${achievement.color}-900/20`
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        achievement.unlocked
                          ? `bg-${achievement.color}-100 text-${achievement.color}-600`
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                        
                        {!achievement.unlocked && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.total}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`bg-${achievement.color}-500 h-2 rounded-full transition-all duration-300`}
                                style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <div className="ml-auto">
                          <div className="w-8 h-8 bg-eco-500 rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Achievement Progress */}
              {achievements.some(a => !a.unlocked) && (
                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Next Milestone</h4>
                  {(() => {
                    const nextAchievement = achievements.find(a => !a.unlocked);
                    if (nextAchievement) {
                      const remaining = nextAchievement.total - nextAchievement.progress;
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-purple-700 dark:text-purple-300">{nextAchievement.name}</span>
                            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                              {remaining} more needed
                            </span>
                          </div>
                          <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(nextAchievement.progress / nextAchievement.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </motion.div>

            {/* Recent Classifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-purple-600" />
                Recent Classifications
              </h2>
              
              {stats.recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No classifications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentActivity.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{item.itemName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.category}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium bg-${getRiskColor(item.safetyLevel)}-100 text-${getRiskColor(item.safetyLevel)}-800`}>
                          {item.safetyLevel} risk
                        </div>
                      </div>
                      
                      {item.hazardousMaterials.length > 0 && (
                        <div className="mb-2">
                          <div className="flex flex-wrap gap-1">
                            {item.hazardousMaterials.map((hazard, hazardIndex) => (
                              <span key={hazardIndex} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                {hazard}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => window.location.href = '/classify'}
                  className="w-full bg-gradient-to-r from-eco-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-eco-600 hover:to-purple-600 transition-all duration-200"
                >
                  Classify More Items
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;