import React from 'react';
import { useSocket } from '../context/SocketContext';

const ConnectionStatus = () => {
  const { connected, reconnecting } = useSocket();

  if (reconnecting) {
    return (
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <div className="toast show" role="alert">
          <div className="toast-header">
            <div className="spinner-border spinner-border-sm text-warning me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <strong className="me-auto">Reconnecting...</strong>
          </div>
          <div className="toast-body">
            Attempting to restore connection...
          </div>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <div className="toast show" role="alert">
          <div className="toast-header">
            <i className="fas fa-wifi-slash text-danger me-2"></i>
            <strong className="me-auto text-danger">Disconnected</strong>
          </div>
          <div className="toast-body">
            Real-time updates are unavailable. Check your connection.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
      <div className="toast show" role="alert">
        <div className="toast-header">
          <i className="fas fa-wifi text-success me-2"></i>
          <strong className="me-auto text-success">Connected</strong>
          <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div className="toast-body">
          Real-time updates are active.
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;
