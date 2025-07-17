import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

interface ClassificationResult {
  id: string;
  userId: string;
  itemName: string;
  category: string;
  hazardousMaterials: string[];
  safetyLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  confidence: number;
  reusabilityScore: number;
  reusabilityLabel: 'Highly Reusable' | 'Moderate' | 'Non-reusable';
  imageUrl: string;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
}

interface ClassificationContextType {
  classifications: ClassificationResult[];
  addClassification: (result: Omit<ClassificationResult, 'id' | 'userId' | 'timestamp'>) => void;
  getUserClassifications: () => ClassificationResult[];
  getAllClassifications: () => ClassificationResult[];
  deleteClassification: (id: string) => void;
  resetUserClassifications: () => void;
  getClassificationStats: () => {
    total: number;
    hazardous: number;
    categories: Record<string, number>;
    recentActivity: ClassificationResult[];
  };
}

const ClassificationContext = createContext<ClassificationContextType | undefined>(undefined);

export const useClassification = () => {
  const context = useContext(ClassificationContext);
  if (context === undefined) {
    throw new Error('useClassification must be used within a ClassificationProvider');
  }
  return context;
};

interface ClassificationProviderProps {
  children: ReactNode;
}

export const ClassificationProvider: React.FC<ClassificationProviderProps> = ({ children }) => {
  const [classifications, setClassifications] = useState<ClassificationResult[]>([]);
  const { user, isAdmin } = useAuth();
  const { showSuccess, showError } = useNotifications();

  // Load user-specific classifications on mount and user change
  useEffect(() => {
    if (user) {
      const userClassifications = JSON.parse(localStorage.getItem(`classifications_${user.id}`) || '[]');
      setClassifications(userClassifications);
    } else {
      setClassifications([]);
    }
  }, [user]);

  const calculateReusabilityScore = (itemName: string, category: string, hazardousMaterials: string[]) => {
    let score = 70; // Base score
    
    // Reduce score for hazardous materials
    score -= hazardousMaterials.length * 15;
    
    // Category-based adjustments
    if (category.includes('Battery')) score -= 30;
    if (category.includes('Cable') || category.includes('Accessory')) score += 20;
    if (category.includes('Phone') || category.includes('Computer')) score += 10;
    
    // Clamp between 0-100
    score = Math.max(0, Math.min(100, score));
    
    return score;
  };

  const getReusabilityLabel = (score: number): 'Highly Reusable' | 'Moderate' | 'Non-reusable' => {
    if (score >= 70) return 'Highly Reusable';
    if (score >= 40) return 'Moderate';
    return 'Non-reusable';
  };

  const addClassification = (result: Omit<ClassificationResult, 'id' | 'userId' | 'timestamp'>) => {
    if (!user) {
      showError('You must be logged in to classify items');
      return;
    }

    const reusabilityScore = calculateReusabilityScore(
      result.itemName,
      result.category,
      result.hazardousMaterials
    );

    const newClassification: ClassificationResult = {
      ...result,
      id: `classification-${Date.now()}`,
      userId: user.id,
      timestamp: new Date(),
      reusabilityScore,
      reusabilityLabel: getReusabilityLabel(reusabilityScore),
    };

    const updatedClassifications = [newClassification, ...classifications];
    setClassifications(updatedClassifications);
    
    // Store user-specific classifications
    localStorage.setItem(`classifications_${user.id}`, JSON.stringify(updatedClassifications));

    showSuccess(
      `Successfully classified ${result.itemName}! ${result.hazardousMaterials.length > 0 ? 'Hazardous materials detected.' : 'No hazardous materials found.'}`,
      'Classification Complete'
    );
  };

  const getUserClassifications = (): ClassificationResult[] => {
    if (!user) return [];
    return classifications.filter(c => c.userId === user.id);
  };

  const getAllClassifications = (): ClassificationResult[] => {
    if (!isAdmin) return getUserClassifications();
    
    // For admin, load all users' classifications
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    let allClassifications: ClassificationResult[] = [];
    
    allUsers.forEach((u: any) => {
      const userClassifications = JSON.parse(localStorage.getItem(`classifications_${u.id}`) || '[]');
      allClassifications = [...allClassifications, ...userClassifications];
    });
    
    return allClassifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const deleteClassification = (id: string) => {
    const classification = classifications.find(c => c.id === id);
    if (!classification) {
      showError('Classification not found');
      return;
    }

    // Check permissions
    if (!isAdmin && classification.userId !== user?.id) {
      showError('You can only delete your own classifications');
      return;
    }

    const updatedClassifications = classifications.filter(c => c.id !== id);
    setClassifications(updatedClassifications);
    
    // Update user-specific storage
    if (user) {
      localStorage.setItem(`classifications_${user.id}`, JSON.stringify(updatedClassifications));
    }

    showSuccess('Classification deleted successfully');
  };

  const resetUserClassifications = () => {
    if (!user) return;

    if (isAdmin) {
      // Admin can reset all data
      const allUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      allUsers.forEach((u: any) => {
        localStorage.removeItem(`classifications_${u.id}`);
      });
      setClassifications([]);
      showSuccess('All classifications reset successfully');
    } else {
      // User can only reset their own data
      setClassifications([]);
      localStorage.removeItem(`classifications_${user.id}`);
      showSuccess('Your classifications have been reset');
    }
  };

  const getClassificationStats = () => {
    const userClassifications = isAdmin ? getAllClassifications() : getUserClassifications();
    
    const stats = {
      total: userClassifications.length,
      hazardous: userClassifications.filter(c => c.hazardousMaterials.length > 0).length,
      categories: {} as Record<string, number>,
      recentActivity: userClassifications.slice(0, 5),
    };

    // Count categories
    userClassifications.forEach(c => {
      stats.categories[c.category] = (stats.categories[c.category] || 0) + 1;
    });

    return stats;
  };

  const value = {
    classifications,
    addClassification,
    getUserClassifications,
    getAllClassifications,
    deleteClassification,
    resetUserClassifications,
    getClassificationStats,
  };

  return (
    <ClassificationContext.Provider value={value}>
      {children}
    </ClassificationContext.Provider>
  );
};