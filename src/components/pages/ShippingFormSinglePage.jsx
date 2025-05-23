import React, { useState, useEffect } from 'react';

import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';

import { LiaWpforms } from 'react-icons/lia';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const shippingServices = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'overnight', label: 'Overnight' },
];

const shippingPayment = [
  { value: 'pronto', label: 'Pronto' },
  { value: 'faturar', label: 'Faturar' },
];

const shippingPaymentTo = [
  { value: 'expeditor', label: 'Expeditor' },
  { value: 'destinatario', label: 'Destinatário' },
];

function ShippingForm({ handleChangeFormType }) {
  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem('formData');
    return storedData
      ? JSON.parse(storedData)
      : {
          recipientTaxId: '',
          shippingPayment: 'pronto',
          shippingPaymentTo: 'expeditor',
          year: '',
          waybillNumber: '',
          hour: '',
          date: '',
          extNumber: '',
          deliveryDate: '',
          extNumber2: '',
          senderName: '',
          senderEmail: '',
          senderPhone: '',
          senderStreet: '',
          senderCity: '',
          senderState: '',
          senderZip: '',
          senderCountry: '',
          recipientName: '',
          recipientEmail: '',
          recipientPhone: '',
          recipientStreet: '',
          recipientCity: '',
          recipientState: '',
          recipientZip: '',
          recipientCountry: '',
          packages: [
            {
              packageWeight: '',
              packageLength: '',
              packageWidth: '',
              packageHeight: '',
              packageDescription: '',
              packageValue: '',
              shippingService: 'standard',
            },
          ],
        };
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    localStorage.setItem(
      'formData',
      JSON.stringify({ ...formData, [event.target.name]: event.target.value }),
    );
  };

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      [field]: value,
    };

    const updatedFormData = {
      ...formData,
      packages: updatedPackages,
    };

    setFormData(updatedFormData);
    localStorage.setItem('formData', JSON.stringify(updatedFormData));
  };

  const addPackage = () => {
    const newPackage = {
      packageWeight: '',
      packageLength: '',
      packageWidth: '',
      packageHeight: '',
      packageDescription: '',
      packageValue: '',
      shippingService: 'standard',
    };

    const updatedFormData = {
      ...formData,
      packages: [...formData.packages, newPackage],
    };

    setFormData(updatedFormData);
    localStorage.setItem('formData', JSON.stringify(updatedFormData));
  };

  const removePackage = (index) => {
    if (formData.packages.length > 1) {
      const updatedPackages = formData.packages.filter((_, i) => i !== index);
      const updatedFormData = {
        ...formData,
        packages: updatedPackages,
      };

      setFormData(updatedFormData);
      localStorage.setItem('formData', JSON.stringify(updatedFormData));
    }
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      recipientTaxId: '',
      shippingPayment: 'pronto',
      shippingPaymentTo: 'expeditor',
      extNumber: '',
      deliveryDate: '',
      extNumber2: '',
      senderName: '',
      senderEmail: '',
      senderPhone: '',
      senderStreet: '',
      senderCity: '',
      senderState: '',
      senderZip: '',
      senderCountry: '',
      recipientName: '',
      recipientEmail: '',
      recipientPhone: '',
      recipientStreet: '',
      recipientCity: '',
      recipientState: '',
      recipientZip: '',
      recipientCountry: '',
      packages: [
        {
          packageWeight: '',
          packageLength: '',
          packageWidth: '',
          packageHeight: '',
          packageDescription: '',
          packageValue: '',
          shippingService: 'standard',
        },
      ],
    });
    localStorage.removeItem('formData');
  };

  const handleSubmit = () => {
    alert('Submitted data:\n' + JSON.stringify(formData, null, 2));
  };

  useEffect(() => {
    const now = new Date();
    const time = now.toTimeString().slice(0, 5); // "HH:MM"
    const today = now.toISOString().slice(0, 10); // "yyyy-MM-dd"
    const year = now.getFullYear();
    const waybillRandom = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    const updatedData = {
      ...formData,
      deliveryTime: time,
      date: today,
      year: year,
      waybillNumber: waybillRandom,
      hour: time,
    };

    setFormData(updatedData);
    localStorage.setItem('formData', JSON.stringify(updatedData));
  }, []);

  const handleChangeFormTypeToParent = () => {
    handleChangeFormType(false);
  };

  return (
    <>
      <Paper sx={{ p: 2, maxWidth: 900, margin: 'auto', mt: 5 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
          <Typography variant='h5' gutterBottom>
            Shipping Form
          </Typography>
          <Tooltip title='Multi tab form' placement='top' arrow>
            <Button
              onClick={handleChangeFormTypeToParent}
              variant='contained'
              color='primary'
              sx={{
                marginLeft: 'auto',
                fontSize: '30px',
              }}
            >
              <LiaWpforms />
            </Button>
          </Tooltip>
        </Box>

        {/* Guia*/}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h6'>Waybill Information</Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='Year'
                name='year'
                value={formData.year}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='Waybill Number'
                name='waybillNumber'
                type='text'
                value={formData.waybillNumber}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='Hour'
                name='hour'
                type='time'
                value={formData.hour || ''} // default to HH:MM
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                slotProps={{ inputLabel: { shrink: true } }} // <- fixes the label
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='Date'
                name='date'
                type='date'
                value={formData.date}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                slotProps={{ inputLabel: { shrink: true } }} // <- fixes the label
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='Ext. Number'
                name='extNumber'
                type='text'
                value={formData.extNumber}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='Delivery Date'
                name='deliveryDate'
                type='date'
                value={formData.deliveryDate}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
                slotProps={{ inputLabel: { shrink: true } }} // <- fixes the label overlapping issue
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='Ext. Number 2'
                name='extNumber2'
                type='text'
                value={formData.extNumber2}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
          </Grid>
        </Box>

        {/* Sender Info */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h6'>Sender Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField
            label='Name'
            name='senderName'
            value={formData.senderName}
            onChange={handleChange}
            fullWidth
            size='small'
            margin='dense'
            required
          />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label='Email'
                name='senderEmail'
                type='email'
                value={formData.senderEmail}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label='Phone'
                name='senderPhone'
                type='tel'
                value={formData.senderPhone}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
          </Grid>
          <TextField
            label='Street'
            name='senderStreet'
            value={formData.senderStreet}
            onChange={handleChange}
            fullWidth
            size='small'
            margin='dense'
            required
          />
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='City'
                name='senderCity'
                value={formData.senderCity}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='State'
                name='senderState'
                value={formData.senderState}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='ZIP'
                name='senderZip'
                value={formData.senderZip}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='Country'
                name='senderCountry'
                value={formData.senderCountry}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
          </Grid>
        </Box>

        {/* Recipient Info */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h6'>Recipient Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField
            label='Name'
            name='recipientName'
            value={formData.recipientName}
            onChange={handleChange}
            fullWidth
            size='small'
            margin='dense'
            required
          />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label='Email'
                name='recipientEmail'
                type='email'
                value={formData.recipientEmail}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label='Phone'
                name='recipientPhone'
                type='tel'
                value={formData.recipientPhone}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
          </Grid>
          <TextField
            label='Street'
            name='recipientStreet'
            value={formData.recipientStreet}
            onChange={handleChange}
            fullWidth
            size='small'
            margin='dense'
            required
          />
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='City'
                name='recipientCity'
                value={formData.recipientCity}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='State'
                name='recipientState'
                value={formData.recipientState}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='ZIP'
                name='recipientZip'
                value={formData.recipientZip}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='Country'
                name='recipientCountry'
                value={formData.recipientCountry}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
          </Grid>
        </Box>

        {/* Additional Info */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h6'>Payment Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                select
                label='Shipping Payment'
                name='shippingPayment'
                value={formData.shippingPayment}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              >
                {shippingPayment.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                select
                label='Payment'
                name='shippingPaymentTo'
                value={formData.shippingPaymentTo}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              >
                {shippingPaymentTo.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label='NIF Destinatário'
                name='recipientTaxId'
                type='text'
                value={formData.recipientTaxId}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
              />
            </Grid>
          </Grid>
        </Box>

        {/* Package Info - Multiple Packages */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Typography variant='h6'>Package Details</Typography>
            <Button variant='outlined' startIcon={<AddIcon />} onClick={addPackage} size='small'>
              Add Package
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {formData.packages.map((pkg, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography variant='subtitle1'>Package {index + 1}</Typography>
                {formData.packages.length > 1 && (
                  <IconButton onClick={() => removePackage(index)} color='error' size='small'>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>

              <TextField
                label='Weight (kg)'
                name={`packageWeight_${index}`}
                type='number'
                value={pkg.packageWeight}
                onChange={(e) => handlePackageChange(index, 'packageWeight', e.target.value)}
                fullWidth
                size='small'
                margin='dense'
                required
                slotProps={{ htmlInput: { min: 0 } }}
              />
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    label='Length (cm)'
                    name={`packageLength_${index}`}
                    type='number'
                    value={pkg.packageLength}
                    onChange={(e) => handlePackageChange(index, 'packageLength', e.target.value)}
                    fullWidth
                    size='small'
                    margin='dense'
                    required
                    slotProps={{ htmlInput: { min: 0 } }}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    label='Width (cm)'
                    name={`packageWidth_${index}`}
                    type='number'
                    value={pkg.packageWidth}
                    onChange={(e) => handlePackageChange(index, 'packageWidth', e.target.value)}
                    fullWidth
                    size='small'
                    margin='dense'
                    required
                    slotProps={{ htmlInput: { min: 0 } }}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    label='Height (cm)'
                    name={`packageHeight_${index}`}
                    type='number'
                    value={pkg.packageHeight}
                    onChange={(e) => handlePackageChange(index, 'packageHeight', e.target.value)}
                    fullWidth
                    size='small'
                    margin='dense'
                    required
                    slotProps={{ htmlInput: { min: 0 } }}
                  />
                </Grid>
              </Grid>
              <TextField
                label='Description'
                name={`packageDescription_${index}`}
                value={pkg.packageDescription}
                onChange={(e) => handlePackageChange(index, 'packageDescription', e.target.value)}
                fullWidth
                size='small'
                margin='dense'
                required
                multiline
                rows={2}
              />
              <TextField
                label='Package Value (EUR)'
                name={`packageValue_${index}`}
                type='number'
                value={pkg.packageValue}
                onChange={(e) => handlePackageChange(index, 'packageValue', e.target.value)}
                fullWidth
                size='small'
                margin='dense'
                required
                slotProps={{ htmlInput: { min: 0 } }}
              />
              <TextField
                select
                label='Shipping Service'
                name={`shippingService_${index}`}
                value={pkg.shippingService}
                onChange={(e) => handlePackageChange(index, 'shippingService', e.target.value)}
                fullWidth
                size='small'
                margin='dense'
                required
              >
                {shippingServices.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ))}
        </Box>

        {/* Submit */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={resetForm} variant='outlined' color='primary'>
            Reset Form
          </Button>
          <Button variant='contained' color='primary' onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Paper>
    </>
  );
}

export default ShippingForm;
