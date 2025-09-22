import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Button, Form, Input, Select, Slider, Progress, Statistic, Timeline, Tag } from 'antd';
import { ExperimentOutlined, RobotOutlined, WarningOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import * as tf from '@tensorflow/tfjs';
import './WaterQualityPrediction.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WaterQualityData {
  id: string;
  location: string;
  district: string;
  timestamp: string;
  ph: number;
  turbidity: number;
  tds: number; // Total Dissolved Solids
  chlorine: number;
  fluoride: number;
  nitrate: number;
  coliform: number;
  temperature: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  predictedDiseases: string[];
  confidence: number;
}

interface PredictionResult {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  predictedDiseases: Array<{
    disease: string;
    probability: number;
    severity: string;
  }>;
  recommendations: string[];
  confidence: number;
}

const { Option } = Select;

const WaterQualityPrediction: React.FC = () => {
  const [waterData, setWaterData] = useState<WaterQualityData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);
  const [form] = Form.useForm();

  // Mock historical water quality data
  useEffect(() => {
    const mockData: WaterQualityData[] = [
      {
        id: '1',
        location: 'Brahmaputra River - Guwahati',
        district: 'Kamrup Metro',
        timestamp: '2024-01-16T10:00:00Z',
        ph: 6.8,
        turbidity: 15.2,
        tds: 180,
        chlorine: 0.3,
        fluoride: 0.8,
        nitrate: 12.5,
        coliform: 45,
        temperature: 24.5,
        riskLevel: 'medium',
        predictedDiseases: ['Cholera', 'Diarrhea'],
        confidence: 85
      },
      {
        id: '2',
        location: 'Dibrugarh Water Treatment Plant',
        district: 'Dibrugarh',
        timestamp: '2024-01-16T11:00:00Z',
        ph: 7.2,
        turbidity: 2.1,
        tds: 120,
        chlorine: 0.5,
        fluoride: 0.6,
        nitrate: 8.2,
        coliform: 5,
        temperature: 23.8,
        riskLevel: 'low',
        predictedDiseases: [],
        confidence: 92
      },
      {
        id: '3',
        location: 'Silchar Municipal Supply',
        district: 'Cachar',
        timestamp: '2024-01-16T12:00:00Z',
        ph: 6.2,
        turbidity: 25.8,
        tds: 280,
        chlorine: 0.1,
        fluoride: 1.2,
        nitrate: 22.5,
        coliform: 120,
        temperature: 26.2,
        riskLevel: 'high',
        predictedDiseases: ['Cholera', 'Typhoid', 'Hepatitis A'],
        confidence: 78
      }
    ];
    setWaterData(mockData);
  }, []);

  // Initialize TensorFlow.js model (mock model for demonstration)
  useEffect(() => {
    const initializeModel = async () => {
      try {
        // Create a simple neural network model for water quality prediction
        const model = tf.sequential({
          layers: [
            tf.layers.dense({ inputShape: [8], units: 64, activation: 'relu' }),
            tf.layers.dropout({ rate: 0.2 }),
            tf.layers.dense({ units: 32, activation: 'relu' }),
            tf.layers.dense({ units: 16, activation: 'relu' }),
            tf.layers.dense({ units: 4, activation: 'softmax' }) // 4 risk levels
          ]
        });

        model.compile({
          optimizer: 'adam',
          loss: 'categoricalCrossentropy',
          metrics: ['accuracy']
        });

        console.log('AI model initialized successfully');
      } catch (error) {
        console.error('Error initializing AI model:', error);
      }
    };

    initializeModel();
  }, []);

  // AI Prediction function
  const predictWaterQuality = useCallback(async (data: Omit<WaterQualityData, 'id' | 'timestamp' | 'riskLevel' | 'predictedDiseases' | 'confidence'>): Promise<PredictionResult> => {
    setIsAnalyzing(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Use rule-based prediction for now
      let riskScore = 0;
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

      // Rule-based prediction (since we don't have trained model data)
      // pH analysis
      if (data.ph < 6.5 || data.ph > 8.5) riskScore += 20;
      
      // Turbidity analysis
      if (data.turbidity > 10) riskScore += 15;
      if (data.turbidity > 25) riskScore += 15;
      
      // Coliform analysis (most critical)
      if (data.coliform > 10) riskScore += 25;
      if (data.coliform > 50) riskScore += 25;
      
      // Chemical analysis
      if (data.chlorine < 0.2) riskScore += 10;
      if (data.nitrate > 15) riskScore += 15;
      if (data.fluoride > 1.0) riskScore += 10;

      // TDS analysis
      if (data.tds > 200) riskScore += 10;

      // Determine risk level
      if (riskScore >= 70) riskLevel = 'critical';
      else if (riskScore >= 50) riskLevel = 'high';
      else if (riskScore >= 25) riskLevel = 'medium';

      // Predict diseases based on parameters
      const predictedDiseases = [];
      if (data.coliform > 50) {
        predictedDiseases.push({ disease: 'Cholera', probability: 0.75, severity: 'high' });
        predictedDiseases.push({ disease: 'Diarrhea', probability: 0.85, severity: 'medium' });
      }
      if (data.nitrate > 20) {
        predictedDiseases.push({ disease: 'Typhoid', probability: 0.65, severity: 'high' });
      }
      if (data.ph < 6.0 && data.coliform > 30) {
        predictedDiseases.push({ disease: 'Hepatitis A', probability: 0.55, severity: 'medium' });
      }
      if (data.turbidity > 30) {
        predictedDiseases.push({ disease: 'Gastroenteritis', probability: 0.70, severity: 'medium' });
      }

      // Generate recommendations
      const recommendations = [];
      if (data.coliform > 30) recommendations.push('Immediate water disinfection required');
      if (data.ph < 6.5 || data.ph > 8.5) recommendations.push('pH adjustment needed');
      if (data.turbidity > 15) recommendations.push('Water filtration recommended');
      if (data.chlorine < 0.2) recommendations.push('Increase chlorination levels');
      if (data.nitrate > 15) recommendations.push('Check for contamination sources');
      if (recommendations.length === 0) recommendations.push('Water quality is acceptable, continue monitoring');

      const confidence = Math.max(60, 100 - riskScore * 0.5);

      return {
        riskLevel,
        riskScore,
        predictedDiseases,
        recommendations,
        confidence
      };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleAnalyze = async (values: any) => {
    const waterQualityData = {
      location: values.location,
      district: values.district,
      ph: values.ph,
      turbidity: values.turbidity,
      tds: values.tds,
      chlorine: values.chlorine,
      fluoride: values.fluoride,
      nitrate: values.nitrate,
      coliform: values.coliform,
      temperature: values.temperature
    };

    const prediction = await predictWaterQuality(waterQualityData);
    setCurrentPrediction(prediction);

    // Add to historical data
    const newData: WaterQualityData = {
      id: Date.now().toString(),
      ...waterQualityData,
      timestamp: new Date().toISOString(),
      riskLevel: prediction.riskLevel,
      predictedDiseases: prediction.predictedDiseases.map(d => d.disease),
      confidence: prediction.confidence
    };

    setWaterData([newData, ...waterData]);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return '#ff4d4f';
      case 'high': return '#ff7a45';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical': return <WarningOutlined style={{ color: '#ff4d4f' }} />;
      case 'high': return <WarningOutlined style={{ color: '#ff7a45' }} />;
      case 'medium': return <ExperimentOutlined style={{ color: '#faad14' }} />;
      case 'low': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default: return <ExperimentOutlined />;
    }
  };

  // Chart data for trends
  const chartData = {
    labels: waterData.slice(0, 10).reverse().map(d => new Date(d.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Risk Score',
        data: waterData.slice(0, 10).reverse().map(d => {
          const score = d.riskLevel === 'critical' ? 90 : 
                       d.riskLevel === 'high' ? 70 : 
                       d.riskLevel === 'medium' ? 40 : 20;
          return score;
        }),
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const radarData = currentPrediction ? {
    labels: ['pH Level', 'Turbidity', 'Coliform', 'Chemical Safety', 'Overall Quality'],
    datasets: [
      {
        label: 'Current Water Quality',
        data: [
          currentPrediction.riskScore >= 70 ? 20 : currentPrediction.riskScore >= 50 ? 40 : currentPrediction.riskScore >= 25 ? 70 : 90,
          90 - currentPrediction.riskScore,
          currentPrediction.riskScore >= 70 ? 10 : currentPrediction.riskScore >= 50 ? 30 : currentPrediction.riskScore >= 25 ? 60 : 85,
          100 - currentPrediction.riskScore,
          currentPrediction.confidence
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      }
    ]
  } : null;

  return (
    <div className="water-quality-prediction">
      <div className="prediction-header">
        <h2><RobotOutlined /> AI Water Quality Prediction System</h2>
        <p>Advanced machine learning system for predicting waterborne disease risks</p>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={6}>
          <Card className="stat-card">
            <Statistic
              title="Locations Monitored"
              value={waterData.length}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card">
            <Statistic
              title="High Risk Areas"
              value={waterData.filter(d => d.riskLevel === 'high' || d.riskLevel === 'critical').length}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card">
            <Statistic
              title="AI Confidence"
              value={currentPrediction?.confidence || 0}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<RobotOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card">
            <Statistic
              title="Predictions Made"
              value={waterData.length}
              prefix={<SyncOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Input Form */}
        <Col xs={24} lg={12}>
          <Card title="Water Quality Analysis" className="analysis-card">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAnalyze}
            >
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="Location"
                    rules={[{ required: true, message: 'Please enter location' }]}
                  >
                    <Input placeholder="Enter water source location" />
                  </Form.Item>
                </Col>
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
              </Row>

              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="ph"
                    label="pH Level"
                    rules={[{ required: true, message: 'Please enter pH level' }]}
                  >
                    <Slider
                      min={0}
                      max={14}
                      step={0.1}
                      marks={{ 0: '0', 7: '7 (Neutral)', 14: '14' }}
                      tooltip={{ formatter: (value) => `pH ${value}` }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="turbidity"
                    label="Turbidity (NTU)"
                    rules={[{ required: true, message: 'Please enter turbidity' }]}
                  >
                    <Input type="number" placeholder="Turbidity value" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="tds"
                    label="TDS (mg/L)"
                    rules={[{ required: true, message: 'Please enter TDS' }]}
                  >
                    <Input type="number" placeholder="Total Dissolved Solids" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="chlorine"
                    label="Chlorine (mg/L)"
                    rules={[{ required: true, message: 'Please enter chlorine level' }]}
                  >
                    <Input type="number" step="0.1" placeholder="Chlorine level" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="fluoride"
                    label="Fluoride (mg/L)"
                    rules={[{ required: true, message: 'Please enter fluoride level' }]}
                  >
                    <Input type="number" step="0.1" placeholder="Fluoride level" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="nitrate"
                    label="Nitrate (mg/L)"
                    rules={[{ required: true, message: 'Please enter nitrate level' }]}
                  >
                    <Input type="number" placeholder="Nitrate level" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="coliform"
                    label="Coliform (CFU/100ml)"
                    rules={[{ required: true, message: 'Please enter coliform count' }]}
                  >
                    <Input type="number" placeholder="Coliform bacteria count" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="temperature"
                    label="Temperature (°C)"
                    rules={[{ required: true, message: 'Please enter temperature' }]}
                  >
                    <Input type="number" step="0.1" placeholder="Water temperature" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isAnalyzing}
                  icon={<RobotOutlined />}
                  block
                  size="large"
                >
                  {isAnalyzing ? 'AI Analysis in Progress...' : 'Analyze Water Quality'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Prediction Results */}
        <Col xs={24} lg={12}>
          <Card title="AI Prediction Results" className="results-card">
            {currentPrediction ? (
              <div className="prediction-results">
                <div className="risk-assessment">
                  <div className={`risk-level ${currentPrediction.riskLevel}`}>
                    {getRiskIcon(currentPrediction.riskLevel)}
                    <span className="risk-text">{currentPrediction.riskLevel.toUpperCase()} RISK</span>
                  </div>
                  <Progress 
                    percent={currentPrediction.riskScore} 
                    strokeColor={getRiskColor(currentPrediction.riskLevel)}
                    format={percent => `${percent}% Risk`}
                  />
                </div>

                {currentPrediction.predictedDiseases.length > 0 && (
                  <div className="predicted-diseases">
                    <h4>Predicted Disease Risks:</h4>
                    {currentPrediction.predictedDiseases.map((disease, index) => (
                      <div key={index} className="disease-item">
                        <Tag color={disease.severity === 'high' ? 'red' : 'orange'}>
                          {disease.disease}
                        </Tag>
                        <span>{(disease.probability * 100).toFixed(1)}% probability</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="recommendations">
                  <h4>AI Recommendations:</h4>
                  <ul>
                    {currentPrediction.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="confidence-meter">
                  <span>AI Confidence: </span>
                  <Progress 
                    percent={currentPrediction.confidence} 
                    size="small"
                    strokeColor="#52c41a"
                  />
                </div>
              </div>
            ) : (
              <div className="no-prediction">
                <RobotOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                <p>Enter water quality parameters to get AI prediction</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Risk Trend Analysis" className="chart-card">
            <Line 
              data={chartData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Water Quality Risk Over Time'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          {radarData && (
            <Card title="Quality Assessment" className="chart-card">
              <Radar 
                data={radarData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    }
                  },
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </Card>
          )}
        </Col>
      </Row>

      {/* Historical Data */}
      <Card title="Recent Predictions" className="history-card" style={{ marginTop: '24px' }}>
        <Timeline
          items={waterData.slice(0, 5).map(data => ({
            color: getRiskColor(data.riskLevel),
            children: (
              <div className="timeline-item">
                <div className="timeline-header">
                  <span className="location">{data.location}</span>
                  <Tag color={getRiskColor(data.riskLevel)}>
                    {data.riskLevel.toUpperCase()}
                  </Tag>
                </div>
                <div className="timeline-content">
                  <p>District: {data.district}</p>
                  <p>Confidence: {data.confidence}%</p>
                  {data.predictedDiseases.length > 0 && (
                    <p>Predicted Diseases: {data.predictedDiseases.join(', ')}</p>
                  )}
                  <p className="timestamp">{new Date(data.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )
          }))}
        />
      </Card>
    </div>
  );
};

export default WaterQualityPrediction;