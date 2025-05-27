import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useShippingFormContext } from '../context/ShippingFormContext';

import {
  Box,
  Grid,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Tooltip,
  IconButton,
} from '@mui/material';
import { RiPagesLine } from 'react-icons/ri';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

import ShippingFormReviewDetails from './ShippingFormReviewDetails';

function generateMockSSCC() {
  let randomDigits = '';
  for (let i = 0; i < 16; i++) {
    randomDigits += Math.floor(Math.random() * 10);
  }
  return '00' + randomDigits;
}

const shippingServices = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'overnight', label: 'Overnight' },
];

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

  const [step, setStep] = useState(0);

  const [showSSCC, setShowSSCC] = useState(false);

  const [showPackageDetails, setShowPackageDetails] = useState(true);

  const [message, setMessage] = useState(null);

  console.log(shippingFormData);

  const handleStepChange = (event, newValue) => {
    setStep(newValue);
  };

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
      sscc: generateMockSSCC(), // Generate a new SSCC for the new package
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
    handleChangeFormType(true);
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        return (
          shippingFormData.senderName &&
          shippingFormData.senderEmail &&
          shippingFormData.senderPhone &&
          shippingFormData.senderStreet &&
          shippingFormData.senderCity &&
          shippingFormData.senderState &&
          shippingFormData.senderZip &&
          shippingFormData.senderCountry
        );
      case 1:
        return (
          shippingFormData.recipientName &&
          shippingFormData.recipientEmail &&
          shippingFormData.recipientPhone &&
          shippingFormData.recipientStreet &&
          shippingFormData.recipientCity &&
          shippingFormData.recipientState &&
          shippingFormData.recipientZip &&
          shippingFormData.recipientCountry
        );
      case 2:
        if (!shippingFormData.shippingService) return false; // Ensure shipping service is selected
        for (const pkg of shippingFormData.packages) {
          if (
            !pkg.packageWeight ||
            !pkg.packageLength ||
            !pkg.packageWidth ||
            !pkg.packageHeight ||
            !pkg.packageDescription ||
            !pkg.packageValue
          ) {
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () =>
    validateStep()
      ? setStep((prev) => Math.min(prev + 1, 3))
      : alert('Please fill all required fields on this step.');
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));
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

  return (
    <Paper sx={{ p: 3, maxWidth: 900, margin: 'auto', mt: 5 }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h5' gutterBottom>
          Shipping Form
        </Typography>
        <Tooltip title='Single page form' placement='top' arrow>
          <Button
            onClick={handleChangeFormTypeToParent}
            variant='contained'
            color='primary'
            sx={{
              marginLeft: 'auto',
              fontSize: '25px',
              fontWeight: '900',
            }}
          >
            <RiPagesLine />
          </Button>
        </Tooltip>
      </Box>
      {/* Guia*/}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h6'>Waybill Information</Typography>

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
      <Tabs value={step} onChange={handleStepChange} variant='fullWidth'>
        {['Sender Info', 'Recipient Info', 'Package Details', 'Review & Submit'].map(
          (label, index) => (
            <Tab
              key={index}
              label={label}
              sx={{
                color: '#003D2C',
                '&.Mui-selected': { color: '#003D2C' },
                '&.Mui-selected:hover': { color: 'white' },
                '&:hover': { color: step ? 'white' : 'white' },
              }}
            />
          ),
        )}
      </Tabs>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {step === 0 && (
          <>
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Sender Name'
                name='senderName'
                value={shippingFormData.senderName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label='Sender Email'
                name='senderEmail'
                type='email'
                value={shippingFormData.senderEmail}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label='Sender Phone'
                name='senderPhone'
                type='tel'
                value={shippingFormData.senderPhone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Street Address'
                name='senderStreet'
                value={shippingFormData.senderStreet}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='City'
                name='senderCity'
                value={shippingFormData.senderCity}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='State/Province'
                name='senderState'
                value={shippingFormData.senderState}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='ZIP/Postal Code'
                name='senderZip'
                value={shippingFormData.senderZip}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='Country'
                name='senderCountry'
                value={shippingFormData.senderCountry}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </>
        )}

        {step === 1 && (
          <>
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Recipient Name'
                name='recipientName'
                value={shippingFormData.recipientName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label='Recipient Email'
                name='recipientEmail'
                type='email'
                value={shippingFormData.recipientEmail}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label='Recipient Phone'
                name='recipientPhone'
                type='tel'
                value={shippingFormData.recipientPhone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Street Address'
                name='recipientStreet'
                value={shippingFormData.recipientStreet}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='City'
                name='recipientCity'
                value={shippingFormData.recipientCity}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='State/Province'
                name='recipientState'
                value={shippingFormData.recipientState}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='ZIP/Postal Code'
                name='recipientZip'
                value={shippingFormData.recipientZip}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='Country'
                name='recipientCountry'
                value={shippingFormData.recipientCountry}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </>
        )}

        {step === 2 && (
          <>
            {/* Package Info - Multiple Packages */}
            <Box sx={{ mb: 4, width: '100%' }}>
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

                <Button
                  variant='outlined'
                  startIcon={<AddIcon />}
                  onClick={addPackage}
                  size='small'
                >
                  Add Package
                </Button>
              </Box>

              {shippingFormData.packages.map((pkg, index) => (
                <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
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
                          {pkg.packageWeight && (
                            <>
                              {' | '}
                              {pkg.packageWeight} kg
                            </>
                          )}
                          {pkg.packageDescription && (
                            <>
                              {' | '}
                              {pkg.packageDescription.length > 70
                                ? pkg.packageDescription.slice(0, 70) + '...'
                                : pkg.packageDescription}
                            </>
                          )}
                          {pkg.packageValue && (
                            <>
                              {' | '}
                              {pkg.packageValue} EUR
                            </>
                          )}
                        </>
                      )}
                    </Typography>

                    {shippingFormData.packages.length > 1 && (
                      <IconButton onClick={() => removePackage(index)} color='error' size='small'>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>

                  {showPackageDetails && (
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <TextField
                          label='Package Weight (kg)'
                          name={`packageWeight_${index}`}
                          type='number'
                          value={pkg.packageWeight}
                          onChange={(e) =>
                            handlePackageChange(index, 'packageWeight', e.target.value)
                          }
                          fullWidth
                          required
                          slotProps={{ htmlInput: { min: 0 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <TextField
                          select
                          label='Package Type'
                          name={'packageType'}
                          value={pkg.packageType}
                          onChange={(e) =>
                            handlePackageChange(index, 'packageType', e.target.value)
                          }
                          fullWidth
                          required
                        >
                          {packageType.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label='Length (cm)'
                          name={`packageLength_${index}`}
                          type='number'
                          value={pkg.packageLength}
                          onChange={(e) =>
                            handlePackageChange(index, 'packageLength', e.target.value)
                          }
                          fullWidth
                          required
                          slotProps={{ htmlInput: { min: 0 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label='Width (cm)'
                          name={`packageWidth_${index}`}
                          type='number'
                          value={pkg.packageWidth}
                          onChange={(e) =>
                            handlePackageChange(index, 'packageWidth', e.target.value)
                          }
                          fullWidth
                          required
                          slotProps={{ htmlInput: { min: 0 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label='Height (cm)'
                          name={`packageHeight_${index}`}
                          type='number'
                          value={pkg.packageHeight}
                          onChange={(e) =>
                            handlePackageChange(index, 'packageHeight', e.target.value)
                          }
                          fullWidth
                          required
                          slotProps={{ htmlInput: { min: 0 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          label='Package Description'
                          name={`packageDescription_${index}`}
                          value={pkg.packageDescription}
                          onChange={(e) =>
                            handlePackageChange(index, 'packageDescription', e.target.value)
                          }
                          fullWidth
                          required
                          multiline
                          rows={3}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          label='Package Value (EUR)'
                          name={`packageValue_${index}`}
                          type='number'
                          value={pkg.packageValue}
                          onChange={(e) =>
                            handlePackageChange(index, 'packageValue', e.target.value)
                          }
                          fullWidth
                          required
                          slotProps={{ htmlInput: { min: 0 } }}
                        />
                      </Grid>

                      {showSSCC && (
                        <Grid size={{ xs: 12 }}>
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
                        </Grid>
                      )}
                    </Grid>
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

                <Button
                  variant='outlined'
                  startIcon={<AddIcon />}
                  onClick={addPackage}
                  size='small'
                >
                  Add Package
                </Button>
              </Box>
              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  label='Shipping Service'
                  name={'shippingService'}
                  value={shippingFormData.shippingService}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  {shippingServices.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Box>
          </>
        )}

        {step === 3 && <ShippingFormReviewDetails formData={shippingFormData} />}
      </Grid>

      {/* Additional Info */}
      <Box sx={{ mb: 4, marginTop: 3 }}>
        <Typography variant='h6'>Payment Information</Typography>

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

      <Grid container spacing={2} justifyContent='space-between' sx={{ mt: 3 }}>
        <Grid>
          <Button disabled={step === 0} onClick={handleBack} variant='outlined' color='primary'>
            Back
          </Button>
        </Grid>
        {message && (
          <Typography variant='h5' gutterBottom>
            {message}
          </Typography>
        )}
        <Grid>
          {step < 3 ? (
            <Button onClick={handleNext} variant='contained' color='primary'>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} variant='contained' color='success'>
              Submit
            </Button>
          )}
        </Grid>
      </Grid>
      <Button onClick={resetForm} variant='outlined' color='primary'>
        Reset Form
      </Button>
    </Paper>
  );
}

export default ShippingForm;
