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
  Modal,
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
  FaTimes,
  FaSmile,
  FaPaperclip,
  FaCheck,
  FaCheckDouble,
  FaComments,

  FaUser,
  FaStar,
  FaMapMarkerAlt,
  FaBriefcase,
  FaBuilding,
  FaClock,
  FaFilter,
  FaSort
} from 'react-icons/fa';

import { BsCircleFill, BsDot } from 'react-icons/bs';
import './ClientChatComponent.css';

const ClientChatComponent = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // recent, name, unread
  const [filterBy, setFilterBy] = useState('all'); // all, online, unread
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Mock clients data
  const mockClients = [
    {
      id: 'client-1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      company: 'TechStart Inc.',
      role: 'Product Manager',
      isOnline: true,
      lastSeen: new Date(),
      projectsCount: 3,
      rating: 4.8,
      location: 'San Francisco, CA',
      hasUnreadMessages: true,
      unreadCount: 2,
      lastMessage: {

        text: 'Can we discuss the project timeline? I have some concerns about the delivery date.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15)
      },
      activeProjects: [
        { id: 1, title: 'E-commerce Website', status: 'In Progress' },
        { id: 2, title: 'Mobile App Design', status: 'Review' }
      ]
    },
    {
      id: 'client-2',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      company: 'Digital Solutions Ltd.',
      role: 'CEO',
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
      projectsCount: 5,
      rating: 4.9,
      location: 'New York, NY',
      hasUnreadMessages: false,
      unreadCount: 0,
      lastMessage: {

        text: 'Thanks for the quick turnaround! The quality exceeded my expectations.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4)
      },
      activeProjects: [
        { id: 3, title: 'Brand Identity Design', status: 'Completed' }
      ]
    },
    {
      id: 'client-3',
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      company: 'Creative Agency',
      role: 'Creative Director',
      isOnline: true,
      lastSeen: new Date(),
      projectsCount: 2,
      rating: 4.7,
      location: 'Los Angeles, CA',
      hasUnreadMessages: true,
      unreadCount: 1,
      lastMessage: {

        text: 'Love the new designs! Can we implement them by next week?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30)
      },
      activeProjects: [
        { id: 4, title: 'Website Redesign', status: 'In Progress' }
      ]
    },
    {
      id: 'client-4',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      company: 'StartupHub',
      role: 'Founder',
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 6),
      projectsCount: 1,
      rating: 5.0,
      location: 'Austin, TX',
      hasUnreadMessages: false,
      unreadCount: 0,
      lastMessage: {

        text: 'Looking forward to the next phase! Your work has been exceptional.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8)
      },
      activeProjects: [
        { id: 5, title: 'MVP Development', status: 'Planning' }
      ]
    },
    {
      id: 'client-5',
      name: 'Lisa Wang',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      company: 'Fashion Forward',
      role: 'Marketing Director',
      isOnline: true,
      lastSeen: new Date(),
      projectsCount: 4,
      rating: 4.6,
      location: 'Miami, FL',
      hasUnreadMessages: false,
      unreadCount: 0,
      lastMessage: {

        text: 'The campaign looks amazing! Our engagement rates have increased significantly.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12)
      },
      activeProjects: [
        { id: 6, title: 'Social Media Campaign', status: 'Review' }
      ]
    },
    {
      id: 'client-6',
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      company: 'Wilson Consulting',
      role: 'Senior Consultant',
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24),
      projectsCount: 2,
      rating: 4.8,
      location: 'Chicago, IL',
      hasUnreadMessages: true,
      unreadCount: 3,
      lastMessage: {

        text: 'Can we schedule a call tomorrow? I have some urgent requirements to discuss.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      activeProjects: [
        { id: 7, title: 'Business Strategy Report', status: 'In Progress' }
      ]
    }
  ];

  // Mock messages for selected client
  const mockMessages = {
    'client-1': [
      {
        id: 1,
        senderId: 'client-1',
        text: 'Hi! I wanted to discuss the project timeline with you.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        status: 'read'
      },
      {
        id: 2,
        senderId: currentUser.id,
        text: 'Of course! I\'m available to discuss. What specific aspects would you like to cover?',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        status: 'read'
      },
      {
        id: 3,
        senderId: 'client-1',
        text: 'I\'m particularly interested in the delivery milestones and if we can accelerate the mobile version.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'read'
      },
      {
        id: 4,
        senderId: currentUser.id,
        text: 'That\'s definitely possible. Let me review the current scope and get back to you with a revised timeline.',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        status: 'delivered'
      },
      {
        id: 5,
        senderId: 'client-1',
        text: 'Can we discuss the project timeline?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        status: 'delivered'
      }
    ]
  };

  useEffect(() => {
    setClients(mockClients);
  }, []);

  useEffect(() => {
    if (selectedClient && showChatModal) {
      setMessages(mockMessages[selectedClient.id] || []);
      scrollToBottom();
    }
  }, [selectedClient, showChatModal]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setShowChatModal(true);
    
    // Mark messages as read
    setClients(prev => 
      prev.map(c => 
        c.id === client.id 
          ? { ...c, hasUnreadMessages: false, unreadCount: 0 }
          : c
      )
    );
  };

  const handleCloseChatModal = () => {
    setShowChatModal(false);
    setSelectedClient(null);
    setMessage('');
    setMessages([]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedClient) return;

    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      text: message.trim(),
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Update client's last message
    setClients(prev =>
      prev.map(client =>
        client.id === selectedClient.id
          ? {
              ...client,
              lastMessage: {
                text: newMessage.text,
                timestamp: newMessage.timestamp
              }
            }
          : client
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


    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
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



  const sortClients = (clients) => {
    switch (sortBy) {
      case 'name':
        return [...clients].sort((a, b) => a.name.localeCompare(b.name));
      case 'unread':
        return [...clients].sort((a, b) => b.unreadCount - a.unreadCount);
      case 'recent':
      default:
        return [...clients].sort((a, b) => 
          new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
        );
    }
  };

  const filterClients = (clients) => {
    switch (filterBy) {
      case 'online':
        return clients.filter(client => client.isOnline);
      case 'unread':
        return clients.filter(client => client.hasUnreadMessages);
      case 'all':
      default:
        return clients;
    }
  };

  const filteredAndSortedClients = sortClients(
    filterClients(
      clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  const totalUnreadCount = clients.reduce((sum, client) => sum + client.unreadCount, 0);
  const onlineCount = clients.filter(client => client.isOnline).length;

  return (
    <div className="client-chat-container">
      <Container fluid className="h-100">
















        {/* Modern Header */}
        <div className="modern-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <FaComments />
              </div>
              <div className="header-text">
                <h1 className="header-title">Messages</h1>
                <p className="header-subtitle">Stay connected with your clients</p>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat-badge">
                <span className="stat-number">{totalUnreadCount}</span>
                <span className="stat-label">Unread</span>
              </div>
              <div className="stat-badge">
                <span className="stat-number">{onlineCount}</span>
                <span className="stat-label">Online</span>
              </div>
              <div className="stat-badge">
                <span className="stat-number">{clients.length}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-section">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filter-section">
            <Dropdown className="filter-dropdown">
              <Dropdown.Toggle variant="outline-secondary" className="filter-btn">
                <FaFilter className="me-2" />
                {filterBy === 'all' ? 'All Clients' : 
                 filterBy === 'online' ? 'Online' : 'Unread'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilterBy('all')}>
                  All Clients
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterBy('online')}>
                  Online Only
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterBy('unread')}>
                  Unread Messages
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="sort-dropdown">
              <Dropdown.Toggle variant="outline-secondary" className="sort-btn">
                <FaSort className="me-2" />
                {sortBy === 'recent' ? 'Recent' : 
                 sortBy === 'name' ? 'Name' : 'Unread'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSortBy('recent')}>
                  Most Recent
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('name')}>
                  Name (A-Z)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('unread')}>
                  Unread First
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Clients List */}
        <div className="clients-list-container">
          <div className="clients-list">
            {filteredAndSortedClients.map((client, index) => (
              <div 
                key={client.id} 
                className={`client-item ${client.hasUnreadMessages ? 'has-unread' : ''}`}
                onClick={() => handleClientSelect(client)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Unread Indicator Line */}
                {client.hasUnreadMessages && <div className="unread-line" />}
                
                <div className="client-main-content">
                  {/* Avatar Section */}
                  <div className="client-avatar-section">
                    <div className="avatar-wrapper">
                      <img 
                        src={client.avatar} 
                        alt={client.name}
                        className="client-avatar"
                      />
                      {client.isOnline && <div className="online-dot" />}
                      {client.hasUnreadMessages && (
                        <div className="unread-badge">
                          {client.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Client Info Section */}
                  <div className="client-info-section">
                    <div className="client-header-row">
                      <div className="client-name-group">
                        <h3 className="client-name">{client.name}</h3>
                        <div className="client-meta">
                          <span className="client-role">
                            <FaBriefcase className="meta-icon" />
                            {client.role}
                          </span>
                          <BsDot className="separator" />
                          <span className="client-company">
                            <FaBuilding className="meta-icon" />
                            {client.company}
                          </span>
                        </div>
                      </div>
                      
                      <div className="client-time-group">
                        <span className="message-time">
                          <FaClock className="time-icon" />
                          {formatTime(client.lastMessage.timestamp)}
                        </span>
                        <div className="client-rating">
                          <FaStar className="star-icon" />
                          <span>{client.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Last Message */}
                    <div className="last-message-row">
                      <p className={`last-message ${client.hasUnreadMessages ? 'unread' : ''}`}>
                        {client.lastMessage.text}
                      </p>
                    </div>

                    {/* Status Row */}
                    <div className="status-row">
                      <div className="status-left">
                        <span className="location">
                          <FaMapMarkerAlt className="location-icon" />
                          {client.location}
                        </span>
                        <BsDot className="separator" />
                        <span className="projects-count">
                          {client.projectsCount} project{client.projectsCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="status-right">
                        {client.activeProjects.map((project, idx) => (
                          <span 
                            key={project.id} 
                            className={`project-status-badge ${project.status.toLowerCase().replace(' ', '-')}`}
                          >
                            {project.status}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="client-action-section">
                    <Dropdown 
                      className="client-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Dropdown.Toggle variant="link" className="action-toggle">
                        <FaEllipsisV />
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item>
                          <FaUser className="me-2" />
                          View Profile
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <FaPhone className="me-2" />
                          Call Client
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <FaVideo className="me-2" />
                          Video Call
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-danger">
                          Block Client
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="hover-overlay" />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedClients.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <FaComments />
              </div>
              <h3 className="empty-title">No clients found</h3>
              <p className="empty-description">
                {searchTerm ? 
                  'Try adjusting your search terms or filters' : 
                  'You haven\'t started any conversations yet'
                }
              </p>
            </div>
          )}
        </div>
      </Container>

      {/* Chat Modal */}
      <Modal 
        show={showChatModal} 
        onHide={handleCloseChatModal}
        size="lg"
        className="chat-modal"
        backdrop="static"
      >
        <Modal.Header className="chat-modal-header">
          <div className="chat-header-info">
            <Image
              src={selectedClient?.avatar}
              alt={selectedClient?.name}
              className="modal-avatar"
            />
            <div className="modal-client-info">
              <h5 className="modal-client-name">{selectedClient?.name}</h5>
              <div className="modal-client-status">
                <Badge bg="primary" className="me-2">{selectedClient?.role}</Badge>
                <span className={`status-text ${selectedClient?.isOnline ? 'online' : 'offline'}`}>
                  {selectedClient?.isOnline ? 'Online' : `Last seen ${formatTime(selectedClient?.lastSeen)}`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="chat-header-actions">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Voice Call</Tooltip>}
            >
              <Button variant="outline-secondary" size="sm" className="modal-action-btn">
                <FaPhone />
              </Button>
            </OverlayTrigger>
            
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Video Call</Tooltip>}
            >
              <Button variant="outline-secondary" size="sm" className="modal-action-btn">
                <FaVideo />
              </Button>
            </OverlayTrigger>
            
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="modal-action-btn"
              onClick={handleCloseChatModal}
            >
              <FaTimes />
            </Button>
          </div>
        </Modal.Header>

        <Modal.Body className="chat-modal-body">
          {/* Project Info */}
          {selectedClient?.activeProjects.length > 0 && (
            <div className="modal-project-info">
              <strong>Current Projects: </strong>
              {selectedClient.activeProjects.map((project, index) => (
                <span key={project.id}>
                  {project.title}
                  {index < selectedClient.activeProjects.length - 1 && ', '}
                </span>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="modal-messages-container">
            {messages.map((msg, index) => {
              const isOwn = msg.senderId === currentUser.id;
              const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== msg.senderId);
              const showTime = index === 0 || 
                new Date(msg.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000;

              return (
                <div key={msg.id}>
                  {showTime && (
                    <div className="modal-message-time-divider">
                      <span className="modal-time-label">
                        {new Date(msg.timestamp).toLocaleDateString() === new Date().toLocaleDateString() 
                          ? formatMessageTime(msg.timestamp)
                          : new Date(msg.timestamp).toLocaleDateString()
                        }
                      </span>
                    </div>
                  )}
                  
                  <div className={`modal-message-wrapper ${isOwn ? 'own-message' : 'other-message'}`}>
                    {!isOwn && showAvatar && (
                      <Image
                        src={selectedClient?.avatar}
                        alt={selectedClient?.name}
                        className="modal-message-avatar"
                      />
                    )}
                    
                    <div className={`modal-message-bubble ${!isOwn && !showAvatar ? 'no-avatar' : ''}`}>
                      <div className="modal-message-content">
                        {msg.text}
                      </div>
                      <div className="modal-message-footer">
                        <span className="modal-message-timestamp">
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
              <div className="modal-message-wrapper other-message">
                <Image
                  src={selectedClient?.avatar}
                  alt={selectedClient?.name}
                  className="modal-message-avatar"
                />
                <div className="modal-message-bubble typing-indicator">
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
        </Modal.Body>

        <Modal.Footer className="chat-modal-footer">
          <Form onSubmit={handleSendMessage} className="modal-message-form">
            <div className="modal-input-wrapper">
              <Button
                variant="link"
                className="modal-attachment-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaPaperclip />
              </Button>
              
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="modal-message-input"
              />
              
              <Button
                variant="link"
                className="modal-emoji-btn"
              >
                <FaSmile />
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                disabled={!message.trim()}
                className="modal-send-btn"
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
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClientChatComponent;