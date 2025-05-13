import React, { useState, useEffect } from 'react';
import api from '../api/torrestirApi';
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
    <Dialog open={isOpenDeleteRow} onClose={closeModalDeleteRow} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6' sx={{ color: '#003e2d' }}>
          Confirm Operation
        </Typography>{' '}
        {/* Applying primary green color */}
        <IconButton onClick={closeModalDeleteRow}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {Object.entries(data).map(([key, value], index) => (
          <div key={key}>
            <Typography variant='subtitle2' gutterBottom sx={{ color: '#003e2d' }}>
              {key.toUpperCase()}
            </Typography>

            {dateFields.includes(key) ? (
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
        <Button onClick={handleDelete} variant='contained' color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDeleteRow;
