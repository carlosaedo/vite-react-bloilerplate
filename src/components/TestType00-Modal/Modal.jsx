import React, { useState, useEffect } from 'react';
import api from '../api/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { dateFieldsArray } from '../../config/componentsSpecialConfigurations';

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
      await api.put(`/api/endpoint/${data.Guia}`, {
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

  const dateFields = dateFieldsArray;

  return (
    <Dialog open={isOpen} onClose={closeModal} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6' sx={{ color: '#003e2d' }}>
          Details
        </Typography>{' '}
        {/* Applying primary green color */}
        <IconButton onClick={closeModal}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {Object.entries(data).map(([key, value], index) => (
          <div key={key}>
            <Typography variant='subtitle2' gutterBottom sx={{ color: '#003e2d' }}>
              {key.toUpperCase()}
            </Typography>

            {['lojas', 'hora_de', 'hora_ate'].includes(key) ? (
              <TextField
                fullWidth
                size='small'
                value={key === 'lojas' ? lojas : key === 'hora_de' ? horaDe : horaAte}
                onChange={(e) => {
                  if (key === 'lojas') {
                    setLojas(e.target.value);
                  } else if (key === 'hora_de') {
                    setHoraDe(e.target.value);
                  } else {
                    setHoraAte(e.target.value);
                  }
                }}
                sx={{ marginBottom: 1 }}
              />
            ) : dateFields.includes(key) ? (
              <Typography>{new Date(value).toLocaleDateString('pt-PT')}</Typography>
            ) : (
              <Typography>{value}</Typography>
            )}

            {/* Add a divider between entries, except after the last one */}
            {index < Object.entries(data).length - 1 && <Divider sx={{ my: 2 }} />}
          </div>
        ))}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleSave}
          variant='contained'
          sx={{
            backgroundColor: '#003e2d',
            color: 'white',
            '&:hover': { backgroundColor: '#00221b' },
          }}
        >
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
