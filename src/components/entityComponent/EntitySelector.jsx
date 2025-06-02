import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import api from '../api/api';
import { Add } from '@mui/icons-material';

const defaultNewEntity = {
  Name: '',
  Add1: '',
  Add2: '',
  Add3: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
  external_ref: '',
  VAT: '',
};

const EntitySelector = ({
  entitiesData,
  selectedEntityName,
  handleEntityChange,
  onEntityCreated, // <-- new prop to notify parent to refetch
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [newEntityData, setNewEntityData] = useState(defaultNewEntity);

  const [newEntityType, setNewEntityType] = useState({ shipping: false, delivery: false });
  const [loading, setLoading] = useState(false);

  const handleCreateEntity = async () => {
    setLoading(true);

    try {
      // Mock API call
      console.log({
        ...newEntityData,
        ...newEntityType,
      });
      const response = await api.post(`/shipping-form/create-entity`, {
        ...newEntityData,
        ...newEntityType,
      });

      if (response.status === 201) {
        onEntityCreated(newEntityData); // pass name to parent
        setOpenDialog(false);
        setNewEntityData(defaultNewEntity);
        setInputValue('');
      }
    } catch (error) {
      console.error('Failed to create entity', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = (options, state) => {
    const filtered = options.filter((option) =>
      option.Name.toLowerCase().includes(state.inputValue.toLowerCase()),
    );

    /*if (
      state.inputValue !== '' &&
      !options.some((option) => option.Name.toLowerCase() === state.inputValue.toLowerCase())
    ) {
      filtered.push({
        Name: `Create new entity "${state.inputValue}"`,
        isNew: true,
      });
    }*/

    // Always add the "Create new entity" option at the top, even if input is empty
    filtered.unshift({
      Name: state.inputValue ? `Create new entity "${state.inputValue}"` : 'Create new entity',
      isNew: true,
    });

    return filtered;
  };

  return (
    <>
      <Autocomplete
        fullWidth
        size='small'
        options={entitiesData}
        getOptionLabel={(option) => option.Name}
        filterOptions={filterOptions}
        value={entitiesData.find((e) => e.Name === selectedEntityName) || null}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          if (newValue?.isNew) {
            setNewEntityData({ ...defaultNewEntity, Name: inputValue });
            setOpenDialog(true);
          } else if (newValue) {
            const index = entitiesData.findIndex((entity) => entity.Name === newValue.Name);
            handleEntityChange(index !== -1 ? index : null);
          } else {
            handleEntityChange(null);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label='Select Entity' margin='dense' required />
        )}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Create New Entity</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {Object.entries(defaultNewEntity).map(([key]) => (
              <Grid size={{ sm: 6, xs: 12, md: 4, lg: 4 }} key={key}>
                <TextField
                  label={key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  fullWidth
                  value={newEntityData[key]}
                  onChange={(e) => setNewEntityData({ ...newEntityData, [key]: e.target.value })}
                  margin='dense'
                />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
              <FormControlLabel
                sx={{ mt: 1 }}
                control={
                  <Checkbox
                    checked={newEntityType.shipping || false}
                    onChange={(e) =>
                      setNewEntityType({ ...newEntityType, shipping: e.target.checked })
                    }
                    name='shipping'
                    color='primary'
                  />
                }
                label='Shipping'
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 1 }}>
              <FormControlLabel
                sx={{ mt: 1 }}
                control={
                  <Checkbox
                    checked={newEntityType.delivery || false}
                    onChange={(e) =>
                      setNewEntityType({ ...newEntityType, delivery: e.target.checked })
                    }
                    name='delivery'
                    color='primary'
                  />
                }
                label='Delivery'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleCreateEntity} variant='contained' disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EntitySelector;
