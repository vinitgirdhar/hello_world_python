import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider, message, Checkbox, Row, Col } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  GoogleOutlined, 
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
  GithubOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../components/ThemeProvider';
import './Login.css';

const { Title, Text, Paragraph } = Typography;

interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Add entrance animation
    document.body.classList.add('login-page-active');
    return () => {
      document.body.classList.remove('login-page-active');
    };
  }, []);

  // map role -> default landing route (change paths to match your router)
  const roleToRoute = (role?: string) => {
    switch (role) {
      case 'asha_worker': return '/asha/dashboard';
      case 'community_user': return '/community/home';
      case 'healthcare_worker': return '/health/dashboard';
      case 'district_health_official': return '/district/dashboard';
      case 'government_body': return '/gov/dashboard';
      case 'admin': return '/admin/dashboard';
      case 'volunteer': return '/volunteer/home';
      default: return '/dashboard';
    }
  };

  //get stored user (AuthContext sets it in localStorage)
  const getStoredUser = () => {
    try {
      const s = localStorage.getItem('paanicare-user');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  };

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const ok = await login(values.email, values.password);
      if (!ok) {
        message.error('Login failed! Check credentials.');
        return;
      }

      // read stored user from localStorage (AuthProvider saved it there)
      const stored = localStorage.getItem('paanicare-user');
      const clientUser = stored ? JSON.parse(stored) : null;
      const role = clientUser?.role || 'community_user';

      // choose destination based on role (adjust these routes to your router)
      const getHomeForRole = (r: string) => {
        switch (r) {
          case 'admin': return '/dashboard';
          case 'asha_worker': return '/asha/dashboard';
          case 'district_health_official': return '/dashboard';
          case 'government_body': return '/dashboard';
          case 'community_user': return '/community';
          default: return '/dashboard';
        }
      };

      const dest = from && from !== '/login' ? from : getHomeForRole(role);
      message.success('Login successful!');
      navigate(dest, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };


  const handleDemoLogin = async (role: string) => {
    setLoading(true);
    try {
      const demoCredentials = {
        admin: { email: 'admin@paanicare.com', password: 'admin123' },
        asha_worker: { email: 'asha@paanicare.com', password: 'asha123' },
        volunteer: { email: 'volunteer@paanicare.com', password: 'volunteer123' },
        healthcare_worker: { email: 'healthcare@paanicare.com', password: 'healthcare123' },
        district_health_official: { email: 'district@paanicare.com', password: 'district123' },
        government_body: { email: 'government@paanicare.com', password: 'government123' },
        community_user: { email: 'user@paanicare.com', password: 'user123' }
      };
      
      const credentials = demoCredentials[role as keyof typeof demoCredentials];
      form.setFieldsValue(credentials);
      const ok = await login(credentials.email, credentials.password);
      if (!ok) {
        message.error('Demo login failed.');
        return;
      }

      // redirect based on role
      const target = roleToRoute(role);
      message.success(`Logged in as ${role.replace('_', ' ')}`);
      navigate(target, { replace: true });
    } catch (error) {
      message.error('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: 'admin',
      title: 'System Administrator',
      description: 'Full system access and management',
      icon: <SafetyCertificateOutlined />,
      color: '#ff4d4f'
    },
    {
      role: 'asha_worker',
      title: 'ASHA Worker',
      description: 'Community health worker access',
      icon: <UserOutlined />,
      color: '#52c41a'
    },
    {
      role: 'volunteer',
      title: 'Community Volunteer',
      description: 'Volunteer coordination and support',
      icon: <UserOutlined />,
      color: '#1890ff'
    },
    {
      role: 'healthcare_worker',
      title: 'Healthcare Professional',
      description: 'Medical staff access and tools',
      icon: <UserOutlined />,
      color: '#722ed1'
    },
    {
      role: 'district_health_official',
      title: 'District Health Official',
      description: 'Regional health oversight',
      icon: <UserOutlined />,
      color: '#fa8c16'
    },
    {
      role: 'government_body',
      title: 'Government Official',
      description: 'Policy and administrative access',
      icon: <UserOutlined />,
      color: '#eb2f96'
    },
    {
      role: 'community_user',
      title: 'Community User',
      description: 'Report symptoms and view alerts',
      icon: <UserOutlined />,
      color: '#1890ff'
    }
  ];

  return (
    <div className={`login-page ${isDark ? 'dark' : 'light'}`}>
      {/* Background Elements */}
      <div className="login-background">
        <div className="login-background-overlay"></div>
        <div className="floating-elements">
          <div className="floating-element element-1">💧</div>
          <div className="floating-element element-2">🔬</div>
          <div className="floating-element element-3">🏥</div>
          <div className="floating-element element-4">📊</div>
          <div className="floating-element element-5">🌿</div>
          <div className="floating-element element-6">⚕️</div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="login-container">
        <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '20px 0' }}>
          <Col xs={24} sm={22} md={20} lg={18} xl={16} xxl={14}>
            <Card className="login-card" hoverable>
              {/* Header */}
              <div className="login-header">
                <Button 
                  type="text" 
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate('/')}
                  className="back-button"
                >
                  Back to Home
                </Button>
                
                <div className="login-logo">
                  <div className="logo-container">
                    <div className="logo-icon">💧</div>
                    <div className="logo-waves">
                      <div className="wave wave-1"></div>
                      <div className="wave wave-2"></div>
                      <div className="wave wave-3"></div>
                    </div>
                  </div>
                  <Title level={2} className="login-title">
                    Welcome Back
                  </Title>
                  <Text className="login-subtitle">
                    Sign in to continue protecting communities
                  </Text>
                </div>
              </div>

              {/* Login Form */}
              <Form
                form={form}
                name="login"
                size="large"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                className="login-form"
                requiredMark={false}
              >
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined className="input-icon" />} 
                    placeholder="Enter your email address"
                    className="login-input"
                    autoComplete="email"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="input-icon" />}
                    placeholder="Enter your password"
                    className="login-input"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    autoComplete="current-password"
                  />
                </Form.Item>

                <div className="login-options">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox className="remember-checkbox">
                      Remember me
                    </Checkbox>
                  </Form.Item>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot password?
                  </Link>
                </div>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    className="login-button"
                    block
                    size="large"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Form.Item>
              </Form>

              {/* Demo Section */}
              <div className="demo-section">
                <Button 
                  type="text" 
                  onClick={() => setShowDemo(!showDemo)}
                  className="demo-toggle"
                  block
                >
                  {showDemo ? 'Hide Demo Accounts' : 'Try Demo Accounts'} 
                </Button>
                
                {showDemo && (
                  <div className="demo-accounts">
                    <Paragraph className="demo-description">
                      Explore the platform with different user roles:
                    </Paragraph>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      {demoAccounts.map((demo) => (
                        <Card 
                          key={demo.role}
                          size="small"
                          className="demo-card"
                          hoverable
                          onClick={() => handleDemoLogin(demo.role as any)}
                        >
                          <div className="demo-card-content">
                            <div className="demo-icon" style={{ color: demo.color }}>
                              {demo.icon}
                            </div>
                            <div className="demo-info">
                              <Text strong>{demo.title}</Text>
                              <Text type="secondary" className="demo-desc">
                                {demo.description}
                              </Text>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </Space>
                  </div>
                )}
              </div>

              {/* Social Login */}
              <div className="social-section">
                <Divider>
                  <Text type="secondary">Or continue with</Text>
                </Divider>

                <Row gutter={[12, 12]}>
                  <Col span={12}>
                    <Button 
                      icon={<GoogleOutlined />} 
                      className="social-button google"
                      block
                      size="large"
                    >
                      Google
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button 
                      icon={<UserOutlined />} 
                      className="social-button facebook"
                      block
                      size="large"
                    >
                      Facebook
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button 
                      icon={<MailOutlined />} 
                      className="social-button twitter"
                      block
                      size="large"
                    >
                      Twitter
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button 
                      icon={<GithubOutlined />} 
                      className="social-button github"
                      block
                      size="large"
                    >
                      GitHub
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Footer */}
              <div className="login-footer">
                <Text className="signup-text">
                  Don't have an account? 
                  <Link to="/register" className="signup-link"> Create one here</Link>
                </Text>
                <div className="footer-links">
                  <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                  <span className="separator">•</span>
                  <Link to="/terms" className="footer-link">Terms of Service</Link>
                  <span className="separator">•</span>
                  <Link to="/help" className="footer-link">Help Center</Link>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;
