import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Report {
  id: string;
  userId: string;
  title: string;
  type: 'classification' | 'summary' | 'analysis' | 'uploaded';
  content: any;
  createdAt: Date;
  updatedAt: Date;
  size: string;
  status: 'completed' | 'processing' | 'failed';
  downloadCount: number;
  isPublic: boolean;
  tags: string[];
  fileUrl?: string;
}

interface ReportContextType {
  reports: Report[];
  createReport: (reportData: Omit<Report, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'downloadCount'>) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  downloadReport: (id: string, format: 'pdf' | 'pptx' | 'csv') => Promise<void>;
  uploadReport: (file: File, title: string, tags: string[]) => Promise<void>;
  getUserReports: () => Report[];
  getAllReports: () => Report[];
  generateClassificationReport: (classificationData: any) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};

interface ReportProviderProps {
  children: ReactNode;
}

export const ReportProvider: React.FC<ReportProviderProps> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const { user, isAdmin } = useAuth();
  const { showSuccess, showError, showInfo } = useNotifications();

  const createReport = (reportData: Omit<Report, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'downloadCount'>) => {
    if (!user) {
      showError('You must be logged in to create reports');
      return;
    }

    const newReport: Report = {
      ...reportData,
      id: `report-${Date.now()}`,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      downloadCount: 0,
    };

    setReports(prev => [newReport, ...prev]);
    
    // Store in localStorage
    const stored = JSON.parse(localStorage.getItem('reports') || '[]');
    stored.unshift(newReport);
    localStorage.setItem('reports', JSON.stringify(stored));

    showSuccess('Report created successfully!');
  };

  const updateReport = (id: string, updates: Partial<Report>) => {
    const report = reports.find(r => r.id === id);
    if (!report) {
      showError('Report not found');
      return;
    }

    // Check permissions
    if (!isAdmin && report.userId !== user?.id) {
      showError('You can only edit your own reports');
      return;
    }

    const updatedReport = {
      ...report,
      ...updates,
      updatedAt: new Date(),
    };

    setReports(prev => prev.map(r => r.id === id ? updatedReport : r));
    
    // Update localStorage
    const stored = JSON.parse(localStorage.getItem('reports') || '[]');
    const updated = stored.map((r: Report) => r.id === id ? updatedReport : r);
    localStorage.setItem('reports', JSON.stringify(updated));

    showSuccess('Report updated successfully!');
  };

  const deleteReport = (id: string) => {
    const report = reports.find(r => r.id === id);
    if (!report) {
      showError('Report not found');
      return;
    }

    // Check permissions
    if (!isAdmin && report.userId !== user?.id) {
      showError('You can only delete your own reports');
      return;
    }

    setReports(prev => prev.filter(r => r.id !== id));
    
    // Update localStorage
    const stored = JSON.parse(localStorage.getItem('reports') || '[]');
    const updated = stored.filter((r: Report) => r.id !== id);
    localStorage.setItem('reports', JSON.stringify(updated));

    showSuccess('Report deleted successfully!');
  };

  const downloadReport = async (id: string, format: 'pdf' | 'pptx' | 'csv') => {
    const report = reports.find(r => r.id === id);
    if (!report) {
      showError('Report not found');
      return;
    }

    // Check permissions
    if (!isAdmin && report.userId !== user?.id && !report.isPublic) {
      showError('You do not have permission to download this report');
      return;
    }

    showInfo(`Preparing ${format.toUpperCase()} download...`);

    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (format === 'pdf') {
        await generatePDFReport(report);
      } else if (format === 'pptx') {
        await generatePPTXReport(report);
      } else if (format === 'csv') {
        await generateCSVReport(report);
      }

      // Update download count
      updateReport(id, { downloadCount: report.downloadCount + 1 });
      
      showSuccess(`${format.toUpperCase()} report downloaded successfully!`);
    } catch (error) {
      showError(`Failed to download ${format.toUpperCase()} report`);
    }
  };

  const generatePDFReport = async (report: Report) => {
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(20);
    pdf.text(report.title, 20, 30);
    
    // Add metadata
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 50);
    pdf.text(`Type: ${report.type}`, 20, 60);
    pdf.text(`Status: ${report.status}`, 20, 70);
    
    // Add content
    pdf.setFontSize(10);
    const content = JSON.stringify(report.content, null, 2);
    const lines = pdf.splitTextToSize(content, 170);
    pdf.text(lines, 20, 90);
    
    // Save the PDF
    pdf.save(`${report.title.replace(/\s+/g, '_')}.pdf`);
  };

  const generatePPTXReport = async (report: Report) => {
    // Simulate PPTX generation
    const blob = new Blob(['PPTX content placeholder'], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.pptx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateCSVReport = async (report: Report) => {
    const csvContent = `Title,Type,Status,Created,Updated\n"${report.title}","${report.type}","${report.status}","${report.createdAt}","${report.updatedAt}"`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uploadReport = async (file: File, title: string, tags: string[]) => {
    if (!user) {
      showError('You must be logged in to upload reports');
      return;
    }

    showInfo('Uploading report...');

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newReport: Report = {
        id: `report-${Date.now()}`,
        userId: user.id,
        title,
        type: 'uploaded',
        content: { fileName: file.name, fileSize: file.size },
        createdAt: new Date(),
        updatedAt: new Date(),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        status: 'completed',
        downloadCount: 0,
        isPublic: false,
        tags,
        fileUrl: URL.createObjectURL(file),
      };

      setReports(prev => [newReport, ...prev]);
      
      // Store in localStorage
      const stored = JSON.parse(localStorage.getItem('reports') || '[]');
      stored.unshift(newReport);
      localStorage.setItem('reports', JSON.stringify(stored));

      showSuccess('Report uploaded successfully!');
    } catch (error) {
      showError('Failed to upload report');
    }
  };

  const getUserReports = (): Report[] => {
    if (!user) return [];
    return reports.filter(r => r.userId === user.id);
  };

  const getAllReports = (): Report[] => {
    if (!isAdmin) return getUserReports();
    return reports;
  };

  const generateClassificationReport = (classificationData: any) => {
    createReport({
      title: `Classification Report - ${classificationData.itemName}`,
      type: 'classification',
      content: classificationData,
      size: '1.2 MB',
      status: 'completed',
      isPublic: false,
      tags: [classificationData.category, classificationData.safetyLevel],
    });
  };

  // Load reports from localStorage on mount
  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('reports') || '[]');
    setReports(stored);
  }, []);

  const value = {
    reports,
    createReport,
    updateReport,
    deleteReport,
    downloadReport,
    uploadReport,
    getUserReports,
    getAllReports,
    generateClassificationReport,
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};