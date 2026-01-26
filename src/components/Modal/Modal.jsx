import React from 'react';
import ReactDOM from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  // If not open, don't render anything
  if (!isOpen) return null;

  // We "teleport" the modal to the 'root' or body to avoid CSS clipping issues
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}><X size={20}/></button>
        
        <div className="modal-icon">
          <AlertTriangle color="#ff4a4a" size={40} />
        </div>

        <div className="modal-content">
          <h2>{title}</h2>
          <p>{message}</p>
        </div>

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn confirm" onClick={() => { onConfirm(); onClose(); }}>
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;