import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Image, Button, Select, Input, Tag, Modal, Typography, Space, Spin } from 'antd';
import { 
  PictureOutlined, 
  ReloadOutlined, 
  SearchOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import './Gallery.css';

const { Option } = Select;
const { Search } = Input;
const { Title, Text, Paragraph } = Typography;

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'water_quality' | 'health_facility' | 'community' | 'awareness' | 'infrastructure';
  location: string;
  date: string;
  photographer?: string;
  tags: string[];
  views: number;
}

// Mock data for gallery
const mockGalleryData: GalleryItem[] = [
  {
    id: '1',
    title: 'Water Quality Testing at Brahmaputra River',
    description: 'Scientists conducting water quality tests along the Brahmaputra River to monitor contamination levels and ensure safe drinking water standards.',
    imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
    category: 'water_quality',
    location: 'Guwahati, Assam',
    date: '2024-01-15',
    photographer: 'Dr. Rajesh Kumar',
    tags: ['water testing', 'brahmaputra', 'quality control'],
    views: 245
  },
  {
    id: '2',
    title: 'Mobile Health Unit in Rural Meghalaya',
    description: 'Mobile health unit providing medical services and health education to remote villages in Meghalaya, focusing on waterborne disease prevention.',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    category: 'health_facility',
    location: 'Shillong, Meghalaya',
    date: '2024-01-12',
    photographer: 'Health Dept. Meghalaya',
    tags: ['mobile health', 'rural healthcare', 'prevention'],
    views: 189
  },
  {
    id: '3',
    title: 'Community Water Purification Workshop',
    description: 'Local community members learning about water purification techniques and sustainable practices to prevent waterborne diseases.',
    imageUrl: 'https://images.unsplash.com/photo-1559131215-6f5d3b2e0e87?w=400&h=300&fit=crop',
    category: 'community',
    location: 'Imphal, Manipur',
    date: '2024-01-10',
    photographer: 'Community Health Worker',
    tags: ['workshop', 'community', 'education'],
    views: 167
  },
  {
    id: '4',
    title: 'Awareness Campaign in Schools',
    description: 'Educational awareness campaign in schools teaching children about hygiene practices and waterborne disease prevention.',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    category: 'awareness',
    location: 'Kohima, Nagaland',
    date: '2024-01-08',
    photographer: 'Education Ministry',
    tags: ['school', 'children', 'awareness'],
    views: 298
  },
  {
    id: '5',
    title: 'New Water Treatment Plant Installation',
    description: 'Installation of advanced water treatment infrastructure to serve rural communities and improve access to clean drinking water.',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
    category: 'infrastructure',
    location: 'Aizawl, Mizoram',
    date: '2024-01-05',
    photographer: 'Infrastructure Team',
    tags: ['infrastructure', 'water treatment', 'installation'],
    views: 156
  },
  {
    id: '6',
    title: 'Community Health Volunteers Training',
    description: 'Training session for community health volunteers on identification and management of waterborne diseases in remote areas.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    category: 'community',
    location: 'Agartala, Tripura',
    date: '2024-01-03',
    photographer: 'Health Ministry',
    tags: ['training', 'volunteers', 'health'],
    views: 134
  }
];

const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(mockGalleryData);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>(mockGalleryData);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState<GalleryItem | null>(null);

  const filterItems = useCallback(() => {
    let filtered = galleryItems;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  }, [galleryItems, selectedCategory, searchTerm]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  const refreshGallery = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'water_quality': return 'Water Quality';
      case 'health_facility': return 'Health Facility';
      case 'community': return 'Community';
      case 'awareness': return 'Awareness';
      case 'infrastructure': return 'Infrastructure';
      default: return 'General';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'water_quality': return 'blue';
      case 'health_facility': return 'green';
      case 'community': return 'orange';
      case 'awareness': return 'purple';
      case 'infrastructure': return 'red';
      default: return 'default';
    }
  };

  const openPreview = (item: GalleryItem) => {
    setCurrentImage(item);
    setPreviewVisible(true);
    // Increment view count
    const updatedItems = galleryItems.map(galleryItem => 
      galleryItem.id === item.id 
        ? { ...galleryItem, views: galleryItem.views + 1 }
        : galleryItem
    );
    setGalleryItems(updatedItems);
  };

  const downloadImage = (item: GalleryItem) => {
    // In a real implementation, this would download the actual image
    const link = document.createElement('a');
    link.href = item.imageUrl;
    link.download = `${item.title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="gallery-page">
      <div className="page-header">
        <div>
          <Title level={2}>
            <PictureOutlined /> Photo Gallery
          </Title>
          <Text>Visual documentation of water safety initiatives and community health programs</Text>
        </div>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={refreshGallery}
          loading={loading}
        >
          Refresh Gallery
        </Button>
      </div>

      {/* Filters */}
      <Card className="filters-card" size="small">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search photos, descriptions, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: '100%' }}
            >
              <Option value="all">All Categories</Option>
              <Option value="water_quality">Water Quality</Option>
              <Option value="health_facility">Health Facilities</Option>
              <Option value="community">Community</Option>
              <Option value="awareness">Awareness</Option>
              <Option value="infrastructure">Infrastructure</Option>
            </Select>
          </Col>
          <Col xs={24} md={10}>
            <Space wrap>
              <Text strong>Found: {filteredItems.length} photos</Text>
              {loading && <Spin size="small" />}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Gallery Grid */}
      <Row gutter={[16, 16]}>
        {filteredItems.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              className="gallery-card"
              hoverable
              cover={
                <div className="image-container">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    preview={false}
                    className="gallery-image"
                  />
                  <div className="image-overlay">
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={() => openPreview(item)}
                      className="overlay-button"
                    >
                      View
                    </Button>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => downloadImage(item)}
                      className="overlay-button"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              }
            >
              <div className="card-content">
                <Title level={5} className="card-title" ellipsis={{ rows: 2 }}>
                  {item.title}
                </Title>
                
                <div className="card-meta">
                  <Tag color={getCategoryColor(item.category)}>
                    {getCategoryLabel(item.category)}
                  </Tag>
                  <Text type="secondary" className="views-count">
                    <EyeOutlined /> {item.views} views
                  </Text>
                </div>

                <Paragraph 
                  ellipsis={{ rows: 2 }} 
                  type="secondary" 
                  className="card-description"
                >
                  {item.description}
                </Paragraph>

                <div className="card-footer">
                  <div className="location-date">
                    <Text type="secondary" className="location">
                      <EnvironmentOutlined /> {item.location}
                    </Text>
                    <Text type="secondary" className="date">
                      <CalendarOutlined /> {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredItems.length === 0 && (
        <div className="no-results">
          <PictureOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
          <Title level={4} type="secondary">No photos found</Title>
          <Text type="secondary">Try adjusting your search criteria or category filter</Text>
        </div>
      )}

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width="80%"
        className="image-preview-modal"
        centered
      >
        {currentImage && (
          <div className="preview-content">
            <Image
              src={currentImage.imageUrl}
              alt={currentImage.title}
              style={{ width: '100%' }}
            />
            <div className="preview-details">
              <Title level={3}>{currentImage.title}</Title>
              <Paragraph>{currentImage.description}</Paragraph>
              
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Location: </Text>
                  <Text>{currentImage.location}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Date: </Text>
                  <Text>{new Date(currentImage.date).toLocaleDateString()}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Category: </Text>
                  <Tag color={getCategoryColor(currentImage.category)}>
                    {getCategoryLabel(currentImage.category)}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Views: </Text>
                  <Text>{currentImage.views}</Text>
                </Col>
                {currentImage.photographer && (
                  <Col span={24}>
                    <Text strong>Photographer: </Text>
                    <Text>{currentImage.photographer}</Text>
                  </Col>
                )}
              </Row>

              <div className="preview-tags">
                <Text strong>Tags: </Text>
                <Space wrap>
                  {currentImage.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Space>
              </div>

              <div className="preview-actions">
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />}
                  onClick={() => downloadImage(currentImage)}
                >
                  Download Image
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Gallery;