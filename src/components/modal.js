import React from 'react';
import './modal.css'; // Add custom CSS for modal

function Modal({ isOpen, closeModal, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default Modal;
