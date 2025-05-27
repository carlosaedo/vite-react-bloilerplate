import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useShippingFormContext } from '../context/ShippingFormContext';

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
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const shippingServices = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'overnight', label: 'Overnight' },
];

function generateMockSSCC() {
  let randomDigits = '';
  for (let i = 0; i < 16; i++) {
    randomDigits += Math.floor(Math.random() * 10);
  }
  return '00' + randomDigits;
}

const packageType = [
  { value: 'volume', label: 'Volume' },
  { value: 'palete', label: 'Palete' },
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
  const { shippingFormData, setShippingFormData, resetShippingFormData } = useShippingFormContext();

  const [message, setMessage] = useState(null);
  const [showSSCC, setShowSSCC] = useState(false);

  const [showPackageDetails, setShowPackageDetails] = useState(true);

  const handleChange = (event) => {
    setShippingFormData({
      ...shippingFormData,
      [event.target.name]: event.target.value,
    });
    localStorage.setItem(
      'shippingFormData',
      JSON.stringify({ ...shippingFormData, [event.target.name]: event.target.value }),
    );
  };

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...shippingFormData.packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      [field]: value,
    };

    const updatedFormData = {
      ...shippingFormData,
      packages: updatedPackages,
    };

    setShippingFormData(updatedFormData);
    localStorage.setItem('shippingFormData', JSON.stringify(updatedFormData));
  };

  const addPackage = () => {
    const newPackage = {
      packageWeight: '',
      packageLength: '',
      packageWidth: '',
      packageHeight: '',
      packageDescription: '',
      packageValue: '',
      packageType: '',
      sscc: generateMockSSCC(), // Generate a mock SSCC for the new package
    };

    const updatedFormData = {
      ...shippingFormData,
      packages: [...shippingFormData.packages, newPackage],
    };

    setShippingFormData(updatedFormData);
    localStorage.setItem('shippingFormData', JSON.stringify(updatedFormData));
  };

  const removePackage = (index) => {
    if (shippingFormData.packages.length > 1) {
      const updatedPackages = shippingFormData.packages.filter((_, i) => i !== index);
      const updatedFormData = {
        ...shippingFormData,
        packages: updatedPackages,
      };

      setShippingFormData(updatedFormData);
      localStorage.setItem('shippingFormData', JSON.stringify(updatedFormData));
    }
  };

  const resetForm = () => {
    resetShippingFormData();
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post(`/shipping-form`, { formData: shippingFormData });
      console.log('Form submitted successfully:', response.data);
      if (response?.status === 200) {
        setMessage('Form submitted successfully!');
        resetForm();
        console.log(response);
      }
    } catch (error) {
      console.error('Error :', error);
    }
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
      ...shippingFormData,
      deliveryTime: time,
      date: today,
      year: year,
      waybillNumber: waybillRandom,
      hour: time,
    };

    setShippingFormData(updatedData);
    localStorage.setItem('shippingFormData', JSON.stringify(updatedData));
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
                value={shippingFormData.year}
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
                value={shippingFormData.waybillNumber}
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
                value={shippingFormData.hour || ''} // default to HH:MM
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
                value={shippingFormData.date}
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
                value={shippingFormData.extNumber}
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
                value={shippingFormData.deliveryDate}
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
                value={shippingFormData.extNumber2}
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
            value={shippingFormData.senderName}
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
                value={shippingFormData.senderEmail}
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
                value={shippingFormData.senderPhone}
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
            value={shippingFormData.senderStreet}
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
                value={shippingFormData.senderCity}
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
                value={shippingFormData.senderState}
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
                value={shippingFormData.senderZip}
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
                value={shippingFormData.senderCountry}
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
            value={shippingFormData.recipientName}
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
                value={shippingFormData.recipientEmail}
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
                value={shippingFormData.recipientPhone}
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
            value={shippingFormData.recipientStreet}
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
                value={shippingFormData.recipientCity}
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
                value={shippingFormData.recipientState}
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
                value={shippingFormData.recipientZip}
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
                value={shippingFormData.recipientCountry}
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
            <Grid size={{ xs: 4 }}>
              <TextField
                select
                label='Shipping Payment'
                name='shippingPayment'
                value={shippingFormData.shippingPayment}
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
            <Grid size={{ xs: 4 }}>
              <TextField
                select
                label='Payment'
                name='shippingPaymentTo'
                value={shippingFormData.shippingPaymentTo}
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
            <Grid size={{ xs: 4 }}>
              <TextField
                label='NIF Destinatário'
                name='recipientTaxId'
                type='text'
                value={shippingFormData.recipientTaxId}
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
        <Box sx={{ mb: 4, width: '100%' }}>
          <Typography variant='h6'>Package Details</Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'right',
              mb: 2,
            }}
          >
            <Button
              sx={{ marginRight: 1 }}
              variant='outlined'
              startIcon={showPackageDetails ? <IoMdEyeOff /> : <IoMdEye />}
              onClick={
                showPackageDetails
                  ? () => setShowPackageDetails(false)
                  : () => setShowPackageDetails(true)
              }
              size='small'
            >
              {showPackageDetails ? 'Hide Package Details' : 'Show Package Details'}
            </Button>
            <Button
              sx={{ marginRight: 1 }}
              variant='outlined'
              startIcon={showSSCC ? <IoMdEyeOff /> : <IoMdEye />}
              onClick={showSSCC ? () => setShowSSCC(false) : () => setShowSSCC(true)}
              size='small'
            >
              {showSSCC ? 'Hide SSCC' : 'Show SSCC'}
            </Button>
            <Button variant='outlined' startIcon={<AddIcon />} onClick={addPackage} size='small'>
              Add Package
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {shippingFormData.packages.map((pkg, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant='body2'>
                      <strong>Weight:</strong> {pkg.packageWeight} kg
                    </Typography>
                    <Typography variant='body2'>
                      <strong>Type:</strong>{' '}
                      {pkg.packageType.charAt(0).toUpperCase() + pkg.packageType.slice(1)}
                    </Typography>
                    <Typography variant='body2'>
                      <strong>Length:</strong> {pkg.packageLength} cm
                    </Typography>
                    <Typography variant='body2'>
                      <strong>Width:</strong> {pkg.packageWidth} cm
                    </Typography>
                    <Typography variant='body2'>
                      <strong>Height:</strong> {pkg.packageHeight} cm
                    </Typography>
                    <Typography variant='body2'>
                      <strong>Description:</strong> {pkg.packageDescription}
                    </Typography>
                    <Typography variant='body2'>
                      <strong>Value:</strong> {pkg.packageValue} EUR
                    </Typography>
                    {showSSCC && (
                      <Typography variant='body2'>
                        <strong>SSCC:</strong> {pkg.sscc}
                      </Typography>
                    )}
                  </Box>
                }
                arrow
                placement='top-start'
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant='subtitle1'>
                    Package {index + 1}
                    {!showPackageDetails && (
                      <>
                        {pkg.packageType && (
                          <>
                            {' | '}
                            {pkg.packageType.charAt(0).toUpperCase() + pkg.packageType.slice(1)}
                          </>
                        )}
                        {pkg.packageWeight && <> | {pkg.packageWeight} kg</>}
                        {pkg.packageDescription && (
                          <>
                            {' | '}
                            {pkg.packageDescription.length > 70
                              ? pkg.packageDescription.slice(0, 70) + '...'
                              : pkg.packageDescription}
                          </>
                        )}
                        {pkg.packageValue && <> | {pkg.packageValue} EUR</>}
                      </>
                    )}
                  </Typography>

                  {shippingFormData.packages.length > 1 && (
                    <IconButton onClick={() => removePackage(index)} color='error' size='small'>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </Tooltip>

              {showPackageDetails && (
                <>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        label='Weight (kg)'
                        name={`packageWeight_${index}`}
                        type='number'
                        value={pkg.packageWeight}
                        onChange={(e) =>
                          handlePackageChange(index, 'packageWeight', e.target.value)
                        }
                        fullWidth
                        size='small'
                        margin='dense'
                        required
                        slotProps={{ htmlInput: { min: 0 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        select
                        label='Package Type'
                        name={`packageType_${index}`}
                        value={pkg.packageType}
                        onChange={(e) => handlePackageChange(index, 'packageType', e.target.value)}
                        fullWidth
                        size='small'
                        margin='dense'
                        required
                      >
                        {packageType.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        label='Length (cm)'
                        name={`packageLength_${index}`}
                        type='number'
                        value={pkg.packageLength}
                        onChange={(e) =>
                          handlePackageChange(index, 'packageLength', e.target.value)
                        }
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
                        onChange={(e) =>
                          handlePackageChange(index, 'packageHeight', e.target.value)
                        }
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
                    onChange={(e) =>
                      handlePackageChange(index, 'packageDescription', e.target.value)
                    }
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
                  {showSSCC && (
                    <TextField
                      label='SSCC'
                      name='sscc'
                      type='text'
                      value={pkg.sscc}
                      fullWidth
                      size='small'
                      margin='dense'
                      disabled={true}
                    />
                  )}
                </>
              )}
            </Box>
          ))}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'right',
              mb: 2,
            }}
          >
            <Button
              sx={{ marginRight: 1 }}
              variant='outlined'
              startIcon={showPackageDetails ? <IoMdEyeOff /> : <IoMdEye />}
              onClick={
                showPackageDetails
                  ? () => setShowPackageDetails(false)
                  : () => setShowPackageDetails(true)
              }
              size='small'
            >
              {showPackageDetails ? 'Hide Package Details' : 'Show Package Details'}
            </Button>
            <Button
              sx={{ marginRight: 1 }}
              variant='outlined'
              startIcon={showSSCC ? <IoMdEyeOff /> : <IoMdEye />}
              onClick={showSSCC ? () => setShowSSCC(false) : () => setShowSSCC(true)}
              size='small'
            >
              {showSSCC ? 'Hide SSCC' : 'Show SSCC'}
            </Button>
            <Button variant='outlined' startIcon={<AddIcon />} onClick={addPackage} size='small'>
              Add Package
            </Button>
          </Box>
          <TextField
            select
            label='Shipping Service'
            name={'shippingService'}
            value={shippingFormData.shippingService}
            onChange={handleChange}
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

        {/* Submit */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {message && (
            <Typography variant='h5' gutterBottom>
              {message}
            </Typography>
          )}
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
