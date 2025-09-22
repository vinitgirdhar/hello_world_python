import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Badge, Table, Button, Modal, Form, Input, DatePicker, message, Space, Tag, Alert } from 'antd';
import { EnvironmentFilled, ExclamationCircleOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import './DiseaseMapping.css';

interface DiseaseReport {
  id: string;
  location: string;
  district: string;
  village: string;
  disease: string;
  severity: 'high' | 'medium' | 'low';
  casesCount: number;
  reportedBy: string;
  reportedDate: string;
  status: 'active' | 'contained' | 'resolved';
  coordinates: [number, number];
  description: string;
  actionTaken?: string;
}

const { Option } = Select;

const DiseaseMapping: React.FC = () => {
  const { user } = useAuth();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [diseaseReports, setDiseaseReports] = useState<DiseaseReport[]>([]);
  const [form] = Form.useForm();

  // Mock disease reports data
  useEffect(() => {
    const mockReports: DiseaseReport[] = [
      {
        id: '1',
        location: 'Guwahati Central',
        district: 'Kamrup Metro',
        village: 'Fancy Bazar',
        disease: 'Cholera',
        severity: 'high',
        casesCount: 15,
        reportedBy: 'Dr. Priya Sharma',
        reportedDate: '2024-01-15',
        status: 'active',
        coordinates: [26.1445, 91.7362],
        description: 'Sudden outbreak after water contamination in local well',
        actionTaken: 'Water supply stopped, medical camp setup'
      },
      {
        id: '2',
        location: 'Dibrugarh Town',
        district: 'Dibrugarh',
        village: 'Chowkidinghee',
        disease: 'Typhoid',
        severity: 'medium',
        casesCount: 8,
        reportedBy: 'ASHA Worker - Mamoni Das',
        reportedDate: '2024-01-14',
        status: 'contained',
        coordinates: [27.4728, 94.9120],
        description: 'Multiple cases reported in residential area',
        actionTaken: 'House-to-house surveillance initiated'
      },
      {
        id: '3',
        location: 'Silchar',
        district: 'Cachar',
        village: 'Tarapur',
        disease: 'Diarrhea',
        severity: 'low',
        casesCount: 3,
        reportedBy: 'Community Volunteer',
        reportedDate: '2024-01-13',
        status: 'resolved',
        coordinates: [24.8333, 92.7789],
        description: 'Minor cases, likely food-borne',
        actionTaken: 'Health education provided'
      },
      {
        id: '4',
        location: 'Jorhat',
        district: 'Jorhat',
        village: 'Cinnamara',
        disease: 'Hepatitis A',
        severity: 'high',
        casesCount: 12,
        reportedBy: 'Dr. Ranjan Gogoi',
        reportedDate: '2024-01-16',
        status: 'active',
        coordinates: [26.7509, 94.2037],
        description: 'Contaminated water source identified',
        actionTaken: 'Emergency vaccination drive started'
      },
      {
        id: '5',
        location: 'Tezpur',
        district: 'Sonitpur',
        village: 'Mahabhairab',
        disease: 'Gastroenteritis',
        severity: 'medium',
        casesCount: 6,
        reportedBy: 'Health Worker - Biman Kalita',
        reportedDate: '2024-01-12',
        status: 'contained',
        coordinates: [26.6341, 92.7789],
        description: 'Seasonal outbreak pattern observed',
        actionTaken: 'Water testing and purification'
      }
    ];
    setDiseaseReports(mockReports);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'medium': return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'low': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default: return null;
    }
  };

  const getStatusTag = (status: string) => {
    const colors = {
      active: 'red',
      contained: 'orange',
      resolved: 'green'
    };
    return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
  };

  const filteredReports = diseaseReports.filter(report => {
    const districtMatch = selectedDistrict === 'all' || report.district === selectedDistrict;
    const severityMatch = selectedSeverity === 'all' || report.severity === selectedSeverity;
    return districtMatch && severityMatch;
  });

  const handleReportSubmit = async (values: any) => {
    try {
      const newReport: DiseaseReport = {
        id: Date.now().toString(),
        location: values.location,
        district: values.district,
        village: values.village,
        disease: values.disease,
        severity: values.severity,
        casesCount: values.casesCount,
        reportedBy: user?.name || 'Unknown',
        reportedDate: values.reportedDate.format('YYYY-MM-DD'),
        status: 'active',
        coordinates: [26.1445, 91.7362], // Mock coordinates
        description: values.description
      };

      setDiseaseReports([...diseaseReports, newReport]);
      setIsReportModalVisible(false);
      form.resetFields();
      message.success('Disease report submitted successfully!');
    } catch (error) {
      message.error('Failed to submit report. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (text: string, record: DiseaseReport) => (
        <Space>
          <EnvironmentFilled style={{ color: getSeverityColor(record.severity) }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.village}, {record.district}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Disease',
      dataIndex: 'disease',
      key: 'disease',
      render: (text: string, record: DiseaseReport) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.casesCount} cases
          </div>
        </div>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Space>
          {getSeverityIcon(severity)}
          <span style={{ textTransform: 'capitalize' }}>{severity}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Reported By',
      dataIndex: 'reportedBy',
      key: 'reportedBy',
    },
    {
      title: 'Date',
      dataIndex: 'reportedDate',
      key: 'reportedDate',
    },
  ];

  const summaryStats = {
    total: diseaseReports.length,
    active: diseaseReports.filter(r => r.status === 'active').length,
    high: diseaseReports.filter(r => r.severity === 'high').length,
    totalCases: diseaseReports.reduce((sum, r) => sum + r.casesCount, 0)
  };

  return (
    <div className="disease-mapping">
      <div className="disease-mapping-header">
        <h2>Disease Outbreak Mapping & Surveillance</h2>
        <p>Real-time monitoring of waterborne disease outbreaks in Northeastern Region</p>
      </div>

      {/* Alert for high severity outbreaks */}
      {summaryStats.high > 0 && (
        <Alert
          message="High Severity Alert"
          description={`${summaryStats.high} high-severity outbreak(s) require immediate attention`}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}

      {/* Summary Statistics */}
      <Row gutter={[16, 16]} className="summary-cards">
        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card">
            <div className="summary-content">
              <div className="summary-number">{summaryStats.total}</div>
              <div className="summary-label">Total Reports</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card active">
            <div className="summary-content">
              <div className="summary-number">{summaryStats.active}</div>
              <div className="summary-label">Active Outbreaks</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card high-severity">
            <div className="summary-content">
              <div className="summary-number">{summaryStats.high}</div>
              <div className="summary-label">High Severity</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card">
            <div className="summary-content">
              <div className="summary-number">{summaryStats.totalCases}</div>
              <div className="summary-label">Total Cases</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Controls */}
      <Row gutter={[16, 16]} className="controls-section">
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Select District"
            style={{ width: '100%' }}
            value={selectedDistrict}
            onChange={setSelectedDistrict}
          >
            <Option value="all">All Districts</Option>
            <Option value="Kamrup Metro">Kamrup Metro</Option>
            <Option value="Dibrugarh">Dibrugarh</Option>
            <Option value="Cachar">Cachar</Option>
            <Option value="Jorhat">Jorhat</Option>
            <Option value="Sonitpur">Sonitpur</Option>
          </Select>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Filter by Severity"
            style={{ width: '100%' }}
            value={selectedSeverity}
            onChange={setSelectedSeverity}
          >
            <Option value="all">All Severities</Option>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
        </Col>
        <Col xs={24} sm={8} md={12} style={{ textAlign: 'right' }}>
          {(user?.role === 'healthcare_worker' || user?.role === 'asha_worker' || user?.role === 'district_health_official') && (
            <Button
              type="primary"
              onClick={() => setIsReportModalVisible(true)}
              style={{ backgroundColor: '#1890ff' }}
            >
              Report New Outbreak
            </Button>
          )}
        </Col>
      </Row>

      {/* Disease Reports Table */}
      <Card className="reports-table-card">
        <h3>Disease Reports</h3>
        <Table
          columns={columns}
          dataSource={filteredReports}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="expanded-row">
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <strong>Description:</strong>
                    <p>{record.description}</p>
                  </Col>
                  <Col span={12}>
                    <strong>Action Taken:</strong>
                    <p>{record.actionTaken || 'No action recorded'}</p>
                  </Col>
                </Row>
              </div>
            ),
          }}
        />
      </Card>

      {/* Map Visualization Placeholder */}
      <Card className="map-card">
        <h3>Disease Outbreak Zone Map</h3>
        <div className="map-placeholder">
          <div className="zone-legend">
            <div className="legend-item">
              <Badge color="#ff4d4f" text="High Risk Zones" />
            </div>
            <div className="legend-item">
              <Badge color="#faad14" text="Medium Risk Zones" />
            </div>
            <div className="legend-item">
              <Badge color="#52c41a" text="Low Risk Zones" />
            </div>
          </div>
          <div className="map-content">
            <p>Interactive map visualization would be implemented here</p>
            <p>Showing real-time disease outbreak zones across NER</p>
            {filteredReports.map(report => (
              <div key={report.id} className={`zone-marker ${report.severity}`}>
                <EnvironmentFilled /> {report.location}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Report Modal */}
      <Modal
        title="Report New Disease Outbreak"
        open={isReportModalVisible}
        onCancel={() => setIsReportModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleReportSubmit}
        >
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                name="district"
                label="District"
                rules={[{ required: true, message: 'Please select district' }]}
              >
                <Select placeholder="Select District">
                  <Option value="Kamrup Metro">Kamrup Metro</Option>
                  <Option value="Dibrugarh">Dibrugarh</Option>
                  <Option value="Cachar">Cachar</Option>
                  <Option value="Jorhat">Jorhat</Option>
                  <Option value="Sonitpur">Sonitpur</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="village"
                label="Village/Area"
                rules={[{ required: true, message: 'Please enter village name' }]}
              >
                <Input placeholder="Enter village or area name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="location"
            label="Specific Location"
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input placeholder="Enter specific location details" />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                name="disease"
                label="Disease"
                rules={[{ required: true, message: 'Please enter disease name' }]}
              >
                <Select placeholder="Select Disease">
                  <Option value="Cholera">Cholera</Option>
                  <Option value="Typhoid">Typhoid</Option>
                  <Option value="Diarrhea">Diarrhea</Option>
                  <Option value="Hepatitis A">Hepatitis A</Option>
                  <Option value="Gastroenteritis">Gastroenteritis</Option>
                  <Option value="Dysentery">Dysentery</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="casesCount"
                label="Number of Cases"
                rules={[{ required: true, message: 'Please enter number of cases' }]}
              >
                <Input type="number" placeholder="Enter case count" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                name="severity"
                label="Severity Level"
                rules={[{ required: true, message: 'Please select severity' }]}
              >
                <Select placeholder="Select Severity">
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reportedDate"
                label="Report Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please provide description' }]}
          >
            <Input.TextArea
              placeholder="Provide detailed description of the outbreak..."
              rows={3}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit Report
              </Button>
              <Button onClick={() => setIsReportModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiseaseMapping;