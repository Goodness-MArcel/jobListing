import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Badge, Form, Button, Image, ListGroup, InputGroup } from 'react-bootstrap';
import { FaSearch, FaPaperPlane, FaCircle, FaArrowLeft, FaEllipsisV } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import './ChatComponent.css';

const ChatComponent = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Mock data - replace with actual API calls
  const mockConversations = [
    {
      id: 1,
      participant: {
        id: 'user-1',
        name: 'Sarah Johnson',
        role: 'freelancer',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        isOnline: true
      },
      lastMessage: {
        text: 'Thanks for considering my proposal!',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        isRead: false
      },
      unreadCount: 2,
      projectTitle: 'E-commerce Website Development'
    },
    {
      id: 2,
      participant: {
        id: 'user-2',
        name: 'Michael Chen',
        role: 'client',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        isOnline: false
      },
      lastMessage: {
        text: 'When can we schedule a call?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: true
      },
      unreadCount: 0,
      projectTitle: 'Mobile App UI Design'
    },
    {
      id: 3,
      participant: {
        id: 'user-3',
        name: 'Emily Rodriguez',
        role: 'freelancer',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        isOnline: true
      },
      lastMessage: {
        text: 'I\'ve uploaded the latest designs',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: true
      },
      unreadCount: 0,
      projectTitle: 'Logo Design Project'
    }
  ];

  const mockMessages = {
    1: [
      {
        id: 1,
        senderId: 'user-1',
        text: 'Hi! I saw your project posting and I\'m very interested.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isOwn: false
      },
      {
        id: 2,
        senderId: currentUser.id,
        text: 'Great! I\'d love to hear more about your experience.',
        timestamp: new Date(Date.now() - 1000 * 60 * 50),
        isOwn: true
      },
      {
        id: 3,
        senderId: 'user-1',
        text: 'I have 5+ years of experience in React and Node.js. I\'ve built similar e-commerce platforms before.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        isOwn: false
      },
      {
        id: 4,
        senderId: 'user-1',
        text: 'Thanks for considering my proposal!',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isOwn: false
      }
    ]
  };

  useEffect(() => {
    setConversations(mockConversations);
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
      isOwn: true
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
                isRead: true
              }
            }
          : conv
      )
    );
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return messageTime.toLocaleDateString();
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    return role === 'client' ? 'primary' : 'success';
  };

  const getRoleBadge = (role) => {
    return role === 'client' ? 'Client' : 'Freelancer';
  };

  return (
    <Container fluid className="chat-container p-0">
      <Row className="h-100 g-0">
        {/* Conversations List */}
        <Col md={4} className={`conversations-panel ${selectedChat ? 'd-none d-md-block' : ''}`}>
          <Card className="h-100 border-0 rounded-0">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="mb-0 fw-bold">Messages</h5>
                <BsThreeDotsVertical className="text-muted" style={{ cursor: 'pointer' }} />
              </div>
              
              {/* Search Bar */}
              <InputGroup className="mt-3">
                <InputGroup.Text className="bg-light border-end-0">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0 bg-light"
                />
              </InputGroup>
            </Card.Header>

            <Card.Body className="p-0 overflow-auto">
              <ListGroup variant="flush">
                {filteredConversations.map((conversation) => (
                  <ListGroup.Item
                    key={conversation.id}
                    className={`conversation-item border-0 ${selectedChat?.id === conversation.id ? 'active' : ''}`}
                    onClick={() => handleChatSelect(conversation)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center p-2">
                      <div className="position-relative me-3">
                        <Image
                          src={conversation.participant.avatar}
                          alt={conversation.participant.name}
                          width={50}
                          height={50}
                          roundedCircle
                          className="border"
                        />
                        {conversation.participant.isOnline && (
                          <FaCircle
                            className="position-absolute bottom-0 end-0 text-success"
                            style={{ fontSize: '12px' }}
                          />
                        )}
                      </div>
                      
                      <div className="flex-grow-1 min-width-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="min-width-0 flex-grow-1">
                            <h6 className="mb-1 fw-semibold text-truncate">
                              {conversation.participant.name}
                            </h6>
                            <Badge 
                              bg={getRoleColor(conversation.participant.role)} 
                              className="mb-1 small"
                            >
                              {getRoleBadge(conversation.participant.role)}
                            </Badge>
                          </div>
                          <div className="text-end">
                            <small className="text-muted">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </small>
                            {conversation.unreadCount > 0 && (
                              <Badge bg="danger" className="ms-2 rounded-pill">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="mb-1 text-muted small text-truncate">
                          <strong>Project:</strong> {conversation.projectTitle}
                        </p>
                        
                        <p className={`mb-0 small text-truncate ${!conversation.lastMessage.isRead ? 'fw-semibold' : 'text-muted'}`}>
                          {conversation.lastMessage.text}
                        </p>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {filteredConversations.length === 0 && (
                <div className="text-center py-5">
                  <p className="text-muted">No conversations found</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Chat Messages */}
        <Col md={8} className={`chat-panel ${!selectedChat ? 'd-none d-md-block' : ''}`}>
          {selectedChat ? (
            <Card className="h-100 border-0 rounded-0">
              {/* Chat Header */}
              <Card.Header className="bg-white border-bottom">
                <div className="d-flex align-items-center">
                  <Button
                    variant="link"
                    className="d-md-none p-0 me-3 text-dark"
                    onClick={() => setSelectedChat(null)}
                  >
                    <FaArrowLeft />
                  </Button>
                  
                  <div className="position-relative me-3">
                    <Image
                      src={selectedChat.participant.avatar}
                      alt={selectedChat.participant.name}
                      width={40}
                      height={40}
                      roundedCircle
                    />
                    {selectedChat.participant.isOnline && (
                      <FaCircle
                        className="position-absolute bottom-0 end-0 text-success"
                        style={{ fontSize: '10px' }}
                      />
                    )}
                  </div>
                  
                  <div className="flex-grow-1">
                    <h6 className="mb-0 fw-semibold">{selectedChat.participant.name}</h6>
                    <small className="text-muted">
                      <Badge bg={getRoleColor(selectedChat.participant.role)} className="me-2">
                        {getRoleBadge(selectedChat.participant.role)}
                      </Badge>
                      {selectedChat.participant.isOnline ? 'Online' : 'Offline'}
                    </small>
                  </div>
                  
                  <FaEllipsisV className="text-muted" style={{ cursor: 'pointer' }} />
                </div>
                
                <div className="mt-2">
                  <small className="text-muted">
                    <strong>Project:</strong> {selectedChat.projectTitle}
                  </small>
                </div>
              </Card.Header>

              {/* Messages Area */}
              <Card.Body className="messages-area overflow-auto p-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-bubble mb-3 ${msg.isOwn ? 'own-message' : 'other-message'}`}
                  >
                    <div className={`d-flex ${msg.isOwn ? 'justify-content-end' : 'justify-content-start'}`}>
                      <div className={`message-content ${msg.isOwn ? 'bg-primary text-white' : 'bg-light'}`}>
                        <p className="mb-1">{msg.text}</p>
                        <small className={`${msg.isOwn ? 'text-white-50' : 'text-muted'}`}>
                          {formatMessageTime(msg.timestamp)}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </Card.Body>

              {/* Message Input */}
              <Card.Footer className="bg-white border-top">
                <Form onSubmit={handleSendMessage}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="border-0 bg-light"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!message.trim()}
                    >
                      <FaPaperPlane />
                    </Button>
                  </InputGroup>
                                </Form>
              </Card.Footer>
            </Card>
          ) : (
            // No Chat Selected State
            <div className="d-flex align-items-center justify-content-center h-100 bg-light">
              <div className="text-center">
                <div className="mb-4">
                  <div className="chat-placeholder-icon mb-3">
                    💬
                  </div>
                  <h4 className="text-muted">Select a conversation</h4>
                  <p className="text-muted">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatComponent;
