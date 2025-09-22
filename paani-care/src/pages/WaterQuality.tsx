import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Row, 
  Col,
  Statistic,
  Progress,
  message,
  Switch
} from 'antd';
import { 
  PlusOutlined, 
  SyncOutlined, 
  ExperimentOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../components/ThemeProvider';
import type { ColumnsType } from 'antd/es/table';
import { WaterQualityData } from '../types';
import './WaterQuality.css';

const { Option } = Select;
const { TextArea } = Input;

// Mock data
const waterSources: WaterQualityData[] = [
  {
    id: '1',
    sourceId: 'WS001',
    sourceName: 'Main Well - Village A',
    location: { lat: 26.1445, lng: 91.7362, address: 'Village A, Assam' },
    parameters: {
      turbidity: 8.5,
      pH: 6.2,
      bacterialCount: 150,
      chlorine: 0.3,
      temperature: 28
    },
    status: 'contaminated',
    timestamp: new Date('2024-01-15T10:30:00'),
    testedBy: 'IoT Sensor'
  },
  {
    id: '2',
    sourceId: 'WS002',
    sourceName: 'Tube Well - Village B',
    location: { lat: 26.1545, lng: 91.7462, address: 'Village B, Assam' },
    parameters: {
      turbidity: 3.2,
      pH: 7.1,
      bacterialCount: 45,
      chlorine: 0.8,
      temperature: 26
    },
    status: 'warning',
    timestamp: new Date('2024-01-15T09:15:00'),
    testedBy: 'Manual Test'
  },
  {
    id: '3',
    sourceId: 'WS003',
    sourceName: 'Hand Pump - Village C',
    location: { lat: 26.1345, lng: 91.7262, address: 'Village C, Assam' },
    parameters: {
      turbidity: 1.8,
      pH: 7.4,
      bacterialCount: 15,
      chlorine: 1.2,
      temperature: 25
    },
    status: 'safe',
    timestamp: new Date('2024-01-15T08:00:00'),
    testedBy: 'Manual Test'
  }
];

// Mock trend data
const trendData = [
  { time: '00:00', pH: 7.2, turbidity: 2.1, bacterial: 20 },
  { time: '04:00', pH: 7.1, turbidity: 2.5, bacterial: 25 },
  { time: '08:00', pH: 6.9, turbidity: 3.2, bacterial: 35 },
  { time: '12:00', pH: 6.8, turbidity: 4.1, bacterial: 45 },
  { time: '16:00', pH: 6.5, turbidity: 5.8, bacterial: 65 },
  { time: '20:00', pH: 6.2, turbidity: 7.2, bacterial: 85 },
];

const WaterQuality: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sources, setSources] = useState<WaterQualityData[]>(waterSources);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const columns: ColumnsType<WaterQualityData> = [
    {
      title: 'Source Name',
      dataIndex: 'sourceName',
      key: 'sourceName',
      render: (name: string, record: WaterQualityData) => (
        <div>
          <div className="source-name">{name}</div>
          <div className="source-id">ID: {record.sourceId}</div>
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: any) => location.address,
    },
    {
      title: 'pH Level',
      dataIndex: 'parameters',
      key: 'pH',
      render: (params: any) => (
        <span className={params.pH >= 6.5 && params.pH <= 8.5 ? 'param-safe' : 'param-danger'}>
          {params.pH}
        </span>
      ),
    },
    {
      title: 'Turbidity (NTU)',
      dataIndex: 'parameters',
      key: 'turbidity',
      render: (params: any) => (
        <span className={params.turbidity <= 5 ? 'param-safe' : 'param-danger'}>
          {params.turbidity}
        </span>
      ),
    },
    {
      title: 'Bacterial Count',
      dataIndex: 'parameters',
      key: 'bacterialCount',
      render: (params: any) => (
        <span className={params.bacterialCount <= 50 ? 'param-safe' : 'param-danger'}>
          {params.bacterialCount} CFU/ml
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag 
          color={
            status === 'safe' ? 'green' : 
            status === 'warning' ? 'orange' : 'red'
          }
          icon={
            status === 'safe' ? <CheckCircleOutlined /> : 
            status === 'warning' ? <ExclamationCircleOutlined /> : <AlertOutlined />
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Tested',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (date: Date) => (
        <div>
          <div>{new Date(date).toLocaleDateString()}</div>
          <div className="test-time">{new Date(date).toLocaleTimeString()}</div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<ExperimentOutlined />}
            onClick={() => viewDetails(record)}
          >
            Details
          </Button>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const viewDetails = (source: WaterQualityData) => {
    Modal.info({
      title: `Water Quality Details - ${source.sourceName}`,
      content: (
        <div className="water-details">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic title="pH Level" value={source.parameters.pH} precision={1} />
            </Col>
            <Col span={12}>
              <Statistic title="Turbidity" value={source.parameters.turbidity} suffix="NTU" precision={1} />
            </Col>
            <Col span={12}>
              <Statistic title="Bacterial Count" value={source.parameters.bacterialCount} suffix="CFU/ml" />
            </Col>
            <Col span={12}>
              <Statistic title="Chlorine" value={source.parameters.chlorine} suffix="mg/L" precision={1} />
            </Col>
          </Row>
          <div style={{ marginTop: 16 }}>
            <p><strong>Location:</strong> {source.location.address}</p>
            <p><strong>Tested By:</strong> {source.testedBy}</p>
            <p><strong>Test Date:</strong> {new Date(source.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ),
      width: 600,
    });
  };

  const handleSubmit = (values: any) => {
    const newSource: WaterQualityData = {
      id: Date.now().toString(),
      sourceId: `WS${Date.now().toString().slice(-3)}`,
      sourceName: values.sourceName,
      location: {
        lat: 26.1445,
        lng: 91.7362,
        address: values.location
      },
      parameters: {
        turbidity: values.turbidity,
        pH: values.pH,
        bacterialCount: values.bacterialCount,
        chlorine: values.chlorine,
        temperature: values.temperature
      },
      status: getWaterStatus(values),
      timestamp: new Date(),
      testedBy: values.testedBy || 'Manual Test'
    };

    setSources([newSource, ...sources]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Water test result added successfully');
  };

  const getWaterStatus = (values: any): 'safe' | 'warning' | 'contaminated' => {
    const { pH, turbidity, bacterialCount } = values;
    
    if (pH < 6.5 || pH > 8.5 || turbidity > 5 || bacterialCount > 100) {
      return 'contaminated';
    } else if (pH < 7 || pH > 8 || turbidity > 3 || bacterialCount > 50) {
      return 'warning';
    }
    return 'safe';
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const refreshData = () => {
    message.loading('Refreshing water quality data...', 1);
    // Simulate data refresh
    setTimeout(() => {
      message.success('Data refreshed successfully');
    }, 1000);
  };

  const safeCount = sources.filter(s => s.status === 'safe').length;
  const warningCount = sources.filter(s => s.status === 'warning').length;
  const contaminatedCount = sources.filter(s => s.status === 'contaminated').length;

  return (
    <div className="water-quality">
      <div className="page-header">
        <div>
          <h1>{t('water.testResults')}</h1>
          <p>Monitor water quality across all sources in real-time</p>
        </div>
        <Space>
          <div className="auto-refresh">
            <span>Auto Refresh:</span>
            <Switch 
              checked={autoRefresh} 
              onChange={setAutoRefresh}
              size="small"
            />
          </div>
          <Button 
            icon={<SyncOutlined />} 
            onClick={refreshData}
          >
            Refresh
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showModal}
            size="large"
          >
            {t('water.addTest')}
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Safe Sources"
              value={safeCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={Math.round((safeCount / sources.length) * 100)} 
              strokeColor="#52c41a"
              showInfo={false}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Warning Sources"
              value={warningCount}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <Progress 
              percent={Math.round((warningCount / sources.length) * 100)} 
              strokeColor="#faad14"
              showInfo={false}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Contaminated Sources"
              value={contaminatedCount}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
            <Progress 
              percent={Math.round((contaminatedCount / sources.length) * 100)} 
              strokeColor="#f5222d"
              showInfo={false}
            />
          </Card>
        </Col>
      </Row>

      {/* Water Quality Trends Chart */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Water Quality Trends (24 Hours)" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? '#434343' : '#f0f0f0'} 
                />
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: isDark ? '#f0f0f0' : '#666' }}
                  axisLine={{ stroke: isDark ? '#434343' : '#d9d9d9' }}
                />
                <YAxis 
                  tick={{ fill: isDark ? '#f0f0f0' : '#666' }}
                  axisLine={{ stroke: isDark ? '#434343' : '#d9d9d9' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#1f1f1f' : '#fff',
                    border: `1px solid ${isDark ? '#434343' : '#d9d9d9'}`,
                    borderRadius: '6px',
                    color: isDark ? '#f0f0f0' : '#000'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="pH" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="turbidity" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="bacterial" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Water Sources Table */}
      <Card title="Water Sources">
        <Table 
          columns={columns} 
          dataSource={sources}
          rowKey="id"
          pagination={{
            total: sources.length,
            pageSize: 10,
            showSizeChanger: true,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add Test Result Modal */}
      <Modal
        title={t('water.addTest')}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={t('water.sourceName')}
                name="sourceName"
                rules={[{ required: true, message: 'Please enter source name' }]}
              >
                <Input placeholder="e.g., Main Well - Village A" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: 'Please enter location' }]}
              >
                <Input placeholder="Village/Area address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Form.Item
                label={t('water.pH')}
                name="pH"
                rules={[{ required: true, message: 'Please enter pH level' }]}
              >
                <InputNumber 
                  placeholder="6.5 - 8.5" 
                  style={{ width: '100%' }}
                  min={0}
                  max={14}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label={t('water.turbidity')}
                name="turbidity"
                rules={[{ required: true, message: 'Please enter turbidity' }]}
              >
                <InputNumber 
                  placeholder="NTU" 
                  style={{ width: '100%' }}
                  min={0}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label={t('water.bacterial')}
                name="bacterialCount"
                rules={[{ required: true, message: 'Please enter bacterial count' }]}
              >
                <InputNumber 
                  placeholder="CFU/ml" 
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Form.Item
                label={t('water.chlorine')}
                name="chlorine"
                rules={[{ required: true, message: 'Please enter chlorine level' }]}
              >
                <InputNumber 
                  placeholder="mg/L" 
                  style={{ width: '100%' }}
                  min={0}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label={t('water.temperature')}
                name="temperature"
                rules={[{ required: true, message: 'Please enter temperature' }]}
              >
                <InputNumber 
                  placeholder="°C" 
                  style={{ width: '100%' }}
                  min={0}
                  max={50}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Test Method"
                name="testMethod"
              >
                <Select placeholder="Select test method">
                  <Option value="manual">Manual Test Kit</Option>
                  <Option value="iot_sensor">IoT Sensor</Option>
                  <Option value="laboratory">Laboratory Analysis</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Tested By"
            name="testedBy"
          >
            <Input placeholder="Name of person/device conducting test" />
          </Form.Item>

          <Form.Item
            label="Additional Notes"
            name="notes"
          >
            <TextArea 
              rows={3} 
              placeholder="Any additional observations or notes"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Test Result
              </Button>
              <Button onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WaterQuality;