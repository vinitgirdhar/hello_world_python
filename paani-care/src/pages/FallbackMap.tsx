import React, { useState } from 'react';
import { Card, Row, Col, Select, Button, Space, Tag, Modal, Typography } from 'antd';
import { 
  EnvironmentOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useTheme } from '../components/ThemeProvider';

const { Option } = Select;
const { Title, Text } = Typography;

interface MapLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'water_source' | 'health_facility' | 'outbreak' | 'safe_zone' | 'monitoring_station' | 'treatment_plant';
  status: 'safe' | 'warning' | 'danger' | 'critical';
  details: {
    description: string;
    lastUpdated: string;
    cases?: number;
    waterQuality?: string;
    phLevel?: number;
    turbidity?: number;
    contamination?: string[];
    population?: number;
    category?: string;
  };
}

// Mock data - same as in Map.tsx
const mockLocations: MapLocation[] = [
  {
    id: '1',
    name: 'Brahmaputra River Testing Station',
    coordinates: [26.2006, 92.9376],
    type: 'monitoring_station',
    status: 'safe',
    details: {
      description: 'Main river monitoring station for water quality assessment',
      lastUpdated: '2024-01-15T10:30:00Z',
      waterQuality: 'Good',
      phLevel: 7.2,
      turbidity: 4.5,
      contamination: [],
      category: 'Water Quality Monitoring'
    }
  },
  {
    id: '2',
    name: 'Guwahati Water Treatment Plant',
    coordinates: [26.1445, 91.7362],
    type: 'treatment_plant',
    status: 'safe',
    details: {
      description: 'Primary water treatment facility serving greater Guwahati area',
      lastUpdated: '2024-01-15T09:00:00Z',
      waterQuality: 'Excellent',
      phLevel: 7.5,
      turbidity: 0.8,
      contamination: [],
      population: 1200000,
      category: 'Municipal Infrastructure'
    }
  },
  {
    id: '3',
    name: 'Silchar District Health Center',
    coordinates: [24.8333, 92.7789],
    type: 'health_facility',
    status: 'warning',
    details: {
      description: 'District health facility monitoring water-borne disease outbreaks',
      lastUpdated: '2024-01-15T08:15:00Z',
      cases: 5,
      category: 'Healthcare'
    }
  },
  {
    id: '4',
    name: 'Chandmari Village Cholera Outbreak',
    coordinates: [26.1875, 91.7467],
    type: 'outbreak',
    status: 'critical',
    details: {
      description: 'Active cholera outbreak due to contaminated tube well water',
      lastUpdated: '2024-01-14T16:45:00Z',
      cases: 24,
      contamination: ['E. coli', 'Vibrio cholerae'],
      population: 850,
      category: 'Public Health Emergency'
    }
  }
];

const FallbackMap: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Filter locations based on type and status
  const filteredLocations = mockLocations.filter(location => {
    const typeMatch = filterType === 'all' || location.type === filterType;
    const statusMatch = filterStatus === 'all' || location.status === filterStatus;
    return typeMatch && statusMatch;
  });

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    const statusMap = {
      safe: { color: '#52c41a', icon: <CheckCircleOutlined /> },
      warning: { color: '#faad14', icon: <WarningOutlined /> },
      danger: { color: '#ff7a45', icon: <ExclamationCircleOutlined /> },
      critical: { color: '#ff4d4f', icon: <ExclamationCircleOutlined /> }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.safe;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'water_source': 'Water Source',
      'health_facility': 'Health Facility',
      'outbreak': 'Disease Outbreak',
      'safe_zone': 'Safe Zone',
      'monitoring_station': 'Monitoring Station',
      'treatment_plant': 'Treatment Plant'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location);
    setIsModalVisible(true);
  };

  return (
    <div style={{
      padding: '20px',
      background: isDark ? '#001529' : '#f0f2f5',
      minHeight: '100vh'
    }}>
      <div style={{
        marginBottom: '20px',
        padding: '20px',
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)'
      }}>
        <Title level={2} style={{ 
          color: isDark ? '#fff' : '#001529',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <GlobalOutlined /> Water Quality Monitoring Dashboard
        </Title>
        
        <Row gutter={[16, 16]} align="middle" justify="center">
          <Col xs={24} sm={12} md={6}>
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: '100%' }}
              placeholder="Filter by Type"
            >
              <Option value="all">All Types</Option>
              <Option value="water_source">Water Source</Option>
              <Option value="health_facility">Health Facility</Option>
              <Option value="outbreak">Outbreak</Option>
              <Option value="safe_zone">Safe Zone</Option>
              <Option value="monitoring_station">Monitoring Station</Option>
              <Option value="treatment_plant">Treatment Plant</Option>
            </Select>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: '100%' }}
              placeholder="Filter by Status"
            >
              <Option value="all">All Statuses</Option>
              <Option value="safe">Safe</Option>
              <Option value="warning">Warning</Option>
              <Option value="danger">Danger</Option>
              <Option value="critical">Critical</Option>
            </Select>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]}>
        {filteredLocations.map((location) => {
          const statusInfo = getStatusInfo(location.status);
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={location.id}>
              <Card
                hoverable
                onClick={() => handleLocationClick(location)}
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${statusInfo.color}`,
                  borderRadius: '10px'
                }}
                cover={
                  <div style={{
                    height: '120px',
                    background: `linear-gradient(135deg, ${statusInfo.color}20, ${statusInfo.color}10)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: statusInfo.color
                  }}>
                    <EnvironmentOutlined />
                  </div>
                }
              >
                <div style={{ color: isDark ? '#fff' : '#000' }}>
                  <Title level={5} style={{ 
                    color: isDark ? '#fff' : '#000',
                    marginBottom: '8px'
                  }}>
                    {location.name}
                  </Title>
                  
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Tag color={statusInfo.color}>
                      {statusInfo.icon} {location.status.toUpperCase()}
                    </Tag>
                    
                    <Tag>{getTypeLabel(location.type)}</Tag>
                    
                    <Text style={{ 
                      color: isDark ? '#ccc' : '#666',
                      fontSize: '12px'
                    }}>
                      {location.details.description.substring(0, 80)}...
                    </Text>
                    
                    {location.details.cases && (
                      <Text style={{ color: statusInfo.color, fontWeight: 'bold' }}>
                        Cases: {location.details.cases}
                      </Text>
                    )}
                    
                    {location.details.waterQuality && (
                      <Text style={{ color: '#1890ff' }}>
                        Quality: {location.details.waterQuality}
                      </Text>
                    )}
                    
                    <Text style={{ 
                      color: isDark ? '#666' : '#999',
                      fontSize: '10px'
                    }}>
                      Updated: {new Date(location.details.lastUpdated).toLocaleDateString()}
                    </Text>
                  </Space>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Location Details Modal */}
      <Modal
        title={selectedLocation?.name}
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedLocation && (
          <div>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div>
                <Text strong>Type: </Text>
                <Tag>{getTypeLabel(selectedLocation.type)}</Tag>
              </div>
              
              <div>
                <Text strong>Status: </Text>
                <Tag color={getStatusInfo(selectedLocation.status).color}>
                  {getStatusInfo(selectedLocation.status).icon} {selectedLocation.status.toUpperCase()}
                </Tag>
              </div>
              
              <div>
                <Text strong>Description: </Text>
                <Text>{selectedLocation.details.description}</Text>
              </div>
              
              <div>
                <Text strong>Coordinates: </Text>
                <Text>{selectedLocation.coordinates.join(', ')}</Text>
              </div>
              
              {selectedLocation.details.waterQuality && (
                <div>
                  <Text strong>Water Quality: </Text>
                  <Text>{selectedLocation.details.waterQuality}</Text>
                </div>
              )}
              
              {selectedLocation.details.phLevel && (
                <div>
                  <Text strong>pH Level: </Text>
                  <Text>{selectedLocation.details.phLevel}</Text>
                </div>
              )}
              
              {selectedLocation.details.cases && (
                <div>
                  <Text strong>Reported Cases: </Text>
                  <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                    {selectedLocation.details.cases}
                  </Text>
                </div>
              )}
              
              {selectedLocation.details.population && (
                <div>
                  <Text strong>Population Served: </Text>
                  <Text>{selectedLocation.details.population.toLocaleString()}</Text>
                </div>
              )}
              
              {selectedLocation.details.contamination && selectedLocation.details.contamination.length > 0 && (
                <div>
                  <Text strong>Contamination: </Text>
                  <Space wrap>
                    {selectedLocation.details.contamination.map((item, index) => (
                      <Tag key={index} color="red">{item}</Tag>
                    ))}
                  </Space>
                </div>
              )}
              
              <div>
                <Text strong>Last Updated: </Text>
                <Text>{new Date(selectedLocation.details.lastUpdated).toLocaleString()}</Text>
              </div>
              
              <div>
                <Text strong>Category: </Text>
                <Tag color="blue">{selectedLocation.details.category}</Tag>
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FallbackMap;