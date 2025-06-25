import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Image, 
  Badge,
  InputGroup,
  Dropdown,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { 
  FaSearch, 
  FaPaperPlane, 
  FaPhone, 
  FaVideo, 
  FaEllipsisV,
  FaArrowLeft,
  FaSmile,
  FaPaperclip,
  FaCheck,
  FaCheckDouble,
  FaTimes
} from 'react-icons/fa';
import { BsCircleFill } from 'react-icons/bs';
import './ClassicChat.css';

const ClassicChat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Mock data
  const mockConversations = [
    {
      id: 1,
      user: {
        id: 'user-1',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        role: 'Freelancer',
        isOnline: true,
        lastSeen: new Date()
      },
      lastMessage: {
        text: 'Thanks for the feedback! I\'ll make those changes.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isRead: false,
        senderId: 'user-1'
      },
      unreadCount: 3,
      project: 'E-commerce Website'
    },
    {
      id: 2,
      user: {
        id: 'user-2',
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        role: 'Client',
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 30)
      },
      lastMessage: {
        text: 'Can we schedule a call tomorrow?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        isRead: true,
        senderId: 'user-2'
      },
      unreadCount: 0,
      project: 'Mobile App Design'
    },
    {
      id: 3,
      user: {
        id: 'user-3',
        name: 'Emily Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        role: 'Freelancer',
        isOnline: true,
        lastSeen: new Date()
      },
      lastMessage: {
        text: 'Project completed! Please review.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isRead: true,
        senderId: 'user-3'
      },
      unreadCount: 0,
      project: 'Logo Design'
    },
    {
      id: 4,
      user: {
        id: 'user-4',
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        role: 'Client',
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 4)
      },
      lastMessage: {
        text: 'Looking forward to working with you!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        isRead: true,
        senderId: currentUser.id
      },
      unreadCount: 0,
      project: 'Content Writing'
    }
  ];

  const mockMessages = {
    1: [
      {
        id: 1,
        senderId: 'user-1',
        text: 'Hi! I\'ve reviewed your project requirements and I\'m excited to work on this.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'read'
      },
      {
        id: 2,
        senderId: currentUser.id,
        text: 'Great! I looked at your portfolio and I\'m impressed. Can you walk me through your approach?',
        timestamp: new Date(Date.now() - 1000 * 60 * 50),
        status: 'read'
      },
      {
        id: 3,
        senderId: 'user-1',
        text: 'Absolutely! I\'ll start with a detailed analysis of your target audience and create wireframes based on modern UX principles.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        status: 'read'
      },
      {
        id: 4,
        senderId: 'user-1',
        text: 'I\'ll also ensure the design is fully responsive and optimized for performance.',
        timestamp: new Date(Date.now() - 1000 * 60 * 44),
        status: 'read'
      },
      {
        id: 5,
        senderId: currentUser.id,
        text: 'That sounds perfect! What\'s your estimated timeline?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'read'
      },
      {
        id: 6,
        senderId: 'user-1',
        text: 'I can deliver the initial designs within 5 days, and the complete project in 2 weeks.',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        status: 'delivered'
      },
      {
        id: 7,
        senderId: 'user-1',
        text: 'Thanks for the feedback! I\'ll make those changes.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: 'delivered'
      }
    ]
  };

  useEffect(() => {
    setConversations(mockConversations);
    setOnlineUsers(new Set(['user-1', 'user-3']));
  }, []);

  useEffect(() => {
    if (selectedChat) {
      setMessages(mockMessages[selectedChat.id] || []);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChatSelect = (conversation) => {
    setSelectedChat(conversation);
    // Mark as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, isRead: true } }
          : conv
      )
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      text: message.trim(),
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Update last message in conversations
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedChat.id
          ? {
              ...conv,
              lastMessage: {
                text: newMessage.text,
                timestamp: newMessage.timestamp,
                isRead: true,
                senderId: currentUser.id
              }
            }
          : conv
      )
    );

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 3000);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return messageTime.toLocaleDateString();
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <FaCheck className="message-status sent" />;
      case 'delivered':
        return <FaCheckDouble className="message-status delivered" />;
      case 'read':
        return <FaCheckDouble className="message-status read" />;
      default:
        return null;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="classic-chat-container">
      <Row className="h-100 g-0">
        {/* Sidebar - Conversations List */}
        <Col lg={4} md={5} className={`chat-sidebar ${selectedChat ? 'd-none d-md-block' : ''}`}>
          <div className="sidebar-header">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h4 className="sidebar-title">Messages</h4>
              <Button variant="outline-primary" size="sm" className="new-chat-btn">
                <FaPaperPlane className="me-1" /> New
              </Button>
            </div>
            
            {/* Search Bar */}
            <div className="search-container">
              <InputGroup>
                <InputGroup.Text className="search-icon">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </InputGroup>
            </div>
          </div>

          {/* Conversations List */}
          <div className="conversations-list">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${selectedChat?.id === conversation.id ? 'active' : ''}`}
                onClick={() => handleChatSelect(conversation)}
              >
                <div className="conversation-avatar">
                  <Image
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                    className="avatar-img"
                  />
                  {conversation.user.isOnline && (
                    <BsCircleFill className="online-indicator" />
                  )}
                </div>
                
                <div className="conversation-content">
                  <div className="conversation-header">
                    <h6 className="user-name">{conversation.user.name}</h6>
                    <span className="message-time">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  
                  <div className="conversation-meta">
                    <Badge 
                      bg={conversation.user.role === 'Client' ? 'primary' : 'success'} 
                      className="role-badge"
                    >
                      {conversation.user.role}
                    </Badge>
                    <span className="project-name">{conversation.project}</span>
                  </div>
                  
                  <div className="last-message">
                    <p className={`message-preview ${!conversation.lastMessage.isRead && conversation.lastMessage.senderId !== currentUser.id ? 'unread' : ''}`}>
                      {conversation.lastMessage.senderId === currentUser.id && 'You: '}
                      {conversation.lastMessage.text}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge bg="danger" className="unread-badge">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Col>

        {/* Main Chat Area */}
        <Col lg={8} md={7} className={`chat-main ${!selectedChat ? 'd-none d-md-block' : ''}`}>
          {selectedChat ? (
            <div className="chat-container">
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-header-left">
                  <Button
                    variant="link"
                    className="d-md-none back-btn"
                    onClick={() => setSelectedChat(null)}
                  >
                    <FaArrowLeft />
                  </Button>
                  
                  <div className="chat-user-info">
                    <Image
                      src={selectedChat.user.avatar}
                      alt={selectedChat.user.name}
                      className="chat-avatar"
                    />
                    <div className="user-details">
                      <h5 className="chat-user-name">{selectedChat.user.name}</h5>
                      <div className="user-status">
                        <Badge 
                          bg={selectedChat.user.role === 'Client' ? 'primary' : 'success'}
                          className="me-2"
                        >
                          {selectedChat.user.role}
                        </Badge>
                        <span className={`status-text ${selectedChat.user.isOnline ? 'online' : 'offline'}`}>
                          {selectedChat.user.isOnline ? 'Online' : `Last seen ${formatTime(selectedChat.user.lastSeen)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="chat-header-actions">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Voice Call</Tooltip>}
                  >
                    <Button variant="outline-secondary" size="sm" className="action-btn">
                      <FaPhone />
                    </Button>
                  </OverlayTrigger>
                  
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Video Call</Tooltip>}
                  >
                    <Button variant="outline-secondary" size="sm" className="action-btn">
                      <FaVideo />
                    </Button>
                  </OverlayTrigger>
                  
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm" className="action-btn">
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>View Profile</Dropdown.Item>
                      <Dropdown.Item>View Project</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item>Block User</Dropdown.Item>
                      <Dropdown.Item className="text-danger">Delete Chat</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              {/* Project Info Bar */}
              <div className="project-info-bar">
                <div className="project-info">
                  <strong>Project:</strong> {selectedChat.project}
                </div>
              </div>

              {/* Messages Area */}
              <div className="messages-container">
                <div className="messages-list">
                  {messages.map((msg, index) => {
                    const isOwn = msg.senderId === currentUser.id;
                    const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== msg.senderId);
                    const showTime = index === 0 || 
                      new Date(msg.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000; // 5 minutes

                    return (
                      <div key={msg.id}>
                        {showTime && (
                          <div className="message-time-divider">
                            <span className="time-label">
                              {new Date(msg.timestamp).toLocaleDateString() === new Date().toLocaleDateString() 
                                ? formatMessageTime(msg.timestamp)
                                : new Date(msg.timestamp).toLocaleDateString()
                              }
                            </span>
                          </div>
                        )}
                        
                        <div className={`message-wrapper ${isOwn ? 'own-message' : 'other-message'}`}>
                          {!isOwn && showAvatar && (
                            <Image
                              src={selectedChat.user.avatar}
                              alt={selectedChat.user.name}
                              className="message-avatar"
                            />
                          )}
                          
                          <div className={`message-bubble ${!isOwn && !showAvatar ? 'no-avatar' : ''}`}>
                            <div className="message-content">
                              {msg.text}
                            </div>
                            <div className="message-footer">
                              <span className="message-timestamp">
                                {formatMessageTime(msg.timestamp)}
                              </span>
                              {isOwn && getStatusIcon(msg.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {isTyping && (
                    <div className="message-wrapper other-message">
                      <Image
                        src={selectedChat.user.avatar}
                        alt={selectedChat.user.name}
                        className="message-avatar"
                      />
                      <div className="message-bubble typing-indicator">
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <Form onSubmit={handleSendMessage} className="message-form">
                  <div className="input-wrapper">
                    <Button
                      variant="link"
                      className="attachment-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaPaperclip />
                    </Button>
                    
                    <Form.Control
                      type="text"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="message-input"
                    />
                    
                    <Button
                      variant="link"
                      className="emoji-btn"
                    >
                      <FaSmile />
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!message.trim()}
                      className="send-btn"
                    >
                      <FaPaperPlane />
                    </Button>
                  </div>
                </Form>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*,application/pdf,.doc,.docx"
                />
              </div>
            </div>
          ) : (
            // No Chat Selected
            <div className="no-chat-selected">
              <div className="no-chat-content">
                <div className="no-chat-icon">💬</div>
                <h3>Welcome to Messages</h3>
                <p>Select a conversation from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ClassicChat;