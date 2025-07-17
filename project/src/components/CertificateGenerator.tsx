import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Mail, Calendar, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useClassification } from '../contexts/ClassificationContext';
import { useNotifications } from '../contexts/NotificationContext';
import jsPDF from 'jspdf';

const CertificateGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { user } = useAuth();
  const { getClassificationStats } = useClassification();
  const { showSuccess, showError, showInfo } = useNotifications();

  const stats = getClassificationStats();
  const isEligible = stats.total >= 10;

  const generateCertificate = async (sendEmail = false) => {
    if (!user || !isEligible) {
      showError('You need to classify at least 10 items to generate a certificate');
      return;
    }

    setIsGenerating(true);
    showInfo('Generating your certificate...');

    try {
      // Simulate certificate generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Certificate background
      pdf.setFillColor(248, 250, 252);
      pdf.rect(0, 0, 297, 210, 'F');

      // Border
      pdf.setDrawColor(34, 197, 94);
      pdf.setLineWidth(2);
      pdf.rect(10, 10, 277, 190);

      // Inner border
      pdf.setLineWidth(0.5);
      pdf.rect(15, 15, 267, 180);

      // Title
      pdf.setFontSize(32);
      pdf.setTextColor(34, 197, 94);
      pdf.text('CERTIFICATE OF ACHIEVEMENT', 148.5, 50, { align: 'center' });

      // Subtitle
      pdf.setFontSize(16);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Environmental Stewardship in E-Waste Management', 148.5, 65, { align: 'center' });

      // Recipient
      pdf.setFontSize(14);
      pdf.setTextColor(51, 65, 85);
      pdf.text('This certificate is proudly presented to', 148.5, 85, { align: 'center' });

      pdf.setFontSize(28);
      pdf.setTextColor(34, 197, 94);
      pdf.text(user.name, 148.5, 105, { align: 'center' });

      // Achievement text
      pdf.setFontSize(14);
      pdf.setTextColor(51, 65, 85);
      const achievementText = `For successfully classifying ${stats.total} electronic waste items and contributing to environmental protection through responsible e-waste management practices.`;
      const lines = pdf.splitTextToSize(achievementText, 200);
      pdf.text(lines, 148.5, 125, { align: 'center' });

      // Badge level
      let badgeLevel = 'Eco Contributor';
      if (stats.total >= 50) badgeLevel = 'Eco Champion';
      else if (stats.total >= 25) badgeLevel = 'Eco Hero';
      else if (stats.total >= 10) badgeLevel = 'Eco Warrior';

      pdf.setFontSize(18);
      pdf.setTextColor(168, 85, 247);
      pdf.text(`Badge Earned: ${badgeLevel}`, 148.5, 150, { align: 'center' });

      // Date and signature area
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      const currentDate = new Date().toLocaleDateString();
      pdf.text(`Date: ${currentDate}`, 50, 175);
      pdf.text('EcoVision Platform', 220, 175);
      pdf.text('Certified by EcoVision AI', 220, 185);

      // Stats
      pdf.setFontSize(10);
      pdf.text(`Total Classifications: ${stats.total}`, 50, 185);
      pdf.text(`Hazardous Items Detected: ${stats.hazardous}`, 50, 190);

      // Save the PDF
      const fileName = `EcoVision_Certificate_${user.name.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);

      if (sendEmail) {
        // Simulate email sending
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEmailSent(true);
        showSuccess('Certificate generated and sent to your email!');
      } else {
        showSuccess('Certificate downloaded successfully!');
      }

    } catch (error) {
      showError('Failed to generate certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isEligible) {
    const remaining = 10 - stats.total;
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Certificate Not Available</h3>
        <p className="text-gray-600 mb-6">
          You need to classify at least 10 items to earn your certificate.
          You have classified {stats.total} items so far.
        </p>
        <div className="bg-eco-50 rounded-xl p-4 mb-6">
          <div className="text-2xl font-bold text-eco-600 mb-2">{remaining}</div>
          <div className="text-sm text-eco-700">more classifications needed</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-eco-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(stats.total / 10) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          Keep classifying to unlock your achievement certificate!
        </p>
      </div>
    );
  }

  let badgeLevel = 'Eco Contributor';
  let badgeColor = 'eco';
  if (stats.total >= 50) {
    badgeLevel = 'Eco Champion';
    badgeColor = 'purple';
  } else if (stats.total >= 25) {
    badgeLevel = 'Eco Hero';
    badgeColor = 'coral';
  } else if (stats.total >= 10) {
    badgeLevel = 'Eco Warrior';
    badgeColor = 'teal';
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className={`w-20 h-20 bg-gradient-to-r from-${badgeColor}-100 to-${badgeColor}-200 rounded-full flex items-center justify-center mx-auto mb-6`}>
          <Award className={`w-10 h-10 text-${badgeColor}-600`} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Certificate Available!</h3>
        <p className="text-gray-600 mb-4">
          Congratulations! You've earned your environmental stewardship certificate.
        </p>
        <div className={`inline-flex items-center px-4 py-2 bg-${badgeColor}-100 text-${badgeColor}-800 rounded-full font-semibold`}>
          <Award className="w-4 h-4 mr-2" />
          {badgeLevel}
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="bg-gradient-to-br from-eco-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-dashed border-eco-200">
        <div className="text-center">
          <h4 className="text-lg font-bold text-gray-900 mb-2">CERTIFICATE OF ACHIEVEMENT</h4>
          <p className="text-sm text-gray-600 mb-4">Environmental Stewardship in E-Waste Management</p>
          
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-center mb-2">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <span className="font-semibold text-gray-900">{user?.name}</span>
            </div>
            <p className="text-sm text-gray-600">
              For successfully classifying {stats.total} electronic waste items
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-eco-600">{stats.total}</div>
              <div className="text-xs text-gray-500">Items Classified</div>
            </div>
            <div>
              <div className="text-lg font-bold text-coral-600">{stats.hazardous}</div>
              <div className="text-xs text-gray-500">Hazards Detected</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">{Object.keys(stats.categories).length}</div>
              <div className="text-xs text-gray-500">Categories</div>
            </div>
          </div>

          <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => generateCertificate(false)}
          disabled={isGenerating}
          className="w-full px-6 py-4 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-xl font-semibold hover:from-eco-600 hover:to-eco-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isGenerating ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating Certificate...
            </div>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download Certificate
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => generateCertificate(true)}
          disabled={isGenerating || emailSent}
          className="w-full px-6 py-4 border-2 border-eco-500 text-eco-600 rounded-xl font-semibold hover:bg-eco-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Mail className="w-5 h-5 mr-2" />
          {emailSent ? 'Email Sent!' : 'Email Certificate'}
        </motion.button>
      </div>

      {emailSent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-eco-50 border border-eco-200 rounded-lg text-center"
        >
          <p className="text-sm text-eco-700">
            Certificate has been sent to {user?.email}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CertificateGenerator;