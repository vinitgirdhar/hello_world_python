import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Form, Input, Select, message, Badge, Avatar, Space, Timeline, Tag, Alert } from 'antd';
import { SendOutlined, PhoneOutlined, MessageOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import './ASHACommunication.css';

interface ASHAWorker {
  id: string;
  name: string;
  phone: string;
  district: string;
  village: string;
  status: 'active' | 'busy' | 'offline';
  specialization: string;
  lastActive: string;
  casesHandled: number;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  message: string;
  timestamp: string;
  type: 'urgent' | 'normal' | 'update';
  status: 'sent' | 'delivered' | 'read';
  relatedCase?: string;
}

interface EmergencyAlert {
  id: string;
  location: string;
  disease: string;
  severity: 'high' | 'medium' | 'low';
  casesCount: number;
  timestamp: string;
  assignedWorkers: string[];
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved';
}

const { Option } = Select;
const { TextArea } = Input;

const ASHACommunication: React.FC = () => {
  const { user } = useAuth();
  const [ashaWorkers, setAshaWorkers] = useState<ASHAWorker[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<ASHAWorker | null>(null);
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [messageForm] = Form.useForm();
  const [alertForm] = Form.useForm();

  // Mock data initialization
  useEffect(() => {
    const mockASHAWorkers: ASHAWorker[] = [
      {
        id: '1',
        name: 'Mamoni Das',
        phone: '+91-9876543210',
        district: 'Dibrugarh',
        village: 'Chowkidinghee',
        status: 'active',
        specialization: 'Maternal Health',
        lastActive: '2024-01-16T10:30:00Z',
        casesHandled: 45
      },
      {
        id: '2',
        name: 'Rekha Sharma',
        phone: '+91-9876543211',
        district: 'Kamrup Metro',
        village: 'Fancy Bazar',
        status: 'busy',
        specialization: 'Child Health',
        lastActive: '2024-01-16T09:15:00Z',
        casesHandled: 32
      },
      {
        id: '3',
        name: 'Sunita Kalita',
        phone: '+91-9876543212',
        district: 'Jorhat',
        village: 'Cinnamara',
        status: 'active',
        specialization: 'Disease Prevention',
        lastActive: '2024-01-16T11:00:00Z',
        casesHandled: 28
      },
      {
        id: '4',
        name: 'Priyanka Gogoi',
        phone: '+91-9876543213',
        district: 'Sonitpur',
        village: 'Mahabhairab',
        status: 'offline',
        specialization: 'Water Quality',
        lastActive: '2024-01-15T17:30:00Z',
        casesHandled: 51
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: user?.id || '1',
        senderName: user?.name || 'Dr. System',
        recipientId: '1',
        recipientName: 'Mamoni Das',
        message: 'Urgent: Cholera outbreak reported in Fancy Bazar area. Please coordinate with local health center immediately.',
        timestamp: '2024-01-16T10:30:00Z',
        type: 'urgent',
        status: 'read',
        relatedCase: 'CASE-001'
      },
      {
        id: '2',
        senderId: '2',
        senderName: 'Rekha Sharma',
        recipientId: user?.id || '1',
        recipientName: user?.name || 'Dr. System',
        message: 'Water testing completed in Chowkidinghee. Results show contamination. Sending report.',
        timestamp: '2024-01-16T09:45:00Z',
        type: 'update',
        status: 'delivered'
      }
    ];

    const mockEmergencyAlerts: EmergencyAlert[] = [
      {
        id: '1',
        location: 'Fancy Bazar, Kamrup Metro',
        disease: 'Cholera',
        severity: 'high',
        casesCount: 15,
        timestamp: '2024-01-16T08:00:00Z',
        assignedWorkers: ['1', '2'],
        status: 'in-progress'
      },
      {
        id: '2',
        location: 'Cinnamara, Jorhat',
        disease: 'Hepatitis A',
        severity: 'high',
        casesCount: 12,
        timestamp: '2024-01-16T07:30:00Z',
        assignedWorkers: ['3'],
        status: 'assigned'
      }
    ];

    setAshaWorkers(mockASHAWorkers);
    setMessages(mockMessages);
    setEmergencyAlerts(mockEmergencyAlerts);
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#52c41a';
      case 'busy': return '#faad14';
      case 'offline': return '#d9d9d9';
      default: return '#d9d9d9';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const handleSendMessage = async (values: any) => {
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: user?.id || '1',
        senderName: user?.name || 'System',
        recipientId: selectedWorker?.id || '',
        recipientName: selectedWorker?.name || '',
        message: values.message,
        timestamp: new Date().toISOString(),
        type: values.type,
        status: 'sent',
        relatedCase: values.relatedCase
      };

      setMessages([...messages, newMessage]);
      setIsMessageModalVisible(false);
      messageForm.resetFields();
      message.success('Message sent successfully!');
    } catch (error) {
      message.error('Failed to send message. Please try again.');
    }
  };

  const handleCreateAlert = async (values: any) => {
    try {
      const newAlert: EmergencyAlert = {
        id: Date.now().toString(),
        location: `${values.village}, ${values.district}`,
        disease: values.disease,
        severity: values.severity,
        casesCount: values.casesCount,
        timestamp: new Date().toISOString(),
        assignedWorkers: values.assignedWorkers,
        status: 'pending'
      };

      setEmergencyAlerts([...emergencyAlerts, newAlert]);
      setIsAlertModalVisible(false);
      alertForm.resetFields();
      message.success('Emergency alert created and sent to ASHA workers!');
    } catch (error) {
      message.error('Failed to create alert. Please try again.');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const activeAlerts = emergencyAlerts.filter(alert => alert.status !== 'resolved');

  return (
    <div className="asha-communication">
      <div className="asha-communication-header">
        <h2>ASHA Worker Communication Hub</h2>
        <p>Coordinate with ASHA workers for efficient healthcare response</p>
      </div>

      {/* Emergency Alerts */}
      {activeAlerts.length > 0 && (
        <Alert
          message="Active Emergency Alerts"
          description={`${activeAlerts.length} emergency alert(s) require ASHA worker coordination`}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}

      {/* Action Buttons */}
      <Row gutter={[16, 16]} className="action-buttons">
        <Col>
          <Button 
            type="primary" 
            icon={<SendOutlined />}
            onClick={() => setIsMessageModalVisible(true)}
            disabled={!selectedWorker}
          >
            Send Message
          </Button>
        </Col>
        <Col>
          <Button 
            type="primary" 
            danger
            icon={<MessageOutlined />}
            onClick={() => setIsAlertModalVisible(true)}
          >
            Create Emergency Alert
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* ASHA Workers List */}
        <Col xs={24} lg={12}>
          <Card title="ASHA Workers" className="workers-card">
            <div className="workers-list">
              {ashaWorkers.map(worker => (
                <div 
                  key={worker.id} 
                  className={`worker-item ${selectedWorker?.id === worker.id ? 'selected' : ''}`}
                  onClick={() => setSelectedWorker(worker)}
                >
                  <div className="worker-info">
                    <div className="worker-header">
                      <Avatar icon={<UserOutlined />} />
                      <div className="worker-details">
                        <span className="worker-name">{worker.name}</span>
                        <Badge 
                          color={getStatusColor(worker.status)} 
                          text={getStatusText(worker.status)} 
                        />
                      </div>
                    </div>
                    <div className="worker-location">
                      {worker.village}, {worker.district}
                    </div>
                    <div className="worker-meta">
                      <span>Specialization: {worker.specialization}</span>
                      <span>Cases: {worker.casesHandled}</span>
                    </div>
                    <div className="worker-contact">
                      <Space>
                        <Button 
                          size="small" 
                          icon={<PhoneOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`tel:${worker.phone}`);
                          }}
                        >
                          Call
                        </Button>
                        <Button 
                          size="small" 
                          icon={<MessageOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWorker(worker);
                            setIsMessageModalVisible(true);
                          }}
                        >
                          Message
                        </Button>
                      </Space>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Communication Timeline */}
        <Col xs={24} lg={12}>
          <Card title="Recent Communications" className="communications-card">
            <Timeline
              items={[
                ...messages.slice(-5).map(msg => ({
                  color: msg.type === 'urgent' ? 'red' : msg.type === 'update' ? 'blue' : 'green',
                  children: (
                    <div className="timeline-item">
                      <div className="timeline-header">
                        <span className="timeline-sender">{msg.senderName}</span>
                        <Tag color={msg.type === 'urgent' ? 'red' : msg.type === 'update' ? 'blue' : 'green'}>
                          {msg.type.toUpperCase()}
                        </Tag>
                      </div>
                      <div className="timeline-message">{msg.message}</div>
                      <div className="timeline-meta">
                        <span>{formatTime(msg.timestamp)}</span>
                        {msg.status === 'read' && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                      </div>
                    </div>
                  )
                })),
                ...emergencyAlerts.slice(-3).map(alert => ({
                  color: getSeverityColor(alert.severity),
                  children: (
                    <div className="timeline-item alert-item">
                      <div className="timeline-header">
                        <span className="timeline-sender">Emergency Alert</span>
                        <Tag color={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Tag>
                      </div>
                      <div className="timeline-message">
                        {alert.disease} outbreak in {alert.location} - {alert.casesCount} cases
                      </div>
                      <div className="timeline-meta">
                        <span>{formatTime(alert.timestamp)}</span>
                        <Tag color={alert.status === 'resolved' ? 'green' : 'orange'}>
                          {alert.status.toUpperCase()}
                        </Tag>
                      </div>
                    </div>
                  )
                }))
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Emergency Alerts Table */}
      <Card title="Emergency Alerts" className="alerts-card">
        <div className="alerts-list">
          {emergencyAlerts.map(alert => (
            <div key={alert.id} className={`alert-item ${alert.severity}`}>
              <div className="alert-header">
                <span className="alert-disease">{alert.disease}</span>
                <Tag color={getSeverityColor(alert.severity)}>
                  {alert.severity.toUpperCase()}
                </Tag>
                <Tag color={alert.status === 'resolved' ? 'green' : 'orange'}>
                  {alert.status.toUpperCase()}
                </Tag>
              </div>
              <div className="alert-location">{alert.location}</div>
              <div className="alert-details">
                <span>{alert.casesCount} cases reported</span>
                <span>{alert.assignedWorkers.length} worker(s) assigned</span>
                <span>{formatTime(alert.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Send Message Modal */}
      <Modal
        title={`Send Message to ${selectedWorker?.name || 'ASHA Worker'}`}
        open={isMessageModalVisible}
        onCancel={() => setIsMessageModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={messageForm}
          layout="vertical"
          onFinish={handleSendMessage}
        >
          <Form.Item
            name="type"
            label="Message Type"
            rules={[{ required: true, message: 'Please select message type' }]}
          >
            <Select placeholder="Select message type">
              <Option value="urgent">Urgent</Option>
              <Option value="normal">Normal</Option>
              <Option value="update">Update</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="relatedCase"
            label="Related Case (Optional)"
          >
            <Input placeholder="Enter case ID if applicable" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please enter your message' }]}
          >
            <TextArea
              placeholder="Enter your message..."
              rows={4}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                Send Message
              </Button>
              <Button onClick={() => setIsMessageModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Alert Modal */}
      <Modal
        title="Create Emergency Alert"
        open={isAlertModalVisible}
        onCancel={() => setIsAlertModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={alertForm}
          layout="vertical"
          onFinish={handleCreateAlert}
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
                <Input placeholder="Enter village name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                name="disease"
                label="Disease"
                rules={[{ required: true, message: 'Please select disease' }]}
              >
                <Select placeholder="Select Disease">
                  <Option value="Cholera">Cholera</Option>
                  <Option value="Typhoid">Typhoid</Option>
                  <Option value="Hepatitis A">Hepatitis A</Option>
                  <Option value="Diarrhea">Diarrhea</Option>
                  <Option value="Gastroenteritis">Gastroenteritis</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="casesCount"
                label="Number of Cases"
                rules={[{ required: true, message: 'Please enter case count' }]}
              >
                <Input type="number" placeholder="Enter case count" />
              </Form.Item>
            </Col>
          </Row>

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

          <Form.Item
            name="assignedWorkers"
            label="Assign ASHA Workers"
            rules={[{ required: true, message: 'Please assign at least one worker' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select ASHA workers"
              optionLabelProp="label"
            >
              {ashaWorkers.map(worker => (
                <Option key={worker.id} value={worker.id} label={worker.name}>
                  {worker.name} - {worker.village}, {worker.district}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" danger htmlType="submit">
                Create Alert
              </Button>
              <Button onClick={() => setIsAlertModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ASHACommunication;