import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Form, 
  Input, 
  Button, 
  Space,
  Divider,
  notification
} from 'antd';
import { 
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  FacebookOutlined
} from '@ant-design/icons';
import { useTheme } from '../components/ThemeProvider';
import './Contact.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Contact: React.FC = () => {
  const { isDark } = useTheme();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      form.resetFields();
      notification.success({
        message: 'Message Sent!',
        description: 'Thank you for contacting us. We will get back to you within 24 hours.',
        duration: 5,
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <MailOutlined />,
      title: 'Email',
      description: 'Get in touch with us',
      value: 'contact@paanicare.org',
      link: 'mailto:contact@paanicare.org'
    },
    {
      icon: <PhoneOutlined />,
      title: 'Phone',
      description: '24/7 Emergency Hotline',
      value: '+91 98765 43210',
      link: 'tel:+919876543210'
    },
    {
      icon: <EnvironmentOutlined />,
      title: 'Head Office',
      description: 'Visit our main office',
      value: 'Block A, Tech Park, Bangalore, Karnataka 560001',
      link: 'https://maps.google.com'
    },
    {
      icon: <ClockCircleOutlined />,
      title: 'Working Hours',
      description: 'When we are available',
      value: 'Mon-Fri: 9AM-6PM\nSat: 9AM-2PM',
      link: null
    }
  ];

  const offices = [
    {
      city: 'Bangalore',
      type: 'Head Office',
      address: 'Block A, Tech Park, Bangalore, Karnataka 560001',
      phone: '+91 98765 43210',
      email: 'bangalore@paanicare.org'
    },
    {
      city: 'Delhi',
      type: 'Regional Office',
      address: 'Sector 18, Connaught Place, New Delhi 110001',
      phone: '+91 98765 43211',
      email: 'delhi@paanicare.org'
    },
    {
      city: 'Mumbai',
      type: 'Field Office',
      address: 'Andheri East, Mumbai, Maharashtra 400069',
      phone: '+91 98765 43212',
      email: 'mumbai@paanicare.org'
    },
    {
      city: 'Chennai',
      type: 'Support Center',
      address: 'Anna Nagar, Chennai, Tamil Nadu 600040',
      phone: '+91 98765 43213',
      email: 'chennai@paanicare.org'
    }
  ];

  const socialLinks = [
    {
      icon: <LinkedinOutlined />,
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/paanicare',
      color: '#0077b5'
    },
    {
      icon: <TwitterOutlined />,
      name: 'Twitter',
      url: 'https://twitter.com/paanicare',
      color: '#1da1f2'
    },
    {
      icon: <FacebookOutlined />,
      name: 'Facebook',
      url: 'https://facebook.com/paanicare',
      color: '#4267B2'
    },
    {
      icon: <GlobalOutlined />,
      name: 'Website',
      url: 'https://paanicare.org',
      color: '#52c41a'
    }
  ];

  return (
    <div className={`contact-page ${isDark ? 'dark' : ''}`}>
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <div className="container">
            <Row justify="center">
              <Col xs={24} md={16} lg={12}>
                <Title level={1} className="hero-title">
                  Get in Touch
                </Title>
                <Paragraph className="hero-subtitle">
                  Ready to transform water surveillance in your community? 
                  We're here to help you implement cutting-edge technology 
                  for safer water systems.
                </Paragraph>
              </Col>
            </Row>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="contact-info-section">
        <div className="container">
          <Row justify="center">
            <Col xs={24} lg={20}>
              <Title level={2} className="section-title">
                Contact Information
              </Title>
              <Row gutter={[24, 24]}>
                {contactInfo.map((info, index) => (
                  <Col xs={24} sm={12} lg={6} key={index}>
                    <Card className="contact-info-card" hoverable>
                      <div className="contact-info-item">
                        <div className="contact-icon">
                          {info.icon}
                        </div>
                        <Title level={4} className="contact-title">
                          {info.title}
                        </Title>
                        <Text className="contact-description">
                          {info.description}
                        </Text>
                        <Paragraph className="contact-value">
                          {info.link ? (
                            <a href={info.link} className="contact-link">
                              {info.value}
                            </a>
                          ) : (
                            info.value
                          )}
                        </Paragraph>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="contact-form-section">
        <div className="container">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <Card className="contact-form-card">
                <Title level={3} className="form-title">
                  Send us a Message
                </Title>
                <Paragraph className="form-description">
                  Have a question or want to discuss how Paani Care can help your organization? 
                  Fill out the form below and we'll get back to you within 24 hours.
                </Paragraph>
                
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  className="contact-form"
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                      >
                        <Input placeholder="John" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                      >
                        <Input placeholder="Doe" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input placeholder="john.doe@example.com" />
                  </Form.Item>
                  
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                  >
                    <Input placeholder="+91 98765 43210" />
                  </Form.Item>
                  
                  <Form.Item
                    name="organization"
                    label="Organization"
                  >
                    <Input placeholder="Your Organization" />
                  </Form.Item>
                  
                  <Form.Item
                    name="subject"
                    label="Subject"
                    rules={[{ required: true, message: 'Please enter a subject' }]}
                  >
                    <Input placeholder="How can we help you?" />
                  </Form.Item>
                  
                  <Form.Item
                    name="message"
                    label="Message"
                    rules={[{ required: true, message: 'Please enter your message' }]}
                  >
                    <TextArea 
                      rows={6} 
                      placeholder="Tell us about your water surveillance needs..." 
                    />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      block
                    >
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card className="map-card">
                <Title level={4} className="map-title">
                  Visit Our Head Office
                </Title>
                <div className="map-placeholder">
                  {/* Map placeholder - In a real app, you'd integrate with Google Maps */}
                  <div className="map-content">
                    <EnvironmentOutlined className="map-icon" />
                    <Title level={4}>Interactive Map</Title>
                    <Paragraph>
                      Block A, Tech Park<br />
                      Bangalore, Karnataka 560001
                    </Paragraph>
                    <Button type="primary" icon={<EnvironmentOutlined />}>
                      Get Directions
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Office Locations */}
      <section className="office-locations">
        <div className="container">
          <Title level={2} className="section-title">
            Our Offices
          </Title>
          <Paragraph className="section-description">
            We have offices across India to better serve our clients and communities.
          </Paragraph>
          
          <Row gutter={[24, 24]}>
            {offices.map((office, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="office-card" hoverable>
                  <div className="office-header">
                    <Title level={4} className="office-city">
                      {office.city}
                    </Title>
                    <Text className="office-type">{office.type}</Text>
                  </div>
                  
                  <Divider />
                  
                  <div className="office-details">
                    <div className="office-detail">
                      <EnvironmentOutlined className="detail-icon" />
                      <Text>{office.address}</Text>
                    </div>
                    
                    <div className="office-detail">
                      <PhoneOutlined className="detail-icon" />
                      <a href={`tel:${office.phone.replace(/\s/g, '')}`}>
                        {office.phone}
                      </a>
                    </div>
                    
                    <div className="office-detail">
                      <MailOutlined className="detail-icon" />
                      <a href={`mailto:${office.email}`}>
                        {office.email}
                      </a>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Social Media and CTA */}
      <section className="contact-social">
        <div className="container">
          <Card className="social-card">
            <Row justify="center">
              <Col xs={24} md={16} lg={12}>
                <Title level={3} className="social-title">
                  Connect With Us
                </Title>
                <Paragraph className="social-description">
                  Follow us on social media for the latest updates on water surveillance 
                  technology and community health initiatives.
                </Paragraph>
                
                <Space size="large" className="social-links">
                  {socialLinks.map((social, index) => (
                    <Button
                      key={index}
                      type="primary"
                      shape="circle"
                      size="large"
                      icon={social.icon}
                      style={{ backgroundColor: social.color, borderColor: social.color }}
                      onClick={() => window.open(social.url, '_blank')}
                    />
                  ))}
                </Space>
                
                <Divider />
                
                <div className="emergency-contact">
                  <Title level={4} className="emergency-title">
                    Emergency Response
                  </Title>
                  <Paragraph>
                    For urgent water contamination alerts or emergency support:
                  </Paragraph>
                  <Button 
                    type="primary" 
                    danger 
                    size="large"
                    icon={<PhoneOutlined />}
                  >
                    Emergency Hotline: +91 98765 43200
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Contact;