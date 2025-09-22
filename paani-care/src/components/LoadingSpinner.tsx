import React from 'react';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './LoadingSpinner.css';

const { Text } = Typography;

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  message?: string;
  overlay?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'large', 
  message = 'Loading...', 
  overlay = false,
  className = ''
}) => {
  const customIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 48 : size === 'default' ? 32 : 24 }} spin />;

  if (overlay) {
    return (
      <div className={`loading-overlay ${className}`}>
        <div className="loading-content">
          <Spin indicator={customIcon} size={size} />
          {message && (
            <Text className="loading-message" type="secondary">
              {message}
            </Text>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`loading-container ${className}`}>
      <Spin indicator={customIcon} size={size} />
      {message && (
        <Text className="loading-message" type="secondary">
          {message}
        </Text>
      )}
    </div>
  );
};

export default LoadingSpinner;