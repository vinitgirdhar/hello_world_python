import React from 'react';
import { Layout, Row, Col, Space, Typography, Divider, Button } from 'antd';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  GlobalOutlined, 
  HeartOutlined,
  TwitterOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  GithubOutlined
} from '@ant-design/icons';
import { useTheme } from './ThemeProvider';
import './Footer.css';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
  const { isDark } = useTheme();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { title: 'About Us', href: '/about' },
    { title: 'Services', href: '/services' },
    { title: 'Disease Mapping', href: '/disease-mapping' },
    { title: 'Water Quality', href: '/water-quality' },
    { title: 'Contact', href: '/contact' },
    { title: 'Help Center', href: '/help' }
  ];

  const resources = [
    { title: 'Documentation', href: '/docs' },
    { title: 'API Reference', href: '/api' },
    { title: 'Community', href: '/community' },
    { title: 'Support', href: '/support' },
    { title: 'Privacy Policy', href: '/privacy' },
    { title: 'Terms of Service', href: '/terms' }
  ];

  const emergencyContacts = [
    { title: 'Health Emergency', number: '108' },
    { title: 'Water Crisis', number: '1916' },
    { title: 'Disaster Helpline', number: '1078' },
    { title: 'Women Helpline', number: '1091' }
  ];

  return (
    <AntFooter className={`app-footer ${isDark ? 'dark-theme' : 'light-theme'}`}>
      <div className="footer-content">
        {/* Main Footer Content */}
        <Row gutter={[32, 32]} className="footer-main">
          {/* Company Info */}
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-icon">💧</div>
                <h3>Nirogya</h3>
              </div>
              <Text className="footer-description">
                Empowering communities with advanced water quality monitoring and disease prevention through AI-powered healthcare surveillance.
              </Text>
              <div className="footer-contact">
                <Space direction="vertical" size="small">
                  <div className="contact-item">
                    <EnvironmentOutlined />
                    <Text>Guwahati, Assam, India</Text>
                  </div>
                  <div className="contact-item">
                    <PhoneOutlined />
                    <Text>+91-361-XXXXXXX</Text>
                  </div>
                  <div className="contact-item">
                    <MailOutlined />
                    <Text>contact@paanicare.org</Text>
                  </div>
                  <div className="contact-item">
                    <GlobalOutlined />
                    <Text>www.paanicare.org</Text>
                  </div>
                </Space>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <div className="footer-links">
                {quickLinks.map((link, index) => (
                  <Link key={index} href={link.href} className="footer-link">
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          </Col>

          {/* Resources */}
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <h4>Resources</h4>
              <div className="footer-links">
                {resources.map((resource, index) => (
                  <Link key={index} href={resource.href} className="footer-link">
                    {resource.title}
                  </Link>
                ))}
              </div>
            </div>
          </Col>

          {/* Emergency Contacts */}
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <h4>Emergency Contacts</h4>
              <div className="emergency-contacts">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="emergency-item">
                    <Text strong>{contact.title}</Text>
                    <Button 
                      type="link" 
                      className="emergency-number"
                      href={`tel:${contact.number}`}
                    >
                      {contact.number}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        <Divider className="footer-divider" />

        {/* Social Links & Newsletter */}
        <Row gutter={[32, 16]} className="footer-social">
          <Col xs={24} md={12}>
            <div className="social-section">
              <h4>Follow Us</h4>
              <Space size="large" className="social-links">
                <Button 
                  type="text" 
                  icon={<TwitterOutlined />} 
                  className="social-button"
                  href="https://twitter.com/paanicare"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  icon={<FacebookOutlined />} 
                  className="social-button"
                  href="https://facebook.com/paanicare"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  icon={<LinkedinOutlined />} 
                  className="social-button"
                  href="https://linkedin.com/company/paanicare"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  icon={<InstagramOutlined />} 
                  className="social-button"
                  href="https://instagram.com/paanicare"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  icon={<GithubOutlined />} 
                  className="social-button"
                  href="https://github.com/paanicare"
                  target="_blank"
                />
              </Space>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="newsletter-section">
              <h4>Stay Updated</h4>
              <Text className="newsletter-text">
                Get the latest updates on water quality and health alerts in your area.
              </Text>
              <Space.Compact style={{ width: '100%', marginTop: '12px' }}>
                <input 
                  className="newsletter-input"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button type="primary" className="newsletter-button">
                  Subscribe
                </Button>
              </Space.Compact>
            </div>
          </Col>
        </Row>

        <Divider className="footer-divider" />

        {/* Footer Bottom */}
        <Row justify="space-between" align="middle" className="footer-bottom">
          <Col xs={24} md={12}>
            <Text className="copyright">
              © {currentYear} Nirogya. All rights reserved. Made with <HeartOutlined style={{ color: '#ff4757' }} /> for community health.
            </Text>
          </Col>
          <Col xs={24} md={12} className="footer-bottom-right">
            <Space size="large" className="footer-bottom-links">
              <Link href="/privacy" className="footer-bottom-link">Privacy</Link>
              <Link href="/terms" className="footer-bottom-link">Terms</Link>
              <Link href="/cookies" className="footer-bottom-link">Cookies</Link>
              <Link href="/accessibility" className="footer-bottom-link">Accessibility</Link>
            </Space>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;