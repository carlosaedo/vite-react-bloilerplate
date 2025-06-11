import React, { useState, useEffect, useRef } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../api/api';

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
  selectedEntityName,
  handleEntityChange,
  onEntityCreated,
  isSender = false,
  isRecipient = false,
}) => {
  const [options, setOptions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEntityData, setNewEntityData] = useState(defaultNewEntity);
  const [newEntityType, setNewEntityType] = useState({ shipping: false, delivery: false });
  const [inputValue, setInputValue] = useState('');

  const [selectedValue, setSelectedValue] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const totalCount = useRef(0);

  const fetchEntities = async (search = '', page = 1) => {
    setFetching(true);
    try {
      const res = await api.post(`/shipping-form/get-entities`, {
        isSender,
        isRecipient,
        search,
        page,
        pageSize,
        orderBy: 'Name',
        orderDirection: 'asc',
      });

      const { data, total } = res.data.entities;
      totalCount.current = total;

      setOptions((prev) => (page === 1 ? data : [...prev, ...data]));
      setHasMore(page * pageSize < total);
    } catch (err) {
      console.error('Failed to fetch entities:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (selectedEntityName) {
      setSelectedValue({ Name: selectedEntityName });
    } else {
      setSelectedValue(null);
    }
  }, [selectedEntityName]);

  useEffect(() => {
    fetchEntities('', 1);
  }, []);

  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;
    const bottom =
      listboxNode.scrollHeight - listboxNode.scrollTop <= listboxNode.clientHeight + 50;

    if (bottom && hasMore && !fetching) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchEntities(inputValue, nextPage);
    }
  };

  const handleInputChange = (event, newInput = '') => {
    setInputValue(newInput);
    setPage(1);
    fetchEntities(newInput, 1);
  };

  const handleChange = (event, newValue) => {
    if (newValue?.isNew) {
      setNewEntityData({ ...defaultNewEntity, Name: inputValue });
      setOpenDialog(true);
    } else if (newValue) {
      setSelectedValue(newValue);
      handleEntityChange(newValue);
    } else {
      setSelectedValue(null);
      handleEntityChange(null);
    }
  };

  const handleCreateEntity = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/shipping-form/create-entity`, {
        ...newEntityData,
        ...newEntityType,
      });

      if (response.status === 201) {
        onEntityCreated(newEntityData); // Parent will refetch
        setOpenDialog(false);
        setNewEntityData(defaultNewEntity);
        setInputValue('');
        fetchEntities('', 1);
      }
    } catch (err) {
      console.error('Failed to create entity', err);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = (options) => {
    const filtered = [...options];
    filtered.unshift({
      Name: inputValue ? `Create new entity "${inputValue}"` : 'Create new entity',
      isNew: true,
    });
    return filtered;
  };

  return (
    <>
      <Autocomplete
        fullWidth
        size='small'
        options={options}
        getOptionLabel={(option) => option?.Name || ''}
        filterOptions={filterOptions}
        value={selectedValue}
        inputValue={inputValue || ''}
        loading={fetching}
        onInputChange={handleInputChange}
        onChange={handleChange}
        slotProps={{ listbox: { onScroll: handleScroll } }}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Select Entity'
            margin='dense'
            required
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {fetching ? <CircularProgress color='inherit' size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Create New Entity</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {Object.keys(defaultNewEntity).map((key) => (
              <Grid size={{ xs: 12, sm: 12, md: 12, ld: 12 }} key={key}>
                <TextField
                  key={key}
                  label={key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  fullWidth
                  value={newEntityData[key] ?? ''}
                  onChange={(e) => setNewEntityData({ ...newEntityData, [key]: e.target.value })}
                  margin='dense'
                />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={2} mt={1}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!newEntityType.shipping}
                    onChange={(e) =>
                      setNewEntityType({ ...newEntityType, shipping: e.target.checked })
                    }
                  />
                }
                label='Shipping'
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!newEntityType.delivery}
                    onChange={(e) =>
                      setNewEntityType({ ...newEntityType, delivery: e.target.checked })
                    }
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
          <Button onClick={handleCreateEntity} disabled={loading} variant='contained'>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EntitySelector;
