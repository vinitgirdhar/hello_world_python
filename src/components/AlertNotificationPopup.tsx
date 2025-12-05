// src/components/AlertNotificationPopup.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, Tag, Typography, Space, Divider } from 'antd';
import { 
  AlertOutlined, 
  EnvironmentOutlined,
  ClockCircleOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import './AlertNotificationPopup.css';

const { Title, Text, Paragraph } = Typography;

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
}

interface AlertNotificationPopupProps {
  alert: WaterAlert | null;
  visible: boolean;
  onClose: () => void;
  onAcknowledge?: (alertId: string) => void;
}

const severityConfig = {
  low: { color: '#1890ff', bg: '#e6f7ff', icon: '📋', label: 'Low Priority' },
  medium: { color: '#faad14', bg: '#fffbe6', icon: '⚠️', label: 'Medium Priority' },
  high: { color: '#ff4d4f', bg: '#fff1f0', icon: '🚨', label: 'High Priority' },
  critical: { color: '#cf1322', bg: '#ffccc7', icon: '🆘', label: 'CRITICAL' }
};

const AlertNotificationPopup: React.FC<AlertNotificationPopupProps> = ({
  alert,
  visible,
  onClose,
  onAcknowledge
}) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (visible && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [visible, countdown]);

  useEffect(() => {
    if (visible) {
      setCountdown(30);
      // Play alert sound for high/critical alerts
      if (alert?.severity === 'high' || alert?.severity === 'critical') {
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleOPg');
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch (e) {}
      }
    }
  }, [visible, alert]);

  if (!alert) return null;

  const config = severityConfig[alert.severity] || severityConfig.medium;
  const createdAt = new Date(alert.created_at);
  const timeAgo = getTimeAgo(createdAt);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      className={`alert-notification-popup severity-${alert.severity}`}
      closable={true}
      maskClosable={false}
    >
      {/* Pulsing Header */}
      <div className="alert-popup-header" style={{ background: config.bg }}>
        <div className="alert-icon-wrapper" style={{ background: config.color }}>
          <span style={{ fontSize: 32 }}>{config.icon}</span>
        </div>
        <div className="alert-header-content">
          <Tag color={config.color} style={{ marginBottom: 8 }}>
            {config.label}
          </Tag>
          <Title level={4} style={{ margin: 0, color: config.color }}>
            {alert.title}
          </Title>
        </div>
      </div>

      {/* Alert Body */}
      <div className="alert-popup-body">
        {/* Location */}
        <div className="alert-meta-row">
          <EnvironmentOutlined style={{ color: config.color }} />
          <Text strong>Region:</Text>
          <Text>{alert.region}</Text>
        </div>

        {/* Time */}
        <div className="alert-meta-row">
          <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
          <Text strong>Issued:</Text>
          <Text>{timeAgo}</Text>
        </div>

        {/* Issued By */}
        <div className="alert-meta-row">
          <SafetyOutlined style={{ color: '#52c41a' }} />
          <Text strong>Issued by:</Text>
          <Text>{alert.created_by} ({alert.created_by_role || 'Health Official'})</Text>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* Description */}
        <div className="alert-description-section">
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            <AlertOutlined /> Alert Message:
          </Text>
          <div className="alert-message-box" style={{ borderLeftColor: config.color }}>
            <Paragraph style={{ margin: 0 }}>
              {alert.description}
            </Paragraph>
          </div>
        </div>

        {/* Safety Instructions */}
        <div className="safety-instructions">
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            ✅ Recommended Actions:
          </Text>
          <ul>
            <li>Boil water for at least 1 minute before drinking</li>
            <li>Avoid using tap water for cooking without boiling</li>
            <li>Use bottled water if available</li>
            <li>Contact local health center if you feel unwell</li>
          </ul>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="alert-popup-footer">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            This popup will close in {countdown}s
          </Text>
          <Space>
            <Button onClick={onClose}>
              Dismiss
            </Button>
            <Button 
              type="primary" 
              onClick={() => {
                onAcknowledge?.(alert.id);
                onClose();
              }}
              style={{ background: config.color, borderColor: config.color }}
            >
              I Understand
            </Button>
          </Space>
        </Space>
      </div>
    </Modal>
  );
};

// Helper function
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export default AlertNotificationPopup;
