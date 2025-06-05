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
    <div className="card border-0 shadow-sm h-100" style={{ minHeight: '700px' }}>
      {/* Chat Header */}
      <div className="card-header bg-gradient text-white border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold">
            <i className="fas fa-comments me-2"></i>
            Messages
          </h5>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-light">
              <i className="fas fa-search"></i>
            </button>
            <button className="btn btn-sm btn-outline-light">
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
        
        {activeContact && (
          <div className="mt-2 pt-2 border-top border-light border-opacity-25">
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
                  <span className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle" style={{width: '10px', height: '10px'}}></span>
                )}
              </div>
              <div>
                <div className="fw-semibold" style={{fontSize: '0.9rem'}}>{activeContact.name}</div>
                <small className="opacity-75">
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
              className={`p-3 border-bottom cursor-pointer hover-bg-light ${activeChat === contact.id ? 'bg-primary bg-opacity-10 border-primary border-opacity-25' : ''}`}
              onClick={() => setActiveChat(contact.id)}
              style={{ cursor: 'pointer' }}
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
                    <span className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle" style={{width: '12px', height: '12px'}}></span>
                  )}
                </div>
                
                <div className="flex-grow-1 min-width-0">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="mb-0 fw-semibold text-truncate">{contact.name}</h6>
                    <small className="text-muted flex-shrink-0 ms-2">{contact.time}</small>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted d-block">{contact.role}</small>
                      <small className="text-muted text-truncate d-block" style={{fontSize: '0.75rem'}}>
                        {contact.lastMessage}
                      </small>
                    </div>
                    {contact.unread > 0 && (
                      <span className="badge bg-primary rounded-pill flex-shrink-0 ms-2">
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
        <div className="flex-grow-1 p-3" style={{ overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
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
                        <small className="text-primary fw-semibold">{msg.senderName}</small>
                        <small className="text-muted">{msg.time}</small>
                      </div>
                      <p className="mb-0" style={{fontSize: '0.9rem'}}>{msg.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="d-flex justify-content-end">
                  <div className="bg-primary text-white rounded-3 p-3 shadow-sm" style={{maxWidth: '75%'}}>
                    <p className="mb-0" style={{fontSize: '0.9rem'}}>{msg.message}</p>
                    <div className="text-end mt-1">
                      <small className="opacity-75">{msg.time}</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          <div className="d-flex align-items-center text-muted">
            <img 
              src="https://via.placeholder.com/24" 
              alt="Typing"
              className="rounded-circle me-2"
              width="24"
              height="24"
            />
            <small>
              <i className="fas fa-circle text-primary me-1" style={{fontSize: '0.5rem'}}></i>
              <i className="fas fa-circle text-primary me-1" style={{fontSize: '0.5rem'}}></i>
              <i className="fas fa-circle text-primary me-1" style={{fontSize: '0.5rem'}}></i>
              <span className="ms-1">Mike is typing...</span>
            </small>
          </div>
        </div>

        {/* Message Input */}
        <div className="border-top bg-white p-3">
          <form onSubmit={handleSendMessage}>
            <div className="d-flex gap-2 align-items-end">
              <button type="button" className="btn btn-outline-secondary btn-sm">
                <i className="fas fa-paperclip"></i>
              </button>
              <div className="flex-grow-1">
                <textarea 
                  className="form-control border-0 bg-light resize-none"
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
                  style={{resize: 'none'}}
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <button type="button" className="btn btn-outline-secondary btn-sm">
                  <i className="fas fa-smile"></i>
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm"
                  disabled={!message.trim()}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </form>
          
          <div className="d-flex justify-content-between align-items-center mt-2">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
              Press Enter to send, Shift+Enter for new line
            </small>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-success">
                <i className="fas fa-video me-1"></i>
                Video Call
              </button>
              <button className="btn btn-sm btn-outline-info">
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