import React, { useState, useEffect, useRef } from 'react';
import { 
  Input, 
  Button, 
  Avatar, 
  List, 
  Typography, 
  Space, 
  Divider, 
  Badge, 
  Dropdown, 
  Modal, 
  Row,
  Col,
  message,
  Tooltip,
  Tag
} from 'antd';
import { 
  SendOutlined, 
  PlusOutlined, 
  UserOutlined,
  SearchOutlined,
  MoreOutlined,
  PictureOutlined,
  SmileOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  FireOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import './CommunityChat.css';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  reactions?: { emoji: string; users: string[] }[];
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  members: number;
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
  category: 'health' | 'water' | 'general' | 'emergency';
}

const CommunityChat: React.FC = () => {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<string>('general-chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for community groups
  useEffect(() => {
    const mockGroups: CommunityGroup[] = [
      {
        id: 'general-chat',
        name: 'General Discussion',
        description: 'Community wide discussions and updates',
        members: 245,
        unreadCount: 3,
        isActive: true,
        category: 'general',
        lastMessage: {
          id: '1',
          senderId: 'user2',
          senderName: 'Dr. Sharma',
          content: 'Remember to boil water before drinking',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          type: 'text',
          isRead: false
        }
      },
      {
        id: 'health-alerts',
        name: 'Health Alerts',
        description: 'Important health updates and alerts',
        members: 189,
        unreadCount: 1,
        isActive: true,
        category: 'health',
        lastMessage: {
          id: '2',
          senderId: 'health-dept',
          senderName: 'Health Department',
          content: 'New waterborne disease cases reported in sector 7',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          type: 'text',
          isRead: false
        }
      },
      {
        id: 'water-quality',
        name: 'Water Quality Updates',
        description: 'Water quality reports and updates',
        members: 156,
        unreadCount: 0,
        isActive: true,
        category: 'water',
        lastMessage: {
          id: '3',
          senderId: 'water-dept',
          senderName: 'Water Department',
          content: 'Water quality test results for this week are out',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          type: 'text',
          isRead: true
        }
      },
      {
        id: 'emergency-response',
        name: 'Emergency Response',
        description: 'Emergency alerts and response coordination',
        members: 78,
        unreadCount: 0,
        isActive: true,
        category: 'emergency'
      }
    ];
    setGroups(mockGroups);
  }, []);

  // Mock messages for selected group
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'user1',
        senderName: 'Priya Singh',
        senderAvatar: '',
        content: 'Has anyone noticed the water quality issues in our area lately?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        type: 'text',
        isRead: true
      },
      {
        id: '2',
        senderId: 'user2',
        senderName: 'Dr. Sharma',
        senderAvatar: '',
        content: 'Yes, I\'ve received several reports. Everyone please ensure you boil water before drinking and report any symptoms immediately.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: 'text',
        isRead: true
      },
      {
        id: '3',
        senderId: user?.id || 'current-user',
        senderName: user?.name || 'You',
        senderAvatar: user?.avatar || '',
        content: 'I can help coordinate with the local health department if needed.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: 'text',
        isRead: true
      },
      {
        id: '4',
        senderId: 'user3',
        senderName: 'Rahul Mehta',
        senderAvatar: '',
        content: 'Thank you! We need to organize a community meeting to discuss this further.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        type: 'text',
        isRead: true
      }
    ];
    setMessages(mockMessages);
  }, [selectedGroup, user]);

  // Scroll to bottom when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && user) {
      const newMsg: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        content: newMessage.trim(),
        timestamp: new Date(),
        type: 'text',
        isRead: false
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      message.success('Message sent!');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedGroupData = groups.find(g => g.id === selectedGroup);

  const getCategoryColor = (category: CommunityGroup['category']) => {
    switch (category) {
      case 'health': return '#ff4d4f';
      case 'water': return '#1890ff';
      case 'emergency': return '#ff7a45';
      default: return '#52c41a';
    }
  };

  const getCategoryIcon = (category: CommunityGroup['category']) => {
    switch (category) {
      case 'health': return '🏥';
      case 'water': return '💧';
      case 'emergency': return '🚨';
      default: return '💬';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="community-chat">
      <Row className="chat-container" gutter={0}>
        {/* Groups Sidebar */}
        <Col xs={24} md={8} lg={6} className="groups-sidebar">
          <div className="sidebar-header">
            <Title level={4} style={{ margin: 0, color: 'white' }}>
              <TeamOutlined /> Community
            </Title>
            <Button
              type="text"
              icon={<PlusOutlined />}
              style={{ color: 'white' }}
              onClick={() => message.info('Create group feature coming soon!')}
            />
          </div>

          <div className="search-bar">
            <Input
              placeholder="Search groups..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="groups-list">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className={`group-item ${selectedGroup === group.id ? 'active' : ''}`}
                onClick={() => setSelectedGroup(group.id)}
              >
                <div className="group-avatar">
                  <Avatar size={48} style={{ backgroundColor: getCategoryColor(group.category) }}>
                    {getCategoryIcon(group.category)}
                  </Avatar>
                  {group.unreadCount > 0 && (
                    <Badge count={group.unreadCount} className="unread-badge" />
                  )}
                </div>
                <div className="group-info">
                  <div className="group-name">
                    {group.name}
                    {group.isActive && <span className="online-indicator" />}
                  </div>
                  <div className="group-last-message">
                    {group.lastMessage?.content || 'No messages yet'}
                  </div>
                  <div className="group-meta">
                    <span className="member-count">
                      <TeamOutlined style={{ fontSize: '10px', marginRight: '4px' }} />
                      {group.members} members
                    </span>
                    {group.lastMessage && (
                      <span className="timestamp">
                        <ClockCircleOutlined style={{ fontSize: '10px', marginRight: '2px' }} />
                        {formatTimestamp(group.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                </div>
                <Tag color={getCategoryColor(group.category)} className="category-tag">
                  {group.category}
                </Tag>
              </div>
            ))}
          </div>
        </Col>

        {/* Chat Area */}
        <Col xs={24} md={16} lg={18} className="chat-area">
          {selectedGroupData ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-info">
                  <Avatar size={40} style={{ backgroundColor: getCategoryColor(selectedGroupData.category) }}>
                    {getCategoryIcon(selectedGroupData.category)}
                  </Avatar>
                  <div className="chat-details">
                    <Title level={5} style={{ margin: 0, color: 'rgba(255, 255, 255, 0.95)' }}>
                      {selectedGroupData.name}
                      {selectedGroupData.isActive && (
                        <Tag 
                          color="success" 
                          style={{ 
                            marginLeft: 8, 
                            fontSize: '10px', 
                            padding: '0 6px',
                            background: 'rgba(82, 196, 26, 0.2)',
                            border: '1px solid rgba(82, 196, 26, 0.4)',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          <EyeOutlined style={{ marginRight: 2 }} />
                          Active
                        </Tag>
                      )}
                    </Title>
                    <Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      <TeamOutlined style={{ marginRight: 4 }} />
                      {selectedGroupData.members} members
                      {selectedGroupData.category === 'emergency' && (
                        <span style={{ marginLeft: 8 }}>
                          <FireOutlined style={{ color: '#ff4d4f', marginRight: 2 }} />
                          Priority Channel
                        </span>
                      )}
                    </Text>
                  </div>
                </div>
                <Space>
                  <Tooltip title="Group Info">
                    <Button
                      type="text"
                      icon={<InfoCircleOutlined />}
                      onClick={() => setShowGroupInfo(true)}
                    />
                  </Tooltip>
                  <Dropdown
                    menu={{
                      items: [
                        { key: 'mute', label: 'Mute notifications', icon: <UserOutlined /> },
                        { key: 'leave', label: 'Leave group', icon: <DeleteOutlined />, danger: true },
                      ]
                    }}
                  >
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                </Space>
              </div>

              {/* Messages Area */}
              <div className="messages-container">
                <List
                  dataSource={messages}
                  renderItem={(msg) => (
                    <div
                      className={`message-item ${
                        msg.senderId === user?.id ? 'own-message' : 'other-message'
                      }`}
                    >
                      <div className="message-content">
                        {msg.senderId !== user?.id && (
                          <div className="message-sender">
                            <Avatar 
                              size={32} 
                              src={msg.senderAvatar} 
                              icon={<UserOutlined />}
                              style={{
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                            <Text strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                              {msg.senderName}
                            </Text>
                            {msg.senderId.includes('dept') && (
                              <Tag 
                                color="blue"
                                style={{
                                  fontSize: '10px',
                                  background: 'rgba(24, 144, 255, 0.2)',
                                  border: '1px solid rgba(24, 144, 255, 0.4)',
                                  backdropFilter: 'blur(10px)'
                                }}
                              >
                                Official
                              </Tag>
                            )}
                          </div>
                        )}
                        <div className="message-bubble">
                          <div className="message-text">{msg.content}</div>
                          <div className="message-timestamp">
                            {formatTimestamp(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                />
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <div className="message-input">
                  <Button
                    type="text"
                    icon={<PictureOutlined />}
                    onClick={() => message.info('File upload coming soon!')}
                  />
                  <TextArea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    className="message-textarea"
                  />
                  <Button
                    type="text"
                    icon={<SmileOutlined />}
                    onClick={() => message.info('Emoji picker coming soon!')}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="empty-state">
                <TeamOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                <Title level={3} type="secondary">Select a group to start chatting</Title>
                <Text type="secondary">
                  Choose from the community groups on the left to join the conversation
                </Text>
              </div>
            </div>
          )}
        </Col>
      </Row>

      {/* Group Info Modal */}
      <Modal
        title="Group Information"
        open={showGroupInfo}
        onCancel={() => setShowGroupInfo(false)}
        footer={null}
        width={500}
      >
        {selectedGroupData && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={80} style={{ backgroundColor: getCategoryColor(selectedGroupData.category) }}>
                {getCategoryIcon(selectedGroupData.category)}
              </Avatar>
              <Title level={4} style={{ marginTop: 16 }}>{selectedGroupData.name}</Title>
              <Text type="secondary">{selectedGroupData.description}</Text>
            </div>
            
            <Divider />
            
            <div>
              <Text strong>Members: </Text>
              <Text>{selectedGroupData.members}</Text>
            </div>
            
            <div>
              <Text strong>Category: </Text>
              <Tag color={getCategoryColor(selectedGroupData.category)}>
                {selectedGroupData.category}
              </Tag>
            </div>
            
            <div>
              <Text strong>Created: </Text>
              <Text>2 weeks ago</Text>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default CommunityChat;