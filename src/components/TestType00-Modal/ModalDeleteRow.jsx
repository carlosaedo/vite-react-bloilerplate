import React, { useState, useEffect } from 'react';
import api from '../api/torrestirApi';
import { dateFieldsArray } from '../../config/componentsSpecialConfigurations';
import './Modal.css';

const ModalDeleteRow = ({ isOpenDeleteRow, closeModalDeleteRow, data, onUpdate }) => {
  if (!isOpenDeleteRow || !data) return null;

  const handleDelete = async () => {
    try {
      await api.delete(`/api/endpoint/${data.Guia}`);
      if (onUpdate) onUpdate(); // optional: refresh parent data
      closeModalDeleteRow();
    } catch (err) {
      console.error('Error updating data:', err);
      alert('Failed to update data.');
    }
  };

  const dateFields = dateFieldsArray;

  return (
    <div className='modal-overlay' onClick={closeModalDeleteRow}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='close-btn' onClick={closeModalDeleteRow}>
          &times;
        </button>
        <h2>Confirm operation</h2>
        <div className='modal-body'>
          {Object.entries(data).map(([key, value]) => (
            <div className='info-grid-modal' key={key}>
              <div>
                <p key={key}>
                  <strong>{key.toUpperCase()}:</strong>{' '}
                  {dateFields.includes(key) ? new Date(value).toLocaleDateString('pt-PT') : value}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className='save-btn' onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ModalDeleteRow;
