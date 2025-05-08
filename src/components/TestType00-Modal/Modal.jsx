import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, closeModal, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className='modal-overlay' onClick={closeModal}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='close-btn' onClick={closeModal}>
          &times;
        </button>
        <h2>Row Details</h2>
        <div className='modal-body'>
          {Object.entries(data).map(([key, value]) => (
            <p key={key}>
              <strong>{key.toUpperCase()}:</strong> {value}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
