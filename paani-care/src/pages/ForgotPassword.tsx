import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Space, Divider } from 'antd';
import { ArrowLeftOutlined, MailOutlined, CheckCircleOutlined, SendOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const { Title, Text } = Typography;

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (values: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmail(values.email);
      setEmailSent(true);
      message.success('Password reset email sent successfully!');
    } catch (error) {
      message.error('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Email resent successfully!');
    } catch (error) {
      message.error('Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmailSent(false);
    setEmail('');
    form.resetFields();
  };

  return (
    <div className="forgot-password-page">
      {/* Animated Background */}
      <div className="forgot-background" />
      <div className="forgot-background-overlay" />
      
      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-element element-1">🔒</div>
        <div className="floating-element element-2">📧</div>
        <div className="floating-element element-3">🔑</div>
        <div className="floating-element element-4">🛡️</div>
        <div className="floating-element element-5">📱</div>
        <div className="floating-element element-6">✉️</div>
      </div>

      <div className="forgot-container">
        <Card className="forgot-card" bordered={false}>
          {/* Back Button */}
          <Link to="/login" className="back-button">
            <ArrowLeftOutlined /> Back to Login
          </Link>

          <div className="forgot-header">
            {!emailSent ? (
              <>
                {/* Logo with Animation */}
                <div className="logo-container">
                  <div className="logo-icon">
                    🔐
                  </div>
                  <div className="logo-waves">
                    <div className="wave wave-1"></div>
                    <div className="wave wave-2"></div>
                    <div className="wave wave-3"></div>
                  </div>
                </div>

                <Title level={2} className="forgot-title">
                  Forgot Password?
                </Title>
                <Text className="forgot-subtitle">
                  No worries! Enter your email address and we'll send you a link to reset your password.
                </Text>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="success-icon-container">
                  <CheckCircleOutlined className="success-icon" />
                  <div className="success-waves">
                    <div className="wave wave-1"></div>
                    <div className="wave wave-2"></div>
                    <div className="wave wave-3"></div>
                  </div>
                </div>

                <Title level={2} className="forgot-title">
                  Check Your Email
                </Title>
                <Text className="forgot-subtitle">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Check your inbox and follow the instructions to reset your password.
                </Text>
              </>
            )}
          </div>

          {!emailSent ? (
            // Email Form
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              size="large"
              className="forgot-form"
            >
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter your email address' },
                  { type: 'email', message: 'Please enter a valid email address' },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="input-icon" />}
                  placeholder="Enter your email address"
                  className="forgot-input"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="forgot-button"
                  icon={<SendOutlined />}
                >
                  {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
              </Form.Item>
            </Form>
          ) : (
            // Success Actions
            <div className="success-actions">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className="email-info">
                  <div className="email-icon">
                    <MailOutlined />
                  </div>
                  <div className="email-details">
                    <Text strong>Email Sent To:</Text>
                    <Text className="email-address">{email}</Text>
                  </div>
                </div>

                <div className="action-buttons">
                  <Button
                    type="primary"
                    onClick={handleResendEmail}
                    loading={loading}
                    block
                    className="resend-button"
                    icon={<SendOutlined />}
                  >
                    Resend Email
                  </Button>
                  
                  <Button
                    onClick={resetForm}
                    block
                    className="try-another-button"
                  >
                    Try Another Email
                  </Button>
                </div>
              </Space>
            </div>
          )}

          <Divider />

          {/* Instructions */}
          <div className="instructions">
            <Title level={5} className="instructions-title">
              What happens next?
            </Title>
            <div className="instruction-steps">
              <div className="step">
                <div className="step-number">1</div>
                <Text>Check your email inbox (and spam folder)</Text>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <Text>Click the password reset link in the email</Text>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <Text>Create a new secure password</Text>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <Text>Log in with your new password</Text>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="forgot-footer">
            <Text className="help-text">
              Still having trouble? 
              <a href="mailto:support@paanicare.com" className="support-link">
                Contact Support
              </a>
            </Text>
            
            <div className="footer-links">
              <Link to="/login" className="footer-link">Back to Login</Link>
              <span className="separator">•</span>
              <Link to="/register" className="footer-link">Create Account</Link>
              <span className="separator">•</span>
              <a href="/help" className="footer-link">Help Center</a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;