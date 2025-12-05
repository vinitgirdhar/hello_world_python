// src/contexts/AlertContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { notification } from 'antd';
import { AlertOutlined } from '@ant-design/icons';
import AlertNotificationPopup from '../components/AlertNotificationPopup';

interface WaterAlert {
  id: string;
  region: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_by: string;
  created_by_role?: string;
  created_at: string;
  status: string;
  emails_sent?: number;
}

interface AlertContextType {
  alerts: WaterAlert[];
  unreadCount: number;
  latestAlert: WaterAlert | null;
  fetchAlerts: () => Promise<void>;
  acknowledgeAlert: (alertId: string) => void;
  isLoading: boolean;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within AlertProvider');
  }
  return context;
};

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const POLL_INTERVAL = 30000; // Check for new alerts every 30 seconds

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<WaterAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestAlert, setLatestAlert] = useState<WaterAlert | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('nirogya-acknowledged-alerts');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [lastCheckedTime, setLastCheckedTime] = useState<Date>(() => {
    try {
      const saved = localStorage.getItem('nirogya-last-alert-check');
      return saved ? new Date(saved) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to 24h ago
    } catch {
      return new Date(Date.now() - 24 * 60 * 60 * 1000);
    }
  });

  const fetchAlerts = useCallback(async () => {
    const token = localStorage.getItem('nirogya-token') || localStorage.getItem('paanicare-token');
    
    if (!token) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/alerts/list?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      const data: WaterAlert[] = await response.json();
      setAlerts(data);

      // Check for new alerts since last check
      const newAlerts = data.filter(alert => {
        const alertTime = new Date(alert.created_at);
        return alertTime > lastCheckedTime && !acknowledgedAlerts.has(alert.id);
      });

      // Update unread count
      const unread = data.filter(a => !acknowledgedAlerts.has(a.id)).length;
      setUnreadCount(unread);

      // Show popup for the newest unacknowledged high/critical alert
      if (newAlerts.length > 0) {
        const highPriorityAlert = newAlerts.find(
          a => (a.severity === 'high' || a.severity === 'critical') && !acknowledgedAlerts.has(a.id)
        );
        
        if (highPriorityAlert) {
          setLatestAlert(highPriorityAlert);
          setShowPopup(true);
        } else {
          // Show notification for lower priority alerts
          const newestAlert = newAlerts[0];
          notification.info({
            message: '📢 New Alert',
            description: `${newestAlert.title} - ${newestAlert.region}`,
            icon: <AlertOutlined style={{ color: '#1890ff' }} />,
            duration: 5,
            placement: 'topRight'
          });
        }
      }

      // Update last checked time
      const now = new Date();
      setLastCheckedTime(now);
      localStorage.setItem('nirogya-last-alert-check', now.toISOString());

    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [lastCheckedTime, acknowledgedAlerts]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAcknowledgedAlerts(prev => {
      const newSet = new Set(prev);
      newSet.add(alertId);
      localStorage.setItem('nirogya-acknowledged-alerts', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAlerts();
  }, []);

  // Poll for new alerts
  useEffect(() => {
    const interval = setInterval(fetchAlerts, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // Listen for visibility changes to fetch when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAlerts();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchAlerts]);

  return (
    <AlertContext.Provider 
      value={{ 
        alerts, 
        unreadCount, 
        latestAlert, 
        fetchAlerts, 
        acknowledgeAlert,
        isLoading 
      }}
    >
      {children}
      
      {/* Global Alert Popup */}
      <AlertNotificationPopup
        alert={latestAlert}
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onAcknowledge={acknowledgeAlert}
      />
    </AlertContext.Provider>
  );
};

export default AlertContext;
