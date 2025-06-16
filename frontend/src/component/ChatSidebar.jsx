import React, { useState } from "react";

function ChatSidebar() {
  const [activeChat, setActiveChat] = useState(3);
  const [message, setMessage] = useState('');

  const contacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "UI/UX Designer",
      avatar: "https://via.placeholder.com/40",
      unread: 2,
      lastMessage: "I'll send the designs today",
      time: "2m ago",
      online: true
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Full Stack Developer",
      avatar: "https://via.placeholder.com/40",
      unread: 0,
      lastMessage: "Thanks for the feedback!",
      time: "1h ago",
      online: true
    },
    {
      id: 3,
      name: "Emma Wilson",
      role: "Content Writer",
      avatar: "https://via.placeholder.com/40",
      unread: 1,
      lastMessage: "When do you need the articles?",
      time: "3h ago",
      online: false
    }
  ];

  const messages = [
    {
      id: 1,
      senderId: 2,
      senderName: "Mike Chen",
      message: "Hi! I've reviewed your e-commerce project requirements. I have 5+ years of experience with React and Node.js.",
      time: "10:30 AM",
      avatar: "https://via.placeholder.com/30"
    },
    {
      id: 2,
      senderId: 'me',
      message: "That sounds great! Can you share some of your previous work?",
      time: "10:35 AM"
    },
    {
      id: 3,
      senderId: 2,
      senderName: "Mike Chen",
      message: "Absolutely! I'll send you my portfolio link and some case studies.",
      time: "10:38 AM",
      avatar: "https://via.placeholder.com/30"
    },
    {
      id: 4,
      senderId: 2,
      senderName: "Mike Chen",
      message: "Here's my portfolio: www.mikechen-dev.com",
      time: "10:39 AM",
      avatar: "https://via.placeholder.com/30"
    }
  ];

  const activeContact = contacts.find(c => c.id === activeChat);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message sending logic here
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="card border-0 shadow-sm h-100" style={{ minHeight: '700px', backgroundColor: '#fff' }}>
      {/* Chat Header */}
      <div 
        className="card-header border-0" 
        style={{ 
          backgroundColor: '#14a800',
          color: '#fff'
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold" style={{ color: '#fff' }}>
            <i className="fas fa-comments me-2"></i>
            Messages
          </h5>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff'
              }}
            >
              <i className="fas fa-search"></i>
            </button>
            <button 
              className="btn btn-sm"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff'
              }}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
        
        {activeContact && (
          <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="d-flex align-items-center">
              <div className="position-relative me-2">
                <img 
                  src={activeContact.avatar} 
                  alt={activeContact.name}
                  className="rounded-circle"
                  width="32"
                  height="32"
                />
                {activeContact.online && (
                  <span 
                    className="position-absolute bottom-0 end-0 border border-2 border-white rounded-circle" 
                    style={{
                      width: '10px', 
                      height: '10px',
                      backgroundColor: '#14a800'
                    }}
                  ></span>
                )}
              </div>
              <div>
                <div className="fw-semibold" style={{fontSize: '0.9rem', color: '#fff'}}>
                  {activeContact.name}
                </div>
                <small style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {activeContact.online ? 'Online' : 'Offline'}
                </small>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="d-flex flex-column" style={{ height: '600px' }}>
        {/* Chat Contacts List */}
        <div className="border-bottom" style={{ height: '200px', overflowY: 'auto' }}>
          {contacts.map((contact) => (
            <div 
              key={contact.id}
              className={`p-3 border-bottom cursor-pointer ${activeChat === contact.id ? '' : ''}`}
              onClick={() => setActiveChat(contact.id)}
              style={{ 
                cursor: 'pointer',
                backgroundColor: activeChat === contact.id ? 'rgba(20, 168, 0, 0.1)' : 'transparent',
                borderLeft: activeChat === contact.id ? '3px solid #14a800' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (activeChat !== contact.id) {
                  e.target.style.backgroundColor = '#f7f8f9';
                }
              }}
              onMouseLeave={(e) => {
                if (activeChat !== contact.id) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div className="d-flex align-items-center">
                <div className="position-relative me-3">
                  <img 
                    src={contact.avatar} 
                    alt={contact.name}
                    className="rounded-circle"
                    width="45"
                    height="45"
                  />
                  {contact.online && (
                    <span 
                      className="position-absolute bottom-0 end-0 border border-2 border-white rounded-circle" 
                      style={{
                        width: '12px', 
                        height: '12px',
                        backgroundColor: '#14a800'
                      }}
                    ></span>
                  )}
                </div>
                
                <div className="flex-grow-1 min-width-0">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="mb-0 fw-semibold text-truncate" style={{ color: '#000' }}>
                      {contact.name}
                    </h6>
                    <small style={{ color: '#000', opacity: '0.6' }} className="flex-shrink-0 ms-2">
                      {contact.time}
                    </small>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="d-block" style={{ color: '#000', opacity: '0.7' }}>
                        {contact.role}
                      </small>
                      <small 
                        className="text-truncate d-block" 
                        style={{fontSize: '0.75rem', color: '#000', opacity: '0.6'}}
                      >
                        {contact.lastMessage}
                      </small>
                    </div>
                    {contact.unread > 0 && (
                      <span 
                        className="badge rounded-pill flex-shrink-0 ms-2"
                        style={{
                          backgroundColor: '#14a800',
                          color: '#fff'
                        }}
                      >
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-grow-1 p-3" style={{ overflowY: 'auto', backgroundColor: '#f7f8f9' }}>
          {messages.map((msg) => (
            <div key={msg.id} className={`mb-3 ${msg.senderId === 'me' ? 'text-end' : ''}`}>
              {msg.senderId !== 'me' ? (
                <div className="d-flex align-items-start">
                  <img 
                    src={msg.avatar} 
                    alt={msg.senderName}
                    className="rounded-circle me-2 flex-shrink-0"
                    width="32"
                    height="32"
                  />
                  <div className="flex-grow-1">
                    <div className="bg-white rounded-3 p-3 shadow-sm border">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small style={{ color: '#14a800', fontWeight: '600' }}>
                          {msg.senderName}
                        </small>
                        <small style={{ color: '#000', opacity: '0.6' }}>
                          {msg.time}
                        </small>
                      </div>
                      <p className="mb-0" style={{fontSize: '0.9rem', color: '#000'}}>
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="d-flex justify-content-end">
                  <div 
                    className="rounded-3 p-3 shadow-sm" 
                    style={{
                      maxWidth: '75%',
                      backgroundColor: '#14a800',
                      color: '#fff'
                    }}
                  >
                    <p className="mb-0" style={{fontSize: '0.9rem', color: '#fff'}}>
                      {msg.message}
                    </p>
                    <div className="text-end mt-1">
                      <small style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {msg.time}
                      </small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          <div className="d-flex align-items-center">
            <img 
              src="https://via.placeholder.com/24" 
              alt="Typing"
              className="rounded-circle me-2"
              width="24"
              height="24"
            />
            <small style={{ color: '#000', opacity: '0.7' }}>
              <i className="fas fa-circle me-1" style={{fontSize: '0.5rem', color: '#14a800'}}></i>
              <i className="fas fa-circle me-1" style={{fontSize: '0.5rem', color: '#14a800'}}></i>
              <i className="fas fa-circle me-1" style={{fontSize: '0.5rem', color: '#14a800'}}></i>
              <span className="ms-1">Mike is typing...</span>
            </small>
          </div>
        </div>

        {/* Message Input */}
        <div className="border-top bg-white p-3">
          <form onSubmit={handleSendMessage}>
            <div className="d-flex gap-2 align-items-end">
              <button 
                type="button" 
                className="btn btn-sm"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #e0e0e0',
                  color: '#000'
                }}
              >
                <i className="fas fa-paperclip"></i>
              </button>
              <div className="flex-grow-1">
                <textarea 
                  className="form-control border-0"
                  placeholder="Type your message..."
                  rows="2"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  style={{
                    resize: 'none',
                    backgroundColor: '#f7f8f9',
                    color: '#000'
                  }}
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <button 
                  type="button" 
                  className="btn btn-sm"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #e0e0e0',
                    color: '#000'
                  }}
                >
                  <i className="fas fa-smile"></i>
                </button>
                <button 
                  type="submit" 
                  className="btn btn-sm"
                  disabled={!message.trim()}
                  style={{
                    backgroundColor: message.trim() ? '#14a800' : '#e0e0e0',
                    border: 'none',
                    color: '#fff'
                  }}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </form>
          
          <div className="d-flex justify-content-between align-items-center mt-2">
            <small style={{ color: '#000', opacity: '0.7' }}>
              <i className="fas fa-info-circle me-1"></i>
              Press Enter to send, Shift+Enter for new line
            </small>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-sm"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #14a800',
                  color: '#14a800'
                }}
              >
                <i className="fas fa-video me-1"></i>
                Video Call
              </button>
              <button 
                className="btn btn-sm"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #14a800',
                  color: '#14a800'
                }}
              >
                <i className="fas fa-phone me-1"></i>
                Voice Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatSidebar;