import React, { useState, useEffect } from 'react';
import { Button, Typography, Row, Col, Card, Statistic, Space, Progress } from 'antd';
import { 
  PlayCircleOutlined, 
  SafetyCertificateOutlined,
  TeamOutlined,
  ExperimentOutlined,
  GlobalOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  DropboxOutlined,
  AlertOutlined,
  TrophyOutlined,
  HeartOutlined,
  StarFilled,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../components/ThemeProvider';
import HomeNavbar from '../components/HomeNavbar';
import AIChatbot from '../components/AIChatbot';
import Footer from '../components/Footer';
import './Home.css';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Preload video
    const video = document.createElement('video');
    video.src = '/videos/paanicarehome.mp4';
    video.onloadeddata = () => setVideoLoaded(true);
  }, []);

  const features = [
    {
      icon: <MedicineBoxOutlined />,
      title: 'Health Surveillance',
      description: 'Real-time monitoring and tracking of water-borne diseases in communities',
      color: '#52c41a',
      progress: 95,
      delay: '0.1s'
    },
    {
      icon: <DropboxOutlined />,
      title: 'Water Quality Testing',
      description: 'IoT sensor integration and manual testing for water contamination detection',
      color: '#1890ff',
      progress: 87,
      delay: '0.2s'
    },
    {
      icon: <TeamOutlined />,
      title: 'Community Reporting',
      description: 'Easy-to-use interface for community members to report health symptoms',
      color: '#722ed1',
      progress: 92,
      delay: '0.3s'
    },
    {
      icon: <AlertOutlined />,
      title: 'Early Warning System',
      description: 'AI-powered alerts for potential disease outbreaks and contamination',
      color: '#fa8c16',
      progress: 89,
      delay: '0.4s'
    }
  ];

  const stats = [
    { title: 'Communities Served', value: 150, suffix: '+', icon: <TeamOutlined />, color: '#52c41a' },
    { title: 'Health Cases Tracked', value: 5420, suffix: '+', icon: <HeartOutlined />, color: '#1890ff' },
    { title: 'Water Sources Monitored', value: 89, suffix: '+', icon: <DropboxOutlined />, color: '#722ed1' },
    { title: 'Lives Protected', value: 25000, suffix: '+', icon: <TrophyOutlined />, color: '#fa8c16' }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      role: "District Health Officer, Guwahati",
      image: "/images/testimonials/user1.jpg",
      rating: 5,
      content: "Paani Care has revolutionized how we monitor water-borne diseases in our district. The early warning system helped us prevent a major cholera outbreak last month. The real-time data and community reporting features are game-changers.",
      location: "Assam"
    },
    {
      id: 2,
      name: "Ravi Kumar",
      role: "Community Health Worker",
      image: "/images/testimonials/user2.jpg",
      rating: 5,
      content: "As a frontline health worker, this platform makes my job so much easier. I can quickly report symptoms, track water quality issues, and get immediate alerts. The mobile interface is intuitive and works well even with poor connectivity.",
      location: "Meghalaya"
    },
    {
      id: 3,
      name: "Mrs. Anita Devi",
      role: "Village Water Committee Head",
      image: "/images/testimonials/user3.jpg",
      rating: 5,
      content: "Our village water sources are now properly monitored thanks to Paani Care. We received an alert about contamination that saved many families from illness. The system truly protects our community.",
      location: "Manipur"
    },
    {
      id: 4,
      name: "Dr. James Mawlong",
      role: "Public Health Specialist",
      image: "/images/testimonials/user4.jpg",
      rating: 5,
      content: "The AI-powered analytics and predictive capabilities of Paani Care are impressive. We can now identify disease patterns and take preventive action before outbreaks occur. It's exactly what our region needed.",
      location: "Shillong"
    }
  ];

  return (
    <div className={`home-page ${isDark ? 'dark' : ''}`}>
      {/* Navigation Bar */}
      <HomeNavbar />
      
      {/* Hero Section with Video Background */}
      <section className="hero-section">
        <div className="hero-particles"></div>
        <div className="video-background">
          {videoLoaded && (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="background-video"
            >
              <source src="/videos/paanicarehome.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <div className="video-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-text">🌊 Protecting Communities Since 2025</span>
            </div>
            <Title level={1} className="hero-title">
              {isAuthenticated ? `Welcome back, ${user?.name?.split(' ')[0]}!` : 'Paani Care'}
            </Title>
            <Title level={2} className="hero-subtitle">
              Smart Health Surveillance & Early Warning System
            </Title>
            <Paragraph className="hero-description">
              {isAuthenticated 
                ? `Continue your important work in protecting communities through advanced water-borne disease monitoring and health surveillance.`
                : `Protecting communities in the Northeastern Region through advanced water-borne disease monitoring, real-time alerts, and community-driven health surveillance.`
              }
            </Paragraph>
            
            <Space size="large" className="hero-actions">
              <Button 
                type="primary" 
                size="large" 
                icon={<ArrowRightOutlined />}
                className="cta-button primary-cta"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </Button>
              {!isAuthenticated && (
                <Button 
                  size="large" 
                  icon={<PlayCircleOutlined />}
                  className="demo-button glass-button"
                  ghost
                >
                  Watch Demo
                </Button>
              )}
            </Space>
            
            <div className="hero-trust-indicators">
              <div className="trust-item">
                <span className="trust-number">150+</span>
                <span className="trust-label">Communities</span>
              </div>
              <div className="trust-item">
                <span className="trust-number">25K+</span>
                <span className="trust-label">Lives Protected</span>
              </div>
              <div className="trust-item">
                <span className="trust-number">99.9%</span>
                <span className="trust-label">Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-background"></div>
        <div className="container">
          <div className="stats-header">
            <Title level={2} className="stats-title">
              Making a Real Impact
            </Title>
            <Paragraph className="stats-description">
              Our platform has already made significant improvements in community health across the region
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]} className="stats-grid">
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <Card className="stat-card modern-card" hoverable>
                  <div className="stat-content">
                    <div className="stat-icon" style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      suffix={stat.suffix}
                      valueStyle={{ 
                        color: stat.color,
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        lineHeight: 1
                      }}
                      className="enhanced-statistic"
                    />
                    <div className="stat-indicator" style={{ backgroundColor: stat.color }}></div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-background"></div>
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>🚀 Our Solutions</span>
            </div>
            <Title level={2} className="section-title">
              Comprehensive Health Protection
            </Title>
            <Paragraph className="section-description">
              Our integrated platform provides end-to-end solutions for water-borne disease 
              prevention and community health management with cutting-edge technology.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} className="features-grid">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card 
                  className="feature-card glass-card" 
                  hoverable
                  style={{ animationDelay: feature.delay }}
                >
                  <div className="feature-header">
                    <div 
                      className="feature-icon"
                      style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                    >
                      {React.cloneElement(feature.icon, { 
                        style: { fontSize: '2.5rem', color: feature.color } 
                      })}
                    </div>
                    <div className="feature-badge" style={{ backgroundColor: feature.color }}>
                      New
                    </div>
                  </div>
                  
                  <div className="feature-body">
                    <Title level={4} className="feature-title">{feature.title}</Title>
                    <Paragraph className="feature-description">
                      {feature.description}
                    </Paragraph>
                    
                    <div className="feature-progress">
                      <div className="progress-header">
                        <span className="progress-label">Implementation</span>
                        <span className="progress-value" style={{ color: feature.color }}>
                          {feature.progress}%
                        </span>
                      </div>
                      <Progress 
                        percent={feature.progress} 
                        strokeColor={{
                          '0%': feature.color,
                          '100%': feature.color + '80'
                        }}
                        size="small"
                        showInfo={false}
                        strokeWidth={6}
                      />
                    </div>
                  </div>
                  
                  <div className="feature-footer">
                    <Button 
                      type="text" 
                      className="learn-more-btn"
                      style={{ color: feature.color }}
                    >
                      Learn More →
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-background"></div>
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              What Our Users Say
            </Title>
            <Paragraph className="section-description">
              Healthcare professionals and community members across the Northeast trust Paani Care to protect their communities
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]} className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <Col xs={24} sm={12} lg={6} key={testimonial.id}>
                <Card className="testimonial-card modern-card" hoverable>
                  <div className="testimonial-content">
                    <div className="testimonial-header">
                      <div className="testimonial-avatar">
                        <UserOutlined className="avatar-icon" />
                      </div>
                      <div className="testimonial-rating">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarFilled key={i} className="star-icon" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="testimonial-text">
                      <Paragraph>"{testimonial.content}"</Paragraph>
                    </div>
                    
                    <div className="testimonial-footer">
                      <div className="testimonial-author">
                        <Title level={5} className="author-name">{testimonial.name}</Title>
                        <Paragraph className="author-role">{testimonial.role}</Paragraph>
                        <span className="author-location">{testimonial.location}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div className="mission-content">
                <Title level={2} className="mission-title">
                  Our Mission
                </Title>
                <Paragraph className="mission-text">
                  To safeguard the health of vulnerable communities in the Northeastern Region 
                  by providing cutting-edge technology solutions for early disease detection, 
                  water quality monitoring, and community health surveillance.
                </Paragraph>
                
                <div className="mission-points">
                  <div className="mission-point">
                    <CheckCircleOutlined className="check-icon" />
                    <span>Early detection of water-borne disease outbreaks</span>
                  </div>
                  <div className="mission-point">
                    <CheckCircleOutlined className="check-icon" />
                    <span>Real-time water quality monitoring and alerts</span>
                  </div>
                  <div className="mission-point">
                    <CheckCircleOutlined className="check-icon" />
                    <span>Community-driven health reporting and education</span>
                  </div>
                  <div className="mission-point">
                    <CheckCircleOutlined className="check-icon" />
                    <span>Multilingual support for tribal communities</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="mission-visual">
                <Card className="mission-card" hoverable>
                  <div className="mission-icons">
                    <div className="mission-icon-item">
                      <SafetyCertificateOutlined className="mission-icon" />
                      <span>Health Protection</span>
                    </div>
                    <div className="mission-icon-item">
                      <ExperimentOutlined className="mission-icon" />
                      <span>Water Testing</span>
                    </div>
                    <div className="mission-icon-item">
                      <GlobalOutlined className="mission-icon" />
                      <span>Community Reach</span>
                    </div>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <Title level={2} className="cta-title">
              {isAuthenticated 
                ? 'Continue Your Important Work' 
                : 'Ready to Protect Your Community?'
              }
            </Title>
            <Paragraph className="cta-description">
              {isAuthenticated 
                ? `Welcome back, ${user?.name}! Access your dashboard to continue monitoring health data, managing water quality reports, and protecting communities.`
                : 'Join thousands of health workers and community members using Paani Care to monitor and prevent water-borne diseases.'
              }
            </Paragraph>
            
            <Space size="large" className="cta-actions">
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                className="cta-primary"
              >
                {isAuthenticated ? 'Open Dashboard' : 'Join Now'}
              </Button>
              <Button 
                size="large"
                onClick={() => navigate(isAuthenticated ? '/community' : '/login')}
                className="cta-secondary"
              >
                {isAuthenticated ? 'Report Symptoms' : 'Sign In'}
              </Button>
            </Space>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
};

export default Home;