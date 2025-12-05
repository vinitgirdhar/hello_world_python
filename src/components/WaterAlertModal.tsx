// src/components/WaterAlertModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  message, 
  Alert as AntAlert,
  Radio,
  Space,
  Divider,
  Tag,
  Spin
} from 'antd';
import { 
  AlertOutlined, 
  SendOutlined, 
  WarningOutlined,
  TeamOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import './WaterAlertModal.css';

const { TextArea } = Input;
const { Option } = Select;

interface WaterAlertModalProps {
  visible: boolean;
  onClose: () => void;
  userLocation?: string;
}

// Predefined alert templates
const alertTemplates = [
  {
    key: 'boil',
    label: '🔥 Boil Water Advisory',
    message: 'Water contamination detected in your area. Please boil water for at least 1 minute before drinking or cooking. Avoid using tap water directly until further notice.'
  },
  {
    key: 'bacteria',
    label: '🦠 Bacterial Contamination',
    message: 'High levels of harmful bacteria detected in the water supply. Do NOT drink tap water. Use only boiled or packaged drinking water. Seek medical attention if you experience diarrhea or vomiting.'
  },
  {
    key: 'chemical',
    label: '⚗️ Chemical Contamination',
    message: 'Chemical contamination detected in water sources. Avoid all contact with tap water including bathing. Use only bottled water until the situation is resolved.'
  },
  {
    key: 'general',
    label: '⚠️ General Water Quality Warning',
    message: 'Water quality issues detected in your area. As a precaution, please boil water before consumption and avoid drinking directly from taps.'
  },
  {
    key: 'custom',
    label: '✏️ Custom Message',
    message: ''
  }
];

// Sample regions/areas (in production, fetch from backend)
const sampleRegions = [
  'Kamrup Metro',
  'Guwahati City',
  'Dispur',
  'Village A - Sector 1',
  'Village A - Sector 2',
  'Village B',
  'Village C',
  'Village D',
  'All Registered Users'
];

const WaterAlertModal: React.FC<WaterAlertModalProps> = ({ visible, onClose, userLocation }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('boil');
  const [customMessage, setCustomMessage] = useState('');

  // Update message when template changes
  useEffect(() => {
    const template = alertTemplates.find(t => t.key === selectedTemplate);
    if (template && template.key !== 'custom') {
      form.setFieldsValue({ description: template.message });
    } else if (template?.key === 'custom') {
      form.setFieldsValue({ description: customMessage });
    }
  }, [selectedTemplate, form, customMessage]);

  // Set default region from user's location
  useEffect(() => {
    if (userLocation && visible) {
      form.setFieldsValue({ region: userLocation });
    }
  }, [userLocation, visible, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('nirogya-token') || localStorage.getItem('paanicare-token');
      
      if (!token) {
        message.error('You must be logged in to send alerts');
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/alerts/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            region: values.region,
            title: values.title,
            description: values.description,
            severity: values.severity
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create alert');
      }

      message.success('🚨 Alert sent successfully! Emails are being delivered to users in the selected region.');
      form.resetFields();
      setSelectedTemplate('boil');
      onClose();
      
    } catch (error: any) {
      console.error('Alert creation error:', error);
      message.error(error.message || 'Failed to send alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (key: string) => {
    setSelectedTemplate(key);
    const template = alertTemplates.find(t => t.key === key);
    if (template) {
      // Set a default title based on template
      const titles: { [key: string]: string } = {
        'boil': 'Boil Water Advisory',
        'bacteria': 'Bacterial Contamination Alert',
        'chemical': 'Chemical Contamination Warning',
        'general': 'Water Quality Warning',
        'custom': ''
      };
      form.setFieldsValue({ 
        title: titles[key] || '',
        description: template.message 
      });
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
          <span>Send Water Quality Alert</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="water-alert-modal"
      destroyOnClose
    >
      <AntAlert
        message="Important"
        description="This alert will be sent via email to all registered users in the selected region. Please ensure the information is accurate before sending."
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        style={{ marginBottom: 20 }}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          severity: 'high',
          region: userLocation || ''
        }}
      >
        {/* Region Selection */}
        <Form.Item
          name="region"
          label={
            <span>
              <EnvironmentOutlined /> Target Region/Area
            </span>
          }
          rules={[{ required: true, message: 'Please select a region' }]}
        >
          <Select
            placeholder="Select the affected region"
            showSearch
            optionFilterProp="children"
          >
            {sampleRegions.map(region => (
              <Option key={region} value={region}>{region}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Severity Selection */}
        <Form.Item
          name="severity"
          label="Alert Severity"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Space direction="horizontal">
              <Radio.Button value="low">
                <Tag color="blue">Low</Tag>
              </Radio.Button>
              <Radio.Button value="medium">
                <Tag color="orange">Medium</Tag>
              </Radio.Button>
              <Radio.Button value="high">
                <Tag color="red">High</Tag>
              </Radio.Button>
              <Radio.Button value="critical">
                <Tag color="#cf1322">Critical</Tag>
              </Radio.Button>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Divider>Message Template</Divider>

        {/* Template Selection */}
        <Form.Item label="Select a template or write custom message">
          <Select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            style={{ width: '100%' }}
          >
            {alertTemplates.map(template => (
              <Option key={template.key} value={template.key}>
                {template.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Alert Title */}
        <Form.Item
          name="title"
          label="Alert Title"
          rules={[{ required: true, message: 'Please enter an alert title' }]}
        >
          <Input 
            placeholder="e.g., Water Contamination Alert" 
            maxLength={100}
            showCount
          />
        </Form.Item>

        {/* Alert Message */}
        <Form.Item
          name="description"
          label={
            <span>
              <TeamOutlined /> Message to Community
            </span>
          }
          rules={[
            { required: true, message: 'Please enter the alert message' },
            { min: 20, message: 'Message should be at least 20 characters' }
          ]}
        >
          <TextArea
            rows={5}
            placeholder="Enter the alert message that will be sent to all users in the selected region..."
            maxLength={1000}
            showCount
            onChange={(e) => {
              if (selectedTemplate === 'custom') {
                setCustomMessage(e.target.value);
              }
            }}
          />
        </Form.Item>

        {/* Preview */}
        <div className="alert-preview">
          <h4>📧 Email Preview</h4>
          <div className="preview-content">
            <p><strong>Subject:</strong> ⚠️ WATER ALERT: {form.getFieldValue('region') || '[Region]'}</p>
            <p><strong>To:</strong> All users in {form.getFieldValue('region') || '[Region]'}</p>
            <p><strong>Message:</strong></p>
            <blockquote>{form.getFieldValue('description') || '[Your message will appear here]'}</blockquote>
          </div>
        </div>

        {/* Submit Button */}
        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              danger
              htmlType="submit" 
              loading={loading}
              icon={<SendOutlined />}
            >
              {loading ? 'Sending Alert...' : 'Send Alert to Community'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WaterAlertModal;
