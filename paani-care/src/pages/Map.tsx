import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Select, Button, Space, Modal, Slider, Switch, Statistic, Tooltip, Divider } from 'antd';
import { 
  PlayCircleOutlined,
  PauseOutlined,
  GlobalOutlined,
  CloudOutlined,
  ThunderboltOutlined,
  CompassOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../components/ThemeProvider';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const { Option } = Select;

// Custom marker icons for different location types and statuses
const createCustomIcon = (type: string, status: string): L.DivIcon => {
  const getColor = (status: string): string => {
    switch (status) {
      case 'safe': return '#52c41a';
      case 'warning': return '#faad14';
      case 'danger': return '#ff7a45';
      case 'critical': return '#ff4d4f';
      default: return '#666';
    }
  };

  const getSymbol = (type: string): string => {
    switch (type) {
      case 'water_source': return '💧';
      case 'health_facility': return '🏥';
      case 'outbreak': return '⚠️';
      case 'safe_zone': return '✅';
      case 'monitoring_station': return '📊';
      case 'treatment_plant': return '🏭';
      default: return '📍';
    }
  };

  const color = getColor(status);
  const symbol = getSymbol(type);
  
  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">${symbol}</div>`,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component to update map view
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

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
    weatherCondition?: string;
    temperature?: number;
    humidity?: number;
    audioGuide?: string;
    category?: string;
  };
}

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  description: string;
}

// Comprehensive data for Northeast India water monitoring and health surveillance
const mockLocations: MapLocation[] = [
  // Assam Locations
  {
    id: '1',
    name: 'Guwahati Water Treatment Plant',
    coordinates: [26.1445, 91.7362],
    type: 'treatment_plant',
    status: 'safe',
    details: {
      description: 'Primary water treatment facility serving Guwahati metropolitan area with advanced filtration systems',
      lastUpdated: '2024-01-15T10:30:00Z',
      waterQuality: 'Excellent',
      phLevel: 7.2,
      turbidity: 0.5,
      contamination: [],
      population: 1200000,
      category: 'Critical Infrastructure'
    }
  },
  {
    id: '2',
    name: 'Brahmaputra River Monitoring Station',
    coordinates: [26.1833, 91.7500],
    type: 'monitoring_station',
    status: 'warning',
    details: {
      description: 'Real-time water quality monitoring station on Brahmaputra River',
      lastUpdated: '2024-01-15T11:45:00Z',
      waterQuality: 'Fair',
      phLevel: 6.8,
      turbidity: 12.5,
      contamination: ['Industrial runoff', 'Agricultural pesticides'],
      category: 'Environmental Monitoring'
    }
  },
  {
    id: '3',
    name: 'Dispur Medical College Hospital',
    coordinates: [26.1433, 91.7898],
    type: 'health_facility',
    status: 'safe',
    details: {
      description: 'State medical college hospital with specialized water-borne disease treatment unit',
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
  },
  // Meghalaya Locations
  {
    id: '5',
    name: 'Shillong Water Supply Station',
    coordinates: [25.5788, 91.8933],
    type: 'water_source',
    status: 'safe',
    details: {
      description: 'Natural spring water source serving Shillong city with minimal treatment required',
      lastUpdated: '2024-01-15T09:20:00Z',
      waterQuality: 'Excellent',
      phLevel: 7.5,
      turbidity: 0.3,
      contamination: [],
      population: 400000,
      category: 'Natural Water Source'
    }
  },
  {
    id: '6',
    name: 'East Khasi Hills Health Center',
    coordinates: [25.5623, 91.8808],
    type: 'health_facility',
    status: 'safe',
    details: {
      description: 'District health center with water quality testing laboratory',
      lastUpdated: '2024-01-15T07:30:00Z',
      cases: 2,
      category: 'Healthcare'
    }
  },
  // Manipur Locations
  {
    id: '7',
    name: 'Loktak Lake Monitoring Station',
    coordinates: [24.5595, 93.7996],
    type: 'monitoring_station',
    status: 'warning',
    details: {
      description: 'Crucial freshwater lake monitoring for pollution and biodiversity',
      lastUpdated: '2024-01-15T12:00:00Z',
      waterQuality: 'Fair',
      phLevel: 6.5,
      turbidity: 8.2,
      contamination: ['Phumdis decay', 'Agricultural runoff'],
      category: 'Environmental Conservation'
    }
  },
  {
    id: '8',
    name: 'Imphal Regional Institute of Medical Sciences',
    coordinates: [24.8170, 93.9368],
    type: 'health_facility',
    status: 'safe',
    details: {
      description: 'Premier medical institute with advanced diagnostic facilities',
      lastUpdated: '2024-01-15T14:20:00Z',
      cases: 1,
      category: 'Healthcare'
    }
  },
  // Mizoram Locations
  {
    id: '9',
    name: 'Aizawl Water Treatment Center',
    coordinates: [23.7271, 92.7176],
    type: 'treatment_plant',
    status: 'safe',
    details: {
      description: 'Hill-station water treatment facility with gravity-fed distribution',
      lastUpdated: '2024-01-15T13:15:00Z',
      waterQuality: 'Good',
      phLevel: 7.0,
      turbidity: 2.1,
      contamination: [],
      population: 320000,
      category: 'Municipal Infrastructure'
    }
  },
  // Nagaland Locations
  {
    id: '10',
    name: 'Kohima District Hospital',
    coordinates: [25.6751, 94.1086],
    type: 'health_facility',
    status: 'safe',
    details: {
      description: 'District hospital with emergency response unit for epidemic outbreaks',
      lastUpdated: '2024-01-15T11:00:00Z',
      cases: 0,
      category: 'Healthcare'
    }
  },
  // Tripura Locations
  {
    id: '11',
    name: 'Agartala Safe Water Zone',
    coordinates: [23.8315, 91.2868],
    type: 'safe_zone',
    status: 'safe',
    details: {
      description: 'Designated safe zone with purified water distribution during emergencies',
      lastUpdated: '2024-01-15T10:45:00Z',
      waterQuality: 'Excellent',
      population: 15000,
      category: 'Emergency Response'
    }
  },
  // Arunachal Pradesh Locations
  {
    id: '12',
    name: 'Itanagar Monitoring Station',
    coordinates: [27.0844, 93.6053],
    type: 'monitoring_station',
    status: 'safe',
    details: {
      description: 'High-altitude water quality monitoring for mountain streams',
      lastUpdated: '2024-01-15T15:30:00Z',
      waterQuality: 'Excellent',
      phLevel: 7.8,
      turbidity: 0.2,
      contamination: [],
      category: 'Mountain Water Systems'
    }
  },
  // Sikkim Location
  {
    id: '13',
    name: 'Gangtok Water Quality Lab',
    coordinates: [27.3314, 88.6138],
    type: 'monitoring_station',
    status: 'safe',
    details: {
      description: 'State-of-the-art water testing laboratory for Himalayan water sources',
      lastUpdated: '2024-01-15T16:00:00Z',
      waterQuality: 'Excellent',
      phLevel: 7.6,
      turbidity: 0.1,
      contamination: [],
      category: 'Research & Testing'
    }
  }
];

const Map: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDirectionsModalVisible, setIsDirectionsModalVisible] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(7);

  // Filter locations based on type and status
  const filteredLocations = mockLocations.filter(location => {
    const typeMatch = filterType === 'all' || location.type === filterType;
    const statusMatch = filterStatus === 'all' || location.status === filterStatus;
    return typeMatch && statusMatch;
  });

  // Get status color
  const getStatusColor = useCallback((status: string): string => {
    const colors = {
      safe: '#52c41a',
      warning: '#faad14',
      danger: '#ff7a45',
      critical: '#ff4d4f'
    };
    return colors[status as keyof typeof colors] || '#666';
  }, []);

  // Play audio guide
  const playAudioGuide = useCallback((location: MapLocation) => {
    if (!audioEnabled) return;
    
    setIsAudioPlaying(true);
    const utterance = new SpeechSynthesisUtterance(
      `${location.name}. ${location.details.description}. Current status: ${location.status}.`
    );
    utterance.lang = currentLanguage.code === 'hi' ? 'hi-IN' : 'en-US';
    utterance.onend = () => setIsAudioPlaying(false);
    speechSynthesis.speak(utterance);
  }, [audioEnabled, currentLanguage]);

  // Handle marker click
  const handleMarkerClick = useCallback((location: MapLocation) => {
    setSelectedLocation(location);
    if (audioEnabled) {
      playAudioGuide(location);
    }
  }, [audioEnabled, playAudioGuide]);

  // Calculate route (simplified for Leaflet)
  const calculateRoute = (destination: MapLocation) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const destLat = destination.coordinates[0];
        const destLng = destination.coordinates[1];
        
        // Calculate simple distance
        const distance = Math.sqrt(
          Math.pow(destLat - userLat, 2) + Math.pow(destLng - userLng, 2)
        ) * 111; // Rough conversion to km
        
        alert(`Approximate distance to ${destination.name}: ${distance.toFixed(1)} km`);
      });
    }
  };

  // Mock weather data fetch
  useEffect(() => {
    const fetchWeatherData = () => {
      setWeatherData({
        temperature: 24,
        humidity: 78,
        condition: 'Partly Cloudy',
        windSpeed: 12,
        description: 'Pleasant weather conditions for field monitoring'
      });
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="map-container" style={{ 
      height: '100vh', 
      background: isDark ? '#001529' : '#f0f2f5' 
    }}>
      {/* Header Controls */}
      <div className="map-header" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isDark ? 'rgba(0, 21, 41, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '15px 20px',
        borderBottom: `1px solid ${isDark ? '#1f1f1f' : '#e8e8e8'}`
      }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6} md={4}>
            <h2 style={{ 
              margin: 0, 
              color: isDark ? '#fff' : '#001529',
              fontSize: '18px'
            }}>
              Water Monitoring Map
            </h2>
          </Col>
          
          <Col xs={12} sm={6} md={4}>
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
          
          <Col xs={12} sm={6} md={4}>
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
          
          <Col xs={24} sm={6} md={4}>
            <Space>
              <Tooltip title="Zoom Level">
                <Slider
                  min={5}
                  max={15}
                  value={zoomLevel}
                  onChange={setZoomLevel}
                  style={{ width: 100 }}
                />
              </Tooltip>
              <Switch
                checked={audioEnabled}
                onChange={setAudioEnabled}
                checkedChildren={<GlobalOutlined />}
                unCheckedChildren={<GlobalOutlined />}
              />
            </Space>
          </Col>
          
          <Col xs={24} sm={24} md={8}>
            <Space wrap>
              <Button 
                icon={<CompassOutlined />} 
                onClick={() => setIsDirectionsModalVisible(true)}
                disabled={!selectedLocation}
                type="primary"
              >
                Get Directions
              </Button>
              {isAudioPlaying ? (
                <Button icon={<PauseOutlined />} onClick={() => speechSynthesis.cancel()}>
                  Stop Audio
                </Button>
              ) : (
                <Button 
                  icon={<PlayCircleOutlined />} 
                  onClick={() => selectedLocation && playAudioGuide(selectedLocation)}
                  disabled={!selectedLocation}
                >
                  Play Audio
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </div>

      {/* Weather Widget */}
      {weatherData && (
        <Card
          size="small"
          style={{
            position: 'absolute',
            top: '100px',
            right: '20px',
            zIndex: 1000,
            width: 250,
            background: isDark ? 'rgba(0, 21, 41, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDark ? '#1f1f1f' : '#e8e8e8'}`
          }}
          title={
            <Space>
              <CloudOutlined style={{ color: '#1890ff' }} />
              Weather Conditions
            </Space>
          }
        >
          <div style={{ color: isDark ? '#fff' : '#000' }}>
            <p style={{ margin: '5px 0' }}>
              <ThunderboltOutlined /> {weatherData.temperature}°C
            </p>
            <p style={{ margin: '5px 0' }}>
              💧 Humidity: {weatherData.humidity}%
            </p>
            <p style={{ margin: '5px 0' }}>
              🌪️ Wind: {weatherData.windSpeed} km/h
            </p>
            <p style={{ margin: '5px 0', fontSize: '12px' }}>
              {weatherData.description}
            </p>
          </div>
        </Card>
      )}

      {/* Statistics Panel */}
      <Card
        size="small"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          width: 300,
          background: isDark ? 'rgba(0, 21, 41, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? '#1f1f1f' : '#e8e8e8'}`
        }}
        title="Monitoring Statistics"
      >
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Statistic
              title="Total Locations"
              value={filteredLocations.length}
              valueStyle={{ color: '#1890ff', fontSize: '16px' }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Critical Alerts"
              value={filteredLocations.filter(l => l.status === 'critical').length}
              valueStyle={{ color: '#ff4d4f', fontSize: '16px' }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Safe Locations"
              value={filteredLocations.filter(l => l.status === 'safe').length}
              valueStyle={{ color: '#52c41a', fontSize: '16px' }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Active Outbreaks"
              value={filteredLocations.filter(l => l.type === 'outbreak').length}
              valueStyle={{ color: '#faad14', fontSize: '16px' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Leaflet Map */}
      <div style={{ height: '100%', marginTop: '80px' }}>
        <MapContainer
          center={[25.5788, 91.8933]}
          zoom={zoomLevel}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController center={[25.5788, 91.8933]} zoom={zoomLevel} />
          
          {/* Tile Layer - Using OpenStreetMap with different styles based on theme */}
          <TileLayer
            url={isDark 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution={isDark 
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          />

          {/* Markers for all filtered locations */}
          {filteredLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.coordinates[0], location.coordinates[1]]}
              icon={createCustomIcon(location.type, location.status)}
              eventHandlers={{
                click: () => handleMarkerClick(location)
              }}
            >
              <Popup>
                <div style={{ maxWidth: '250px', padding: '10px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#1890ff' }}>{location.name}</h3>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Type:</strong> {location.type.replace('_', ' ').toUpperCase()}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Status:</strong> 
                    <span style={{ color: getStatusColor(location.status) }}>
                      {location.status.toUpperCase()}
                    </span>
                  </p>
                  <p style={{ margin: '5px 0' }}>{location.details.description}</p>
                  {location.details.waterQuality && (
                    <p style={{ margin: '5px 0' }}>
                      <strong>Water Quality:</strong> {location.details.waterQuality}
                    </p>
                  )}
                  {location.details.cases && (
                    <p style={{ margin: '5px 0' }}>
                      <strong>Cases:</strong> {location.details.cases}
                    </p>
                  )}
                  {location.details.phLevel && (
                    <p style={{ margin: '5px 0' }}>
                      <strong>pH Level:</strong> {location.details.phLevel}
                    </p>
                  )}
                  <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                    <strong>Last Updated:</strong> {new Date(location.details.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Directions Modal */}
      <Modal
        title={`Directions to ${selectedLocation?.name}`}
        visible={isDirectionsModalVisible}
        onCancel={() => setIsDirectionsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDirectionsModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="navigate" 
            type="primary" 
            onClick={() => selectedLocation && calculateRoute(selectedLocation)}
          >
            Calculate Route
          </Button>
        ]}
      >
        {selectedLocation && (
          <div>
            <p><strong>Destination:</strong> {selectedLocation.name}</p>
            <p><strong>Coordinates:</strong> {selectedLocation.coordinates.join(', ')}</p>
            <Divider />
            <p><strong>Description:</strong> {selectedLocation.details.description}</p>
            {selectedLocation.details.waterQuality && (
              <p><strong>Water Quality:</strong> {selectedLocation.details.waterQuality}</p>
            )}
            {selectedLocation.details.cases && (
              <p><strong>Reported Cases:</strong> {selectedLocation.details.cases}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Map;