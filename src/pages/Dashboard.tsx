import React from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Progress, Timeline } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  AlertOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../components/ThemeProvider';
import './Dashboard.css';

// Mock data for demonstration
const weeklyData = [
  { day: 'Mon', cases: 12, recovered: 8, active: 4 },
  { day: 'Tue', cases: 19, recovered: 15, active: 4 },
  { day: 'Wed', cases: 8, recovered: 12, active: 0 },
  { day: 'Thu', cases: 15, recovered: 10, active: 5 },
  { day: 'Fri', cases: 22, recovered: 18, active: 4 },
  { day: 'Sat', cases: 18, recovered: 14, active: 4 },
  { day: 'Sun', cases: 25, recovered: 20, active: 5 },
];

const diseaseDistribution = [
  { name: 'Diarrhea', value: 45, color: '#8884d8' },
  { name: 'Cholera', value: 25, color: '#82ca9d' },
  { name: 'Typhoid', value: 20, color: '#ffc658' },
  { name: 'Hepatitis A', value: 10, color: '#ff7c7c' },
];

const waterQualityData = [
  { location: 'Village A', safe: 75, warning: 20, contaminated: 5 },
  { location: 'Village B', safe: 60, warning: 30, contaminated: 10 },
  { location: 'Village C', safe: 80, warning: 15, contaminated: 5 },
  { location: 'Village D', safe: 50, warning: 35, contaminated: 15 },
];

const recentAlerts = [
  {
    key: '1',
    type: 'Outbreak',
    location: 'Village A',
    severity: 'High',
    time: '2 hours ago',
    status: 'Active'
  },
  {
    key: '2',
    type: 'Water Contamination',
    location: 'Village B',
    severity: 'Medium',
    time: '5 hours ago',
    status: 'Investigating'
  },
  {
    key: '3',
    type: 'General Alert',
    location: 'Village C',
    severity: 'Low',
    time: '1 day ago',
    status: 'Resolved'
  }
];

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const alertColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const color = severity === 'High' ? 'red' : severity === 'Medium' ? 'orange' : 'blue';
        return <Tag color={color}>{severity}</Tag>;
      }
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Active' ? 'red' : status === 'Investigating' ? 'orange' : 'green';
        return <Tag color={color}>{status}</Tag>;
      }
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{t('dashboard.title')}</h1>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalCases')}
              value={1128}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.activeCases')}
              value={26}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#f5222d' }}
              suffix={<ArrowUpOutlined style={{ color: '#f5222d' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.resolvedCases')}
              value={1102}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.casesThisWeek')}
              value={119}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix={<ArrowDownOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} lg={16}>
          <Card title="Weekly Health Trends" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? '#434343' : '#f0f0f0'} 
                />
                <XAxis 
                  dataKey="day" 
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
                <Line type="monotone" dataKey="cases" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="recovered" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="active" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Disease Distribution" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diseaseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {diseaseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#1f1f1f' : '#fff',
                    border: `1px solid ${isDark ? '#434343' : '#d9d9d9'}`,
                    borderRadius: '6px',
                    color: isDark ? '#f0f0f0' : '#000'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Water Quality and Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title={t('dashboard.waterQualityOverview')} className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={waterQualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="safe" stackId="a" fill="#52c41a" />
                <Bar dataKey="warning" stackId="a" fill="#faad14" />
                <Bar dataKey="contaminated" stackId="a" fill="#f5222d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title={t('dashboard.recentActivity')}>
            <Timeline>
              <Timeline.Item color="red">
                <p>Outbreak alert in Village A</p>
                <p className="timeline-time">2 hours ago</p>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <p>Water contamination reported</p>
                <p className="timeline-time">5 hours ago</p>
              </Timeline.Item>
              <Timeline.Item color="green">
                <p>Alert resolved in Village C</p>
                <p className="timeline-time">1 day ago</p>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <p>Weekly health report generated</p>
                <p className="timeline-time">2 days ago</p>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* Recent Alerts Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Recent Alerts">
            <Table 
              columns={alertColumns} 
              dataSource={recentAlerts} 
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Hotspots Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title={t('dashboard.hotspots')}>
            <div className="hotspot-item">
              <div className="hotspot-header">
                <span className="hotspot-name">Village A</span>
                <Tag color="red">Critical</Tag>
              </div>
              <Progress percent={85} status="exception" />
              <p className="hotspot-details">12 active cases, water contamination detected</p>
            </div>
            <div className="hotspot-item">
              <div className="hotspot-header">
                <span className="hotspot-name">Village B</span>
                <Tag color="orange">High</Tag>
              </div>
              <Progress percent={65} />
              <p className="hotspot-details">8 active cases, monitoring ongoing</p>
            </div>
            <div className="hotspot-item">
              <div className="hotspot-header">
                <span className="hotspot-name">Village C</span>
                <Tag color="blue">Medium</Tag>
              </div>
              <Progress percent={35} />
              <p className="hotspot-details">3 active cases, preventive measures active</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Water Sources Status">
            <div className="water-source-item">
              <div className="source-header">
                <span>Main Well - Village A</span>
                <Tag color="red">Contaminated</Tag>
              </div>
              <p>Last tested: 2 hours ago</p>
            </div>
            <div className="water-source-item">
              <div className="source-header">
                <span>Tube Well - Village B</span>
                <Tag color="orange">Warning</Tag>
              </div>
              <p>Last tested: 5 hours ago</p>
            </div>
            <div className="water-source-item">
              <div className="source-header">
                <span>Hand Pump - Village C</span>
                <Tag color="green">Safe</Tag>
              </div>
              <p>Last tested: 1 day ago</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Resource Allocation">
            <div className="resource-item">
              <span>Medical Teams Deployed</span>
              <span className="resource-count">8/12</span>
            </div>
            <div className="resource-item">
              <span>Water Testing Kits</span>
              <span className="resource-count">15/20</span>
            </div>
            <div className="resource-item">
              <span>Emergency Supplies</span>
              <span className="resource-count">75%</span>
            </div>
            <div className="resource-item">
              <span>Ambulances Available</span>
              <span className="resource-count">6/8</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;