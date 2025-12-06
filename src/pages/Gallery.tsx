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

// Mock data for gallery — expanded with real Unsplash image URLs for realism
const mockGalleryData: GalleryItem[] = [
  {
    id: '1',
    title: 'Water Quality Testing at Brahmaputra River',
    description: 'Scientists conducting water quality tests along the Brahmaputra River to monitor contamination levels and ensure safe drinking water standards.',
    imageUrl: '/images/brahma.jpg',
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
    imageUrl: '/images/mobilee.jpg',
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
    imageUrl: '/images/water shop.jpg',
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
    imageUrl: '/images/school.jpg',
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
    imageUrl: '/images/treatement.jpg',
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
    imageUrl: '/images/training.jpg',
    category: 'community',
    location: 'Agartala, Tripura',
    date: '2024-01-03',
    photographer: 'Health Ministry',
    tags: ['training', 'volunteers', 'health'],
    views: 134
  },
  {
    id: '7',
    title: 'Field Sampling at Riverbank',
    description: 'Team collecting samples for bacterial analysis at a riverbank downstream from settlements.',
    imageUrl: '/images/sampling.webp',
    category: 'water_quality',
    location: 'Tezpur, Assam',
    date: '2023-12-22',
    photographer: 'Field Lab',
    tags: ['sampling', 'bacteria', 'river'],
    views: 98
  },
  {
    id: '8',
    title: 'Health Camp Setup',
    description: 'Temporary health camp set up near a market to screen local residents for waterborne illnesses.',
    imageUrl: '/images/camp.jpeg',
    category: 'health_facility',
    location: 'Jorhat, Assam',
    date: '2023-11-19',
    photographer: 'NGO Volunteers',
    tags: ['health camp', 'screening', 'community'],
    views: 212
  },
  {
    id: '9',
    title: 'Village Water Filter Demonstration',
    description: 'Demonstration of low-cost water filters for safe household drinking water.',
    imageUrl: '/images/filter.jpeg',
    category: 'community',
    location: 'Sikkim',
    date: '2023-10-30',
    photographer: 'Local NGO',
    tags: ['filter', 'household', 'safe water'],
    views: 176
  },
  {
    id: '10',
    title: 'Students Learning Hygiene',
    description: 'School children participating in a hygiene and sanitation workshop.',
    imageUrl: '/images/clean.jpg',
    category: 'awareness',
    location: 'Itanagar, Arunachal Pradesh',
    date: '2023-09-15',
    photographer: 'Education Outreach',
    tags: ['school', 'hygiene', 'kids'],
    views: 324
  },
  {
    id: '11',
    title: 'Village Water Storage Repair',
    description: 'Community repairing a local water storage tank to prevent contamination and leakage.',
    imageUrl: '/images/repair.jpg',
    category: 'infrastructure',
    location: 'Nagaland',
    date: '2023-08-05',
    photographer: 'Local Council',
    tags: ['repair', 'storage', 'infrastructure'],
    views: 142
  },
  {
    id: '12',
    title: 'Laboratory Water Analysis',
    description: 'Technicians analyzing water samples for chemical contaminants and heavy metals.',
    imageUrl: '/images/testing.jpg',
    category: 'water_quality',
    location: 'Nagaland, Dimapur',
    date: '2023-07-28',
    photographer: 'Analytical Lab',
    tags: ['lab', 'chemistry', 'analysis'],
    views: 205
  },
  {
    id: '13',
    title: 'Community Clean-up Drive',
    description: 'Volunteers removing debris and plastic from a riverbank to improve water quality.',
    imageUrl: '/images/ptna.jpg',
    category: 'community',
    location: 'Patna, Bihar',
    date: '2023-06-12',
    photographer: 'Clean Rivers',
    tags: ['cleanup', 'volunteers', 'river'],
    views: 277
  },
  {
    id: '14',
    title: 'Rural Water Delivery',
    description: 'Delivery of clean water to remote households using tankers and scheduled distribution.',
    imageUrl: '/images/tanker.jpg',
    category: 'infrastructure',
    location: 'Rural Odisha',
    date: '2023-05-02',
    photographer: 'Water Services',
    tags: ['delivery', 'access', 'rural'],
    views: 98
  },
  {
    id: '15',
    title: 'Awareness Poster Campaign',
    description: 'Locally produced awareness posters informing the public about proper sanitation practices.',
    imageUrl: '/images/poster.jpg',
    category: 'awareness',
    location: 'Kolkata, West Bengal',
    date: '2023-04-18',
    photographer: 'Public Health Dept',
    tags: ['posters', 'campaign', 'sanitation'],
    views: 210
  },
  {
    id: '16',
    title: 'Water Treatment Plant Control Room',
    description: 'Engineers monitoring systems and telemetry from the plant control room to ensure continuous safe operation.',
    imageUrl: '/images/control.jpg',
    category: 'infrastructure',
    location: 'Hyderabad, Telangana',
    date: '2023-03-09',
    photographer: 'Plant Ops',
    tags: ['control', 'plant', 'operations'],
    views: 187
  },
  {
    id: '17',
    title: 'Village Well Maintenance',
    description: 'Community members performing routine maintenance on a village well to keep it safe for drinking.',
    imageUrl: '/images/welll.jpg',
    category: 'community',
    location: 'Ranchi, Jharkhand',
    date: '2023-02-25',
    photographer: 'Local NGO',
    tags: ['well', 'maintenance', 'community'],
    views: 76
  },
  {
    id: '18',
    title: 'Public Health Workshop',
    description: 'Workshop focused on reducing diarrheal disease through improved water and sanitation practices.',
    imageUrl: '/images/health.jpg',
    category: 'awareness',
    location: 'Bangalore, Karnataka',
    date: '2023-01-20',
    photographer: 'Health Partners',
    tags: ['workshop', 'public health', 'prevention'],
    views: 198
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
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

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
    const index = galleryItems.findIndex(g => g.id === item.id);
    setCurrentIndex(index === -1 ? 0 : index);
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

  const showImageAt = (index: number) => {
    const idx = Math.max(0, Math.min(index, galleryItems.length - 1));
    setCurrentIndex(idx);
    setCurrentImage(galleryItems[idx]);
  };

  const showPrev = () => {
    if (currentIndex === null) return;
    const prev = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    showImageAt(prev);
  };

  const showNext = () => {
    if (currentIndex === null) return;
    const next = (currentIndex + 1) % galleryItems.length;
    showImageAt(next);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!previewVisible) return;
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'Escape') setPreviewVisible(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [previewVisible, currentIndex, galleryItems]);

  const downloadImage = (item: GalleryItem) => {
    // In a real implementation, this would download the actual image
    const link = document.createElement('a');
    link.href = item.imageUrl;
    link.download = `${item.title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const buildSrcSet = (url: string) => {
    // Try to build srcSet by replacing common Unsplash width parameter
    try {
      const src800 = url.replace(/w=\d+/, 'w=800');
      const src1200 = url.replace(/w=\d+/, 'w=1200');
      return `${src800} 800w, ${src1200} 1200w`;
    } catch (e) {
      return '';
    }
  };

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      const next = mockGalleryData.map((item, i) => ({
        ...item,
        id: `${item.id}-more-${Date.now()}-${i}`,
        date: new Date(Date.now() - (i * 86400000)).toISOString().slice(0,10),
        views: Math.floor(Math.random() * 200) + 50
      }));
      setGalleryItems(prev => [...prev, ...next]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="gallery-page">
      <div className="page-header">
        <div>
          <Title level={2}>
            <PictureOutlined /> Notable Contributions
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
      <div className="masonry">
        {filteredItems.map((item, idx) => (
          <div className="masonry-item" key={item.id}>
            <Card
              className="gallery-card"
              hoverable
              cover={
                <div className="image-container">
                  <img
                    src={item.imageUrl}
                    srcSet={buildSrcSet(item.imageUrl)}
                    alt={item.title}
                    loading="lazy"
                    className="gallery-image"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image'; }}
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
          </div>
        ))}
      </div>

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
            <div className="lightbox-media">
              <button className="lightbox-nav left" onClick={showPrev} aria-label="Previous image">‹</button>
              <Image
                src={currentImage.imageUrl}
                alt={currentImage.title}
                style={{ width: '100%' }}
              />
              <button className="lightbox-nav right" onClick={showNext} aria-label="Next image">›</button>
            </div>
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
                <Button style={{ marginLeft: 8 }} onClick={() => navigator.clipboard?.writeText(currentImage.imageUrl)}>
                  Copy Image URL
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Button onClick={loadMore} loading={loading}>Load more</Button>
      </div>
    </div>
  );
};

export default Gallery;