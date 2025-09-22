import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Button, Select, Input, Tag, Typography, Space, Spin, Avatar } from 'antd';
import { 
  GlobalOutlined, 
  ReloadOutlined, 
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  LinkOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import './News.css';

const { Option } = Select;
const { Search } = Input;
const { Title, Text, Paragraph } = Typography;

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: {
    name: string;
    url?: string;
  };
  author?: string;
  category: 'health' | 'water_quality' | 'government' | 'research' | 'community';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
}

// Mock news data - In real implementation, this would come from news APIs
const mockNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'WHO Reports 30% Reduction in Waterborne Diseases in Northeast India',
    description: 'World Health Organization acknowledges significant progress in combating waterborne diseases across northeastern states through improved surveillance systems.',
    content: 'The World Health Organization has reported a remarkable 30% reduction in waterborne diseases across Northeast India over the past year, attributing this success to enhanced surveillance systems and community health initiatives...',
    url: 'https://www.who.int/news/northeast-india-waterborne-diseases',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop',
    publishedAt: '2024-01-15T10:30:00Z',
    source: {
      name: 'WHO India',
      url: 'https://www.who.int'
    },
    author: 'Dr. Sarah Johnson',
    category: 'health',
    priority: 'high',
    tags: ['WHO', 'reduction', 'surveillance', 'northeast']
  },
  {
    id: '2',
    title: 'Assam Government Launches Advanced Water Quality Monitoring System',
    description: 'State government introduces real-time water quality monitoring across 500 locations to ensure safe drinking water for rural communities.',
    content: 'The Assam government has launched a comprehensive water quality monitoring system covering 500 strategic locations across the state...',
    url: 'https://www.assamgov.in/water-quality-monitoring',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=200&fit=crop',
    publishedAt: '2024-01-14T14:20:00Z',
    source: {
      name: 'Assam Government',
      url: 'https://www.assamgov.in'
    },
    author: 'Public Health Department',
    category: 'government',
    priority: 'medium',
    tags: ['assam', 'monitoring', 'government', 'rural']
  },
  {
    id: '3',
    title: 'New Research Identifies Early Warning Indicators for Cholera Outbreaks',
    description: 'Scientists at IIT Guwahati develop machine learning model to predict cholera outbreaks 72 hours in advance using environmental data.',
    content: 'Researchers at the Indian Institute of Technology Guwahati have developed a groundbreaking machine learning model that can predict cholera outbreaks up to 72 hours in advance...',
    url: 'https://www.iitg.ac.in/research/cholera-prediction',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
    publishedAt: '2024-01-13T09:15:00Z',
    source: {
      name: 'IIT Guwahati',
      url: 'https://www.iitg.ac.in'
    },
    author: 'Dr. Amit Kumar Singh',
    category: 'research',
    priority: 'high',
    tags: ['research', 'machine learning', 'prediction', 'cholera']
  },
  {
    id: '4',
    title: 'Community Health Workers Complete Training in Waterborne Disease Management',
    description: '500 community health workers across Northeast complete intensive training program on identification and management of waterborne diseases.',
    content: 'A comprehensive training program for community health workers has been successfully completed across all northeastern states...',
    url: 'https://www.healthministry.gov.in/community-training',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop',
    publishedAt: '2024-01-12T16:45:00Z',
    source: {
      name: 'Ministry of Health',
      url: 'https://www.healthministry.gov.in'
    },
    author: 'Community Health Division',
    category: 'community',
    priority: 'medium',
    tags: ['training', 'community', 'health workers', 'management']
  },
  {
    id: '5',
    title: 'URGENT: Cholera Outbreak Reported in Remote Meghalaya Village',
    description: 'Health authorities confirm 15 cases of cholera in remote village; immediate containment measures implemented.',
    content: 'Health authorities have confirmed a cholera outbreak in a remote village in Meghalaya with 15 confirmed cases. Immediate containment and treatment measures have been implemented...',
    url: 'https://www.meghhealth.gov.in/urgent-cholera-outbreak',
    imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=200&fit=crop',
    publishedAt: '2024-01-11T08:30:00Z',
    source: {
      name: 'Meghalaya Health Dept',
      url: 'https://www.meghhealth.gov.in'
    },
    author: 'State Epidemiologist',
    category: 'health',
    priority: 'urgent',
    tags: ['urgent', 'outbreak', 'meghalaya', 'containment']
  }
];

const News: React.FC = () => {
  const [newsArticles] = useState<NewsArticle[]>(mockNewsData);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>(mockNewsData);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const filterArticles = useCallback(() => {
    let filtered = newsArticles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(article => article.priority === selectedPriority);
    }

    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort by priority and date
    filtered.sort((a, b) => {
      const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
      const priorityDiff = (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                          (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
      
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    setFilteredArticles(filtered);
  }, [newsArticles, selectedCategory, selectedPriority, searchTerm]);

  useEffect(() => {
    filterArticles();
  }, [filterArticles]);

  const refreshNews = () => {
    setLoading(true);
    // Simulate API call to fetch latest news
    setTimeout(() => {
      // In real implementation, this would fetch from news APIs like:
      // - NewsAPI
      // - Government health department feeds
      // - WHO RSS feeds
      // - Local news sources
      setLoading(false);
    }, 1500);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'health': return 'Health';
      case 'water_quality': return 'Water Quality';
      case 'government': return 'Government';
      case 'research': return 'Research';
      case 'community': return 'Community';
      default: return 'General';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'green';
      case 'water_quality': return 'blue';
      case 'government': return 'purple';
      case 'research': return 'orange';
      case 'community': return 'cyan';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'blue';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <ExclamationCircleOutlined />;
      case 'high': return <FireOutlined />;
      case 'medium': return <ClockCircleOutlined />;
      case 'low': return <ClockCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const openArticle = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="news-page">
      <div className="page-header">
        <div>
          <Title level={2}>
            <GlobalOutlined /> Latest News
          </Title>
          <Text>Stay updated with the latest developments in water safety and public health</Text>
        </div>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={refreshNews}
          loading={loading}
        >
          Refresh News
        </Button>
      </div>

      {/* Filters */}
      <Card className="filters-card" size="small">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: '100%' }}
            >
              <Option value="all">All Categories</Option>
              <Option value="health">Health</Option>
              <Option value="water_quality">Water Quality</Option>
              <Option value="government">Government</Option>
              <Option value="research">Research</Option>
              <Option value="community">Community</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={selectedPriority}
              onChange={setSelectedPriority}
              style={{ width: '100%' }}
            >
              <Option value="all">All Priority</Option>
              <Option value="urgent">Urgent</Option>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Space wrap>
              <Text strong>Found: {filteredArticles.length} articles</Text>
              {loading && <Spin size="small" />}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* News Articles */}
      <Row gutter={[16, 16]}>
        {filteredArticles.map((article) => (
          <Col xs={24} lg={12} key={article.id}>
            <Card
              className={`news-card priority-${article.priority}`}
              hoverable
              onClick={() => openArticle(article.url)}
            >
              <div className="news-content">
                {article.imageUrl && (
                  <div className="news-image">
                    <img src={article.imageUrl} alt={article.title} />
                  </div>
                )}
                
                <div className="news-body">
                  <div className="news-header">
                    <div className="news-meta">
                      <Tag 
                        color={getPriorityColor(article.priority)}
                        icon={getPriorityIcon(article.priority)}
                      >
                        {article.priority.toUpperCase()}
                      </Tag>
                      <Tag color={getCategoryColor(article.category)}>
                        {getCategoryLabel(article.category)}
                      </Tag>
                    </div>
                    <Text type="secondary" className="news-date">
                      <CalendarOutlined /> {formatDate(article.publishedAt)}
                    </Text>
                  </div>

                  <Title level={4} className="news-title" ellipsis={{ rows: 2 }}>
                    {article.title}
                  </Title>

                  <Paragraph 
                    ellipsis={{ rows: 3 }} 
                    className="news-description"
                  >
                    {article.description}
                  </Paragraph>

                  <div className="news-footer">
                    <div className="news-source">
                      <Avatar 
                        size="small" 
                        icon={<UserOutlined />} 
                        className="source-avatar"
                      />
                      <div className="source-info">
                        <Text strong>{article.source.name}</Text>
                        {article.author && (
                          <Text type="secondary" className="author">
                            by {article.author}
                          </Text>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      type="link" 
                      icon={<LinkOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        openArticle(article.url);
                      }}
                    >
                      Read More
                    </Button>
                  </div>

                  <div className="news-tags">
                    <Space wrap>
                      {article.tags.slice(0, 3).map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                      {article.tags.length > 3 && (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          +{article.tags.length - 3} more
                        </Text>
                      )}
                    </Space>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredArticles.length === 0 && (
        <div className="no-results">
          <GlobalOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
          <Title level={4} type="secondary">No news articles found</Title>
          <Text type="secondary">Try adjusting your search criteria or filters</Text>
        </div>
      )}

      {/* News Sources Info */}
      <Card className="sources-info" title="News Sources" size="small">
        <Text type="secondary">
          News articles are aggregated from official sources including WHO, Government Health Departments, 
          Research Institutions, and verified news outlets to ensure accuracy and reliability.
        </Text>
      </Card>
    </div>
  );
};

export default News;