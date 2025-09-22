import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Space,
  Modal,
  InputNumber,
  Checkbox,
  message
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import type { HealthData as HealthDataType } from '../types';
import './HealthData.css';

const { Option } = Select;
const { TextArea } = Input;

// Mock data
const healthCases: HealthDataType[] = [
  {
    id: '1',
    patientId: 'P001',
    symptoms: ['diarrhea', 'fever', 'vomiting'],
    severity: 'high',
    reportedBy: 'Dr. Smith',
    location: { lat: 26.1445, lng: 91.7362, address: 'Village A, Assam' },
    timestamp: new Date('2024-01-15'),
    diseaseType: 'diarrhea'
  },
  {
    id: '2',
    patientId: 'P002',
    symptoms: ['diarrhea', 'dehydration'],
    severity: 'medium',
    reportedBy: 'Nurse Johnson',
    location: { lat: 26.1545, lng: 91.7462, address: 'Village B, Assam' },
    timestamp: new Date('2024-01-14'),
    diseaseType: 'cholera'
  }
];

const HealthData: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cases, setCases] = useState<HealthDataType[]>(healthCases);
  const [selectedCase, setSelectedCase] = useState<HealthDataType | null>(null);

  const symptomsOptions = [
    'diarrhea',
    'fever',
    'vomiting',
    'dehydration',
    'abdominal_pain',
    'nausea',
    'headache',
    'fatigue',
    'blood_in_stool',
    'skin_rash'
  ];

  const diseaseOptions = [
    { label: 'Diarrhea', value: 'diarrhea' },
    { label: 'Cholera', value: 'cholera' },
    { label: 'Typhoid', value: 'typhoid' },
    { label: 'Hepatitis A', value: 'hepatitis_a' },
    { label: 'Other', value: 'other' }
  ];

  const columns: ColumnsType<HealthDataType> = [
    {
      title: 'Patient ID',
      dataIndex: 'patientId',
      key: 'patientId',
    },
    {
      title: 'Disease Type',
      dataIndex: 'diseaseType',
      key: 'diseaseType',
      render: (type: string) => (
        <Tag color={type === 'cholera' ? 'red' : type === 'typhoid' ? 'orange' : 'blue'}>
          {type?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Tag color={
          severity === 'critical' ? 'red' : 
          severity === 'high' ? 'orange' : 
          severity === 'medium' ? 'yellow' : 'green'
        }>
          {severity.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: any) => location.address,
    },
    {
      title: 'Reported By',
      dataIndex: 'reportedBy',
      key: 'reportedBy',
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => viewCase(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => editCase(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => deleteCase(record.id)}
          />
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setSelectedCase(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const viewCase = (caseData: HealthDataType) => {
    setSelectedCase(caseData);
    // You could open a detailed view modal here
    Modal.info({
      title: `Case Details - ${caseData.patientId}`,
      content: (
        <div>
          <p><strong>Symptoms:</strong> {caseData.symptoms.join(', ')}</p>
          <p><strong>Severity:</strong> {caseData.severity}</p>
          <p><strong>Disease Type:</strong> {caseData.diseaseType}</p>
          <p><strong>Location:</strong> {caseData.location.address}</p>
          <p><strong>Reported By:</strong> {caseData.reportedBy}</p>
          <p><strong>Date:</strong> {new Date(caseData.timestamp).toLocaleString()}</p>
        </div>
      ),
      width: 600,
    });
  };

  const editCase = (caseData: HealthDataType) => {
    setSelectedCase(caseData);
    form.setFieldsValue({
      patientName: caseData.patientId,
      symptoms: caseData.symptoms,
      severity: caseData.severity,
      diseaseType: caseData.diseaseType,
      location: caseData.location.address,
      reportedBy: caseData.reportedBy,
    });
    setIsModalVisible(true);
  };

  const deleteCase = (caseId: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this case?',
      content: 'This action cannot be undone.',
      onOk() {
        setCases(cases.filter(c => c.id !== caseId));
        message.success('Case deleted successfully');
      },
    });
  };

  const handleSubmit = (values: any) => {
    const newCase: HealthDataType = {
      id: Date.now().toString(),
      patientId: values.patientName || `P${Date.now()}`,
      symptoms: values.symptoms || [],
      severity: values.severity,
      reportedBy: values.reportedBy || 'Current User',
      location: {
        lat: 26.1445,
        lng: 91.7362,
        address: values.location
      },
      timestamp: new Date(),
      diseaseType: values.diseaseType
    };

    if (selectedCase) {
      // Update existing case
      setCases(cases.map(c => c.id === selectedCase.id ? { ...newCase, id: selectedCase.id } : c));
      message.success('Case updated successfully');
    } else {
      // Add new case
      setCases([newCase, ...cases]);
      message.success('New case reported successfully');
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedCase(null);
  };

  return (
    <div className="health-data">
      <div className="page-header">
        <div>
          <h1>{t('health.caseHistory')}</h1>
          <p>Manage and track health cases in your jurisdiction</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showModal}
          size="large"
        >
          {t('health.reportCase')}
        </Button>
      </div>

      <Card className="search-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Input 
              placeholder={t('health.searchPatients')}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select 
              placeholder="Disease Type" 
              style={{ width: '100%' }}
              allowClear
            >
              {diseaseOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select 
              placeholder="Severity" 
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="critical">Critical</Option>
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Button type="primary" icon={<SearchOutlined />}>
              Search
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table 
          columns={columns} 
          dataSource={cases}
          rowKey="id"
          pagination={{
            total: cases.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={selectedCase ? 'Edit Health Case' : t('health.reportCase')}
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
                label={t('health.patientName')}
                name="patientName"
                rules={[{ required: true, message: 'Please enter patient name' }]}
              >
                <Input placeholder="Enter patient name or ID" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item
                label={t('health.age')}
                name="age"
                rules={[{ required: true, message: 'Please enter age' }]}
              >
                <InputNumber 
                  placeholder="Age" 
                  style={{ width: '100%' }}
                  min={0}
                  max={120}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item
                label={t('health.gender')}
                name="gender"
                rules={[{ required: true, message: 'Please select gender' }]}
              >
                <Select placeholder="Select gender">
                  <Option value="male">{t('common.male')}</Option>
                  <Option value="female">{t('common.female')}</Option>
                  <Option value="other">{t('common.other')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={t('health.symptoms')}
                name="symptoms"
                rules={[{ required: true, message: 'Please select symptoms' }]}
              >
                <Checkbox.Group>
                  <Row>
                    {symptomsOptions.map(symptom => (
                      <Col span={12} key={symptom}>
                        <Checkbox value={symptom}>
                          {symptom.replace('_', ' ').toUpperCase()}
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Disease Type"
                name="diseaseType"
                rules={[{ required: true, message: 'Please select disease type' }]}
              >
                <Select placeholder="Select suspected disease">
                  {diseaseOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Form.Item
                label={t('health.severity')}
                name="severity"
                rules={[{ required: true, message: 'Please select severity' }]}
              >
                <Select placeholder="Select severity">
                  <Option value="low">{t('common.low')}</Option>
                  <Option value="medium">{t('common.medium')}</Option>
                  <Option value="high">{t('common.high')}</Option>
                  <Option value="critical">{t('common.critical')}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label={t('health.onsetDate')}
                name="onsetDate"
                rules={[{ required: true, message: 'Please select onset date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Contact Number"
                name="contactNumber"
              >
                <Input placeholder="Patient contact number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={t('health.location')}
                name="location"
                rules={[{ required: true, message: 'Please enter location' }]}
              >
                <Input placeholder="Village/Area address" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={t('health.waterSource')}
                name="waterSource"
              >
                <Select placeholder="Select water source">
                  <Option value="well">Well</Option>
                  <Option value="tube_well">Tube Well</Option>
                  <Option value="hand_pump">Hand Pump</Option>
                  <Option value="river">River</Option>
                  <Option value="pond">Pond</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

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
                {selectedCase ? 'Update Case' : t('health.submit')}
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

export default HealthData;