import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  InputNumber, 
  Checkbox, 
  Row, 
  Col,
  Alert,
  Steps,
  message,
  Result,
  Divider,
  Typography
} from 'antd';
import { 
  PhoneOutlined, 
  EnvironmentOutlined, 
  UserOutlined,
  MedicineBoxOutlined,
  DropboxOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../components/ThemeProvider';
import './Community.css';

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;
const { Title, Text } = Typography;

const Community: React.FC = () => {
  useTranslation();
  const { isDark } = useTheme();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const symptomsOptions = [
    { label: 'Diarrhea', value: 'diarrhea' },
    { label: 'Vomiting', value: 'vomiting' },
    { label: 'Fever', value: 'fever' },
    { label: 'Stomach Pain', value: 'stomach_pain' },
    { label: 'Dehydration', value: 'dehydration' },
    { label: 'Headache', value: 'headache' },
    { label: 'Nausea', value: 'nausea' },
    { label: 'Weakness', value: 'weakness' },
    { label: 'Blood in Stool', value: 'blood_in_stool' },
    { label: 'Skin Rash', value: 'skin_rash' }
  ];

  const waterSourceOptions = [
    'Well',
    'Tube Well',
    'Hand Pump',
    'River',
    'Pond',
    'Public Tap',
    'Bottled Water',
    'Other'
  ];

  const steps = [
    {
      title: 'Personal Info',
      content: 'personal',
      icon: <UserOutlined />
    },
    {
      title: 'Symptoms',
      content: 'symptoms',
      icon: <MedicineBoxOutlined />
    },
    {
      title: 'Water Source',
      content: 'water',
      icon: <DropboxOutlined />
    },
    {
      title: 'Review',
      content: 'review',
      icon: <CheckCircleOutlined />
    }
  ];

  const handleNext = () => {
    form.validateFields().then((values: any) => {
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    }).catch((info: any) => {
      console.log('Validate Failed:', info);
    });
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    form.validateFields().then((values: any) => {
      const finalData = { ...formData, ...values };
      console.log('Report submitted:', finalData);
      setSubmitted(true);
      message.success('Report submitted successfully!');
    }).catch((info: any) => {
      console.log('Validate Failed:', info);
    });
  };

  const renderPersonalInfo = () => (
    <Card title="Personal Information" className="step-card">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Reporter Name"
            name="reporterName"
            rules={[{ required: true, message: 'Please enter your name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Your full name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Contact Number"
            name="reporterContact"
            rules={[{ required: true, message: 'Please enter your contact number!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Contact number" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Location/Village"
            name="location"
            rules={[{ required: true, message: 'Please enter your location!' }]}
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="Village/Area name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Number of family members affected"
            name="familyAffected"
            rules={[{ required: true, message: 'Please enter number of affected members!' }]}
          >
            <InputNumber min={1} max={20} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  const renderSymptoms = () => (
    <Card title="Symptoms Information" className="step-card">
      <Form.Item
        label="Select symptoms being experienced"
        name="symptoms"
        rules={[{ required: true, message: 'Please select at least one symptom!' }]}
      >
        <Checkbox.Group options={symptomsOptions} />
      </Form.Item>

      <Form.Item
        label="When did the symptoms start?"
        name="symptomsStartDate"
        rules={[{ required: true, message: 'Please specify when symptoms started!' }]}
      >
        <Select placeholder="Select when symptoms started">
          <Option value="today">Today</Option>
          <Option value="yesterday">Yesterday</Option>
          <Option value="2-3-days">2-3 days ago</Option>
          <Option value="week">About a week ago</Option>
          <Option value="more-week">More than a week ago</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Severity of symptoms"
        name="severity"
        rules={[{ required: true, message: 'Please select severity!' }]}
      >
        <Select placeholder="Select severity level">
          <Option value="mild">Mild - Can manage with home remedies</Option>
          <Option value="moderate">Moderate - Need medical attention</Option>
          <Option value="severe">Severe - Need immediate medical help</Option>
          <Option value="critical">Critical - Emergency situation</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Additional symptoms details"
        name="symptomsDetails"
      >
        <TextArea 
          rows={4} 
          placeholder="Please describe any additional details about the symptoms..."
        />
      </Form.Item>
    </Card>
  );

  const renderWaterSource = () => (
    <Card title="Water Source Information" className="step-card">
      <Form.Item
        label="Primary water source for drinking"
        name="waterSource"
        rules={[{ required: true, message: 'Please select water source!' }]}
      >
        <Select placeholder="Select your primary water source">
          {waterSourceOptions.map(source => (
            <Option key={source} value={source}>{source}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Water treatment"
        name="waterTreatment"
      >
        <Checkbox.Group>
          <Row>
            <Col span={24}>
              <Checkbox value="boiling">We boil water before drinking</Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox value="filtering">We use water filter</Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox value="chlorination">We add chlorine tablets</Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox value="none">We drink water directly without treatment</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item
        label="Have you noticed anything unusual about the water?"
        name="waterObservations"
      >
        <Checkbox.Group>
          <Row>
            <Col span={12}>
              <Checkbox value="bad_smell">Bad smell</Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="strange_color">Strange color</Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="bad_taste">Bad taste</Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="floating_particles">Floating particles</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </Form.Item>
    </Card>
  );

  const renderReview = () => (
    <Card title="Review Your Report" className="step-card">
      <div className="review-section">
        <Title level={4}>Personal Information</Title>
        <Row gutter={[16, 8]}>
          <Col span={8}><Text strong>Name:</Text></Col>
          <Col span={16}>{formData.reporterName}</Col>
          <Col span={8}><Text strong>Contact:</Text></Col>
          <Col span={16}>{formData.reporterContact}</Col>
          <Col span={8}><Text strong>Location:</Text></Col>
          <Col span={16}>{formData.location}</Col>
          <Col span={8}><Text strong>Family Affected:</Text></Col>
          <Col span={16}>{formData.familyAffected} members</Col>
        </Row>

        <Divider />

        <Title level={4}>Symptoms</Title>
        <Row gutter={[16, 8]}>
          <Col span={8}><Text strong>Symptoms:</Text></Col>
          <Col span={16}>{formData.symptoms?.join(', ')}</Col>
          <Col span={8}><Text strong>Started:</Text></Col>
          <Col span={16}>{formData.symptomsStartDate}</Col>
          <Col span={8}><Text strong>Severity:</Text></Col>
          <Col span={16}>{formData.severity}</Col>
        </Row>

        <Divider />

        <Title level={4}>Water Source</Title>
        <Row gutter={[16, 8]}>
          <Col span={8}><Text strong>Source:</Text></Col>
          <Col span={16}>{formData.waterSource}</Col>
          <Col span={8}><Text strong>Treatment:</Text></Col>
          <Col span={16}>{formData.waterTreatment?.join(', ') || 'None specified'}</Col>
        </Row>
      </div>
    </Card>
  );

  if (submitted) {
    return (
      <div className="community">
        <Result
          status="success"
          title="Report Submitted Successfully!"
          subTitle="Thank you for reporting. Your information helps us monitor community health."
          extra={[
            <Button type="primary" key="new" onClick={() => { 
              setSubmitted(false); 
              setCurrentStep(0); 
              form.resetFields();
              setFormData({});
            }}>
              Submit Another Report
            </Button>,
          ]}
        />
        <Alert
          message="Emergency: If you have severe symptoms, please seek immediate medical attention!"
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          className="emergency-alert"
        />
      </div>
    );
  }

  return (
    <div className={`community ${isDark ? 'dark' : ''}`}>
      <div className="page-header">
        <div>
          <h1>Report Symptoms</h1>
          <p>Help us monitor community health by reporting symptoms quickly and easily</p>
        </div>
      </div>

      <Alert
        message="Emergency: If you have severe symptoms, please seek immediate medical attention!"
        type="error"
        showIcon
        icon={<ExclamationCircleOutlined />}
        className="emergency-alert"
      />

      <Card className="main-form-card">
        <Steps current={currentStep} className="form-steps">
          {steps.map(item => (
            <Step key={item.title} title={item.title} icon={item.icon} />
          ))}
        </Steps>

        <Form
          form={form}
          layout="vertical"
          className="community-form"
        >
          <div className="step-content">
            {currentStep === 0 && renderPersonalInfo()}
            {currentStep === 1 && renderSymptoms()}
            {currentStep === 2 && renderWaterSource()}
            {currentStep === 3 && renderReview()}
          </div>

          <div className="form-actions">
            {currentStep > 0 && (
              <Button onClick={handlePrev}>
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={handleNext}>
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" onClick={handleSubmit}>
                Submit Report
              </Button>
            )}
          </div>
        </Form>
      </Card>

      <Row gutter={[16, 16]} className="info-cards">
        <Col xs={24} lg={12}>
          <Card title="Prevention Tips" className="info-card">
            <ul className="prevention-list">
              <li>Always boil water before drinking</li>
              <li>Wash hands frequently with soap</li>
              <li>Eat freshly cooked food</li>
              <li>Avoid street food and raw vegetables</li>
              <li>Use proper sanitation facilities</li>
              <li>Keep your surroundings clean</li>
            </ul>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="When to Seek Immediate Help" className="info-card danger">
            <ul className="emergency-list">
              <li>Severe dehydration</li>
              <li>Blood in vomit or stool</li>
              <li>High fever with severe symptoms</li>
              <li>Signs of severe dehydration in children</li>
              <li>Symptoms not improving after 3 days</li>
              <li>Multiple family members severely affected</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Community;
