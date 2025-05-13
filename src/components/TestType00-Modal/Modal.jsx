import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css';

const Modal = ({ isOpen, closeModal, data, onUpdate }) => {
  const [lojas, setLojas] = useState('');
  const [horaDe, setHoraDe] = useState('');
  const [horaAte, setHoraAte] = useState('');

  // Sync state when data changes
  useEffect(() => {
    if (data) {
      setLojas(data.lojas || '');
      setHoraDe(data.hora_de || '');
      setHoraAte(data.hora_ate || '');
    }
  }, [data]);

  if (!isOpen || !data) return null;

  const handleSave = async () => {
    try {
      await axios.put(`/api/endpoint/${data.Guia}`, {
        lojas,
        hora_de: horaDe,
        hora_ate: horaAte,
      });
      if (onUpdate) onUpdate(); // optional: refresh parent data
      closeModal();
    } catch (err) {
      console.error('Error updating data:', err);
      alert('Failed to update data.');
    }
  };

  const dateFields = ['D. Registo', 'DiaEntrega'];

  return (
    <div className='modal-overlay' onClick={closeModal}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='close-btn' onClick={closeModal}>
          &times;
        </button>
        <h2>Details</h2>
        <div className='modal-body'>
          {Object.entries(data).map(([key, value]) => (
            <div className='info-grid-modal' key={key}>
              <div>
                <p key={key}>
                  <strong>{key.toUpperCase()}:</strong>{' '}
                  {['lojas', 'hora_de', 'hora_ate'].includes(key) ? (
                    <input
                      type='text'
                      value={key === 'lojas' ? lojas : key === 'hora_de' ? horaDe : horaAte}
                      onChange={(e) =>
                        key === 'lojas'
                          ? setLojas(e.target.value)
                          : key === 'hora_de'
                          ? setHoraDe(e.target.value)
                          : setHoraAte(e.target.value)
                      }
                    />
                  ) : // Check if the cell value is a date and format it
                  dateFields.includes(key) ? (
                    new Date(value).toLocaleDateString('pt-PT')
                  ) : (
                    value
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className='save-btn' onClick={handleSave}>
          Save changes
        </button>
      </div>
    </div>
  );
};

export default Modal;
