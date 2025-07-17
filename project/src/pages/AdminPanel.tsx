import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart3, Download, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '1,247', change: '+12%', icon: <Users className="w-6 h-6" />, color: 'eco' },
    { label: 'Classifications Today', value: '89', change: '+23%', icon: <BarChart3 className="w-6 h-6" />, color: 'purple' },
    { label: 'Hazards Detected', value: '156', change: '+8%', icon: <AlertTriangle className="w-6 h-6" />, color: 'coral' },
    { label: 'Reports Generated', value: '432', change: '+15%', icon: <CheckCircle className="w-6 h-6" />, color: 'primary' },
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', classifications: 23, joinDate: '2024-01-10', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', classifications: 45, joinDate: '2024-01-08', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', classifications: 12, joinDate: '2024-01-12', status: 'inactive' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', classifications: 67, joinDate: '2024-01-05', status: 'active' }
  ];

  const systemData = [
    { category: 'Mobile Devices', count: 234, percentage: 35 },
    { category: 'Batteries', count: 189, percentage: 28 },
    { category: 'Computer Parts', count: 145, percentage: 22 },
    { category: 'Cables & Accessories', count: 98, percentage: 15 }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'users', name: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'data', name: 'Data Export', icon: <Download className="w-4 h-4" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const exportData = (format: string) => {
    toast.success(`Data exported as ${format.toUpperCase()}`);
  };

  const deleteUser = (userId: number) => {
    toast.success('User deleted successfully');
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Admin <span className="bg-gradient-to-r from-eco-600 to-purple-600 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-lg text-gray-600">
            Manage users, monitor system performance, and export data
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${stat.color}-100 text-${stat.color}-600 mb-4`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">{stat.label}</div>
                    <div className="text-sm text-eco-600 font-medium">{stat.change}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Classification Categories */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Classification Breakdown</h2>
              <div className="space-y-4">
                {systemData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                        <span className="text-sm text-gray-500">{item.count} items</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-eco-400 to-purple-400 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classifications</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.classifications}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-eco-100 text-eco-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Data Export Tab */}
        {activeTab === 'data' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Export System Data</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Report</h3>
                  <p className="text-gray-600 mb-4">Comprehensive system report with charts and analytics</p>
                  <button
                    onClick={() => exportData('pdf')}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Export PDF
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-eco-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">CSV Data</h3>
                  <p className="text-gray-600 mb-4">Raw data export for further analysis</p>
                  <button
                    onClick={() => exportData('csv')}
                    className="w-full bg-eco-500 text-white py-2 px-4 rounded-lg hover:bg-eco-600 transition-colors"
                  >
                    Export CSV
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">PowerPoint</h3>
                  <p className="text-gray-600 mb-4">Presentation ready slides with key metrics</p>
                  <button
                    onClick={() => exportData('pptx')}
                    className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Export PPTX
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Model Configuration</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CNN Model Accuracy</label>
                      <div className="text-2xl font-bold text-eco-600">94.5%</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SVM Classification Rate</label>
                      <div className="text-2xl font-bold text-purple-600">91.2%</div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Maintenance</h3>
                  <div className="space-y-4">
                    <button className="w-full md:w-auto bg-coral-500 text-white py-2 px-6 rounded-lg hover:bg-coral-600 transition-colors">
                      Clear Cache
                    </button>
                    <button className="w-full md:w-auto bg-purple-500 text-white py-2 px-6 rounded-lg hover:bg-purple-600 transition-colors ml-0 md:ml-4">
                      Update AI Models
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;