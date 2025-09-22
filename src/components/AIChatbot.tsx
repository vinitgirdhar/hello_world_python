import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Input, Space, Avatar, Typography, Spin, Tooltip } from 'antd';
import { 
  MessageOutlined, 
  SendOutlined, 
  CloseOutlined,
  RobotOutlined,
  UserOutlined,
  MinusOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import './AIChatbot.css';

const { Text, Paragraph } = Typography;

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your Nirogya AI assistant. I can help you with water quality monitoring, health surveillance, and disease prevention. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Predefined responses for demo purposes
  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('water quality') || message.includes('contamination')) {
      return 'Water quality monitoring is crucial for preventing waterborne diseases. Our system tracks pH levels, turbidity, bacterial count, and chemical pollutants. Would you like to know about specific water quality parameters or testing procedures?';
    }
    
    if (message.includes('disease') || message.includes('symptoms')) {
      return 'Common waterborne diseases in the NER include cholera, typhoid, hepatitis A, and diarrheal diseases. Key symptoms to watch for are fever, stomach pain, vomiting, and diarrhea. If you notice these symptoms in your community, please report them through our health surveillance system.';
    }
    
    if (message.includes('report') || message.includes('health data')) {
      return 'You can report health cases through our Community Reporting feature. Include patient details, symptoms, location, and suspected water source. This helps us track disease patterns and issue early warnings.';
    }
    
    if (message.includes('prevention') || message.includes('protect')) {
      return 'Key prevention measures include: 1) Boil or treat water before drinking, 2) Use proper sanitation facilities, 3) Wash hands frequently, 4) Avoid contaminated water sources, 5) Report unusual symptoms immediately.';
    }
    
    if (message.includes('dashboard') || message.includes('how to use')) {
      return 'The dashboard shows real-time health surveillance data, water quality metrics, community reports, and outbreak alerts. You can filter by location, time period, and disease type. Would you like a guided tour of specific features?';
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return `Hello${user ? ` ${user.name.split(' ')[0]}` : ''}! I can help you with:\n• Water quality monitoring and testing\n• Disease surveillance and reporting\n• Health data analysis\n• Community alerts and prevention\n• System navigation and features\n\nWhat would you like to know more about?`;
    }
    
    if (message.includes('emergency') || message.includes('outbreak')) {
      return '🚨 For health emergencies or suspected disease outbreaks:\n1. Contact local health authorities immediately\n2. Report through our emergency alert system\n3. Isolate affected individuals\n4. Avoid suspected contaminated water sources\n5. Follow official health guidelines\n\nEmergency Hotline: 102 (National Health Helpline)';
    }
    
    return 'I understand you\'re asking about health surveillance and water safety. Could you please be more specific? I can help with water quality testing, disease reporting, prevention measures, or system navigation. What would you like to know more about?';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(inputValue),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Tooltip title="AI Health Assistant" placement="left">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<MessageOutlined />}
            className="chatbot-fab"
            onClick={() => setIsOpen(true)}
          />
        </Tooltip>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card 
          className={`chatbot-window ${isMinimized ? 'minimized' : ''}`}
          bodyStyle={{ padding: 0 }}
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Avatar 
                size={32} 
                icon={<RobotOutlined />} 
                className="bot-avatar"
              />
              <div className="title-text">
                <Text strong>Nirogya AI</Text>
                <Text type="secondary" className="status">Online • Ready to help</Text>
              </div>
            </div>
            <Space>
              <Button
                type="text"
                size="small"
                icon={<MinusOutlined />}
                onClick={() => setIsMinimized(!isMinimized)}
                className="header-btn"
              />
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => setIsOpen(false)}
                className="header-btn"
              />
            </Space>
          </div>

          {/* Messages Container */}
          {!isMinimized && (
            <>
              <div className="messages-container">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`message ${message.type}`}
                  >
                    <div className="message-avatar">
                      {message.type === 'bot' ? (
                        <Avatar size={28} icon={<RobotOutlined />} className="bot-avatar" />
                      ) : (
                        <Avatar size={28} icon={<UserOutlined />} className="user-avatar" />
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message-bubble">
                        <Paragraph className="message-text">
                          {message.content}
                        </Paragraph>
                      </div>
                      <Text type="secondary" className="message-time">
                        {formatTime(message.timestamp)}
                      </Text>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="message bot">
                    <div className="message-avatar">
                      <Avatar size={28} icon={<RobotOutlined />} className="bot-avatar" />
                    </div>
                    <div className="message-content">
                      <div className="message-bubble typing">
                        <Spin size="small" />
                        <Text className="typing-text">AI is thinking...</Text>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="chatbot-input">
                <Input.TextArea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about water quality, health surveillance, or disease prevention..."
                  autoSize={{ minRows: 1, maxRows: 3 }}
                  className="message-input"
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="send-button"
                />
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
};

export default AIChatbot;