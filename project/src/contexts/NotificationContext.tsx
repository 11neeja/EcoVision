import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 notifications

    // Show toast only once
    const toastOptions = {
      duration: 3000,
      position: 'top-right' as const,
    };

    switch (notification.type) {
      case 'success':
        toast.success(notification.message, {
          ...toastOptions,
          icon: '✅',
        });
        break;
      case 'error':
        toast.error(notification.message, {
          ...toastOptions,
          icon: '❌',
        });
        break;
      case 'warning':
        toast(notification.message, {
          ...toastOptions,
          icon: '⚠️',
          style: {
            background: '#fef3c7',
            color: '#92400e',
          },
        });
        break;
      case 'info':
        toast(notification.message, {
          ...toastOptions,
          icon: 'ℹ️',
          style: {
            background: '#dbeafe',
            color: '#1e40af',
          },
        });
        break;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const showSuccess = (message: string, title = 'Success') => {
    // Prevent duplicate notifications
    const isDuplicate = notifications.some(n => 
      n.message === message && 
      n.type === 'success' && 
      Date.now() - n.timestamp.getTime() < 5000
    );
    
    if (!isDuplicate) {
      addNotification({ type: 'success', title, message });
    }
  };

  const showError = (message: string, title = 'Error') => {
    const isDuplicate = notifications.some(n => 
      n.message === message && 
      n.type === 'error' && 
      Date.now() - n.timestamp.getTime() < 5000
    );
    
    if (!isDuplicate) {
      addNotification({ type: 'error', title, message });
    }
  };

  const showInfo = (message: string, title = 'Information') => {
    const isDuplicate = notifications.some(n => 
      n.message === message && 
      n.type === 'info' && 
      Date.now() - n.timestamp.getTime() < 5000
    );
    
    if (!isDuplicate) {
      addNotification({ type: 'info', title, message });
    }
  };

  const showWarning = (message: string, title = 'Warning') => {
    const isDuplicate = notifications.some(n => 
      n.message === message && 
      n.type === 'warning' && 
      Date.now() - n.timestamp.getTime() < 5000
    );
    
    if (!isDuplicate) {
      addNotification({ type: 'warning', title, message });
    }
  };

  const value = {
    notifications,
    addNotification,
    markAsRead,
    clearNotifications,
    unreadCount,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};