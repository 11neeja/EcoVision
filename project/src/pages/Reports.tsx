import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  Eye,
  Trash2,
  Share,
  BarChart3,
  PieChart,
  TrendingUp,
  Upload,
  Edit3,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReports } from '../contexts/ReportContext';
import { useNotifications } from '../contexts/NotificationContext';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [newReportData, setNewReportData] = useState({
    title: '',
    type: 'classification' as 'classification' | 'summary' | 'analysis',
    content: '',
    tags: '',
    isPublic: false
  });

  const { user, isAdmin } = useAuth();
  const { reports, createReport, updateReport, deleteReport, downloadReport, uploadReport, getUserReports, getAllReports } = useReports();
  const { showSuccess, showError } = useNotifications();

  const userReports = isAdmin ? getAllReports() : getUserReports();

  const filteredReports = userReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'eco';
      case 'processing': return 'coral';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'classification': return <FileText className="w-4 h-4" />;
      case 'analysis': return <BarChart3 className="w-4 h-4" />;
      case 'summary': return <PieChart className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleDownload = async (reportId: string, format: 'pdf' | 'pptx' | 'csv') => {
    try {
      await downloadReport(reportId, format);
    } catch (error) {
      showError('Failed to download report');
    }
  };

  const handleView = (reportId: string) => {
    showSuccess('Opening report preview...');
  };

  const handleShare = (reportId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/reports/${reportId}`);
    showSuccess('Report link copied to clipboard!');
  };

  const handleDelete = (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      deleteReport(reportId);
    }
  };

  const handleEdit = (report: any) => {
    setEditingReport(report);
    setNewReportData({
      title: report.title,
      type: report.type,
      content: JSON.stringify(report.content),
      tags: report.tags.join(', '),
      isPublic: report.isPublic
    });
    setShowCreateModal(true);
  };

  const handleCreateReport = () => {
    if (!newReportData.title.trim()) {
      showError('Please enter a report title');
      return;
    }

    const reportData = {
      title: newReportData.title,
      type: newReportData.type,
      content: { description: newReportData.content },
      size: '1.2 MB',
      status: 'completed' as const,
      isPublic: newReportData.isPublic,
      tags: newReportData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    if (editingReport) {
      updateReport(editingReport.id, reportData);
    } else {
      createReport(reportData);
    }

    setShowCreateModal(false);
    setEditingReport(null);
    setNewReportData({
      title: '',
      type: 'classification',
      content: '',
      tags: '',
      isPublic: false
    });
  };

  const handleFileUpload = async () => {
    if (!uploadFile) {
      showError('Please select a file to upload');
      return;
    }

    if (!newReportData.title.trim()) {
      showError('Please enter a title for the report');
      return;
    }

    try {
      const tags = newReportData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      await uploadReport(uploadFile, newReportData.title, tags);
      setShowUploadModal(false);
      setUploadFile(null);
      setNewReportData({
        title: '',
        type: 'classification',
        content: '',
        tags: '',
        isPublic: false
      });
    } catch (error) {
      showError('Failed to upload report');
    }
  };

  const generateReport = (type: string) => {
    const reportData = {
      title: `${type} Report - ${new Date().toLocaleDateString()}`,
      type: 'summary' as const,
      content: { 
        type,
        generatedAt: new Date().toISOString(),
        summary: `Auto-generated ${type} report containing system analytics and insights.`
      },
      size: '2.4 MB',
      status: 'completed' as const,
      isPublic: false,
      tags: [type.toLowerCase(), 'auto-generated']
    };

    createReport(reportData);
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
                Classification <span className="bg-gradient-to-r from-eco-600 to-purple-600 bg-clip-text text-transparent">Reports</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                View, download, and manage your e-waste classification reports
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0 flex flex-wrap gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-lg hover:from-eco-600 hover:to-eco-700 transition-all duration-200 flex items-center shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Report
              </button>
              
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Report
              </button>
              
              <button
                onClick={() => generateReport('PDF')}
                className="px-4 py-2 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-lg hover:from-coral-600 hover:to-coral-700 transition-all duration-200 flex items-center shadow-lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate PDF
              </button>
              
              <button
                onClick={() => generateReport('Excel')}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 flex items-center shadow-lg"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Export Excel
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-eco-500 focus:outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-eco-500 focus:outline-none appearance-none cursor-pointer min-w-[150px]"
              >
                <option value="all">All Types</option>
                <option value="classification">Classification</option>
                <option value="analysis">Analysis</option>
                <option value="summary">Summary</option>
                <option value="uploaded">Uploaded</option>
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-eco-500 focus:outline-none appearance-none cursor-pointer min-w-[120px]"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="size">Size</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden group"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-${getStatusColor(report.status)}-100 text-${getStatusColor(report.status)}-600`}>
                      {getTypeIcon(report.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {report.title}
                      </h3>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(report.status)}-100 text-${getStatusColor(report.status)}-800 mt-1`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  <span>{report.size}</span>
                </div>

                {/* Tags */}
                {report.tags && report.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {report.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {report.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                        +{report.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleView(report.id)}
                      className="p-2 bg-eco-100 text-eco-600 rounded-lg hover:bg-eco-200 transition-colors"
                      title="View Report"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(report)}
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      title="Edit Report"
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleShare(report.id)}
                      className="p-2 bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-200 transition-colors"
                      title="Share Report"
                    >
                      <Share className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(report.id)}
                      className="p-2 bg-coral-100 text-coral-600 rounded-lg hover:bg-coral-200 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Download Options */}
                {report.status === 'completed' && (
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDownload(report.id, 'pdf')}
                      className="w-full px-4 py-2 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-lg hover:from-coral-600 hover:to-coral-700 transition-all duration-200 flex items-center justify-center text-sm font-medium shadow-lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </motion.button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDownload(report.id, 'pptx')}
                        className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 flex items-center justify-center text-xs font-medium"
                      >
                        <PieChart className="w-3 h-3 mr-1" />
                        PPTX
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDownload(report.id, 'csv')}
                        className="px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 flex items-center justify-center text-xs font-medium"
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        CSV
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {sortedReports.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Reports Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start by creating or uploading your first report.'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-eco-500 to-teal-500 text-white rounded-lg hover:from-eco-600 hover:to-teal-600 transition-all duration-200 font-medium shadow-lg"
                >
                  Create Report
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-3 border border-eco-500 text-eco-600 rounded-lg hover:bg-eco-50 transition-all duration-200 font-medium"
                >
                  Upload Report
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upload Report</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Title
                  </label>
                  <input
                    type="text"
                    value={newReportData.title}
                    onChange={(e) => setNewReportData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-eco-500 focus:outline-none"
                    placeholder="Enter report title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newReportData.tags}
                    onChange={(e) => setNewReportData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-eco-500 focus:outline-none"
                    placeholder="e.g., classification, analysis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.txt"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-eco-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newReportData.isPublic}
                    onChange={(e) => setNewReportData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="w-4 h-4 text-eco-600 bg-gray-100 border-gray-300 rounded focus:ring-eco-500"
                  />
                  <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Make this report public
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  className="flex-1 px-4 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors"
                >
                  Upload
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingReport ? 'Edit Report' : 'Create Report'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Title
                  </label>
                  <input
                    type="text"
                    value={newReportData.title}
                    onChange={(e) => setNewReportData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-eco-500 focus:outline-none"
                    placeholder="Enter report title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Type
                  </label>
                  <select
                    value={newReportData.type}
                    onChange={(e) => setNewReportData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-eco-500 focus:outline-none"
                  >
                    <option value="classification">Classification</option>
                    <option value="analysis">Analysis</option>
                    <option value="summary">Summary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content/Description
                  </label>
                  <textarea
                    value={newReportData.content}
                    onChange={(e) => setNewReportData(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-eco-500 focus:outline-none resize-none"
                    placeholder="Enter report content or description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newReportData.tags}
                    onChange={(e) => setNewReportData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-eco-500 focus:outline-none"
                    placeholder="e.g., classification, analysis"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublicCreate"
                    checked={newReportData.isPublic}
                    onChange={(e) => setNewReportData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="w-4 h-4 text-eco-600 bg-gray-100 border-gray-300 rounded focus:ring-eco-500"
                  />
                  <label htmlFor="isPublicCreate" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Make this report public
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingReport(null);
                    setNewReportData({
                      title: '',
                      type: 'classification',
                      content: '',
                      tags: '',
                      isPublic: false
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReport}
                  className="flex-1 px-4 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors"
                >
                  {editingReport ? 'Update' : 'Create'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;