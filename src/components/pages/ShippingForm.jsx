import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import { useShippingFormContext } from '../context/ShippingFormContext';
import calculateShippingFormSizeValues from '../../utils/calculateShippingFormSizeShippingForm';

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
  Select,
  FormControlLabel,
  Checkbox,
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
  const packageRefs = useRef([]);
  const [selectedIndex, setSelectedIndex] = useState('');

  /*const handleJumpToPackage = (index) => {
      packageRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };*/

  const handleJumpToPackage = (index) => {
    setMessage(null);
    setErrorMessage(null);
    const el = packageRefs.current[index];
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    // Reset dropdown after scroll
    setSelectedIndex('');
  };

  const { shippingFormData, setShippingFormData, resetShippingFormData } = useShippingFormContext();

  const [step, setStep] = useState(0);

  const [showSSCC, setShowSSCC] = useState(false);

  const [showPackageDetails, setShowPackageDetails] = useState(true);

  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleStepChange = (event, newValue) => {
    setMessage(null);
    setErrorMessage(null);
    setStep(newValue);
  };

  const handleChange = (event) => {
    setMessage(null);
    setErrorMessage(null);
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
    setMessage(null);
    setErrorMessage(null);

    const newCalculationsForPackage = calculateShippingFormSizeValues(
      shippingFormData?.packages[index]?.packageWeight,
      shippingFormData?.packages[index]?.packageLength,
      shippingFormData?.packages[index]?.packageWidth,
      shippingFormData?.packages[index]?.packageHeight,
      5000,
    );

    const updatedPackages = [...shippingFormData.packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      [field]: value,
      ...newCalculationsForPackage,
    };

    const updatedFormData = {
      ...shippingFormData,
      packages: updatedPackages,
    };

    setShippingFormData(updatedFormData);
    localStorage.setItem('shippingFormData', JSON.stringify(updatedFormData));
  };

  const addPackage = () => {
    setMessage(null);
    setErrorMessage(null);
    const newPackage = {
      packageWeight: '',
      packageLength: '',
      packageWidth: '',
      packageHeight: '',
      packageNote: '',
      valueOfGoods: '',
      packageType: '',
      sscc: generateMockSSCC(), // Generate a new SSCC for the new package
      CBM: '',
      LDM: '',
      TaxableWeight: '',
      stackable: false,
      dangerousGoods: false,
      customs: false,
      marksAndNumbers: '',
    };

    const updatedFormData = {
      ...shippingFormData,
      packages: [...shippingFormData.packages, newPackage],
    };

    setShippingFormData(updatedFormData);
    localStorage.setItem('shippingFormData', JSON.stringify(updatedFormData));
  };

  const removePackage = (index) => {
    setMessage(null);
    setErrorMessage(null);
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
    setMessage(null);
    setErrorMessage(null);
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
            !pkg?.packageWeight ||
            !pkg?.packageLength ||
            !pkg?.packageWidth ||
            !pkg?.packageHeight ||
            !pkg?.packageNote ||
            !pkg?.valueOfGoods
          ) {
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  const validateFromBeforeSubmit = () => {
    if (
      !shippingFormData.senderName &&
      !shippingFormData.senderEmail &&
      !shippingFormData.senderPhone &&
      !shippingFormData.senderStreet &&
      !shippingFormData.senderCity &&
      !shippingFormData.senderState &&
      !shippingFormData.senderZip &&
      !shippingFormData.senderCountry &&
      !shippingFormData.recipientName &&
      !shippingFormData.recipientEmail &&
      !shippingFormData.recipientPhone &&
      !shippingFormData.recipientStreet &&
      !shippingFormData.recipientCity &&
      !shippingFormData.recipientState &&
      !shippingFormData.recipientZip &&
      !shippingFormData.recipientCountry
    )
      return false;

    if (!shippingFormData.shippingService) return false; // Ensure shipping service is selected
    for (const pkg of shippingFormData.packages) {
      if (
        !pkg?.packageWeight ||
        !pkg?.packageLength ||
        !pkg?.packageWidth ||
        !pkg?.packageHeight ||
        !pkg?.packageNote ||
        !pkg?.valueOfGoods
      ) {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    setMessage(null);
    setErrorMessage(null);
    validateStep()
      ? setStep((prev) => Math.min(prev + 1, 3))
      : setErrorMessage('Please fill all the required fields on this step.');
  };

  const handleBack = () => {
    setMessage(null);
    setErrorMessage(null);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateFromBeforeSubmit()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    try {
      const response = await api.post(`/shipping-form`, { formData: shippingFormData });
      if (response?.status === 200) {
        console.log('Form submitted successfully:', response.data);
        setMessage('Form submitted successfully!');
        resetForm();
        console.log(response);
      }
    } catch (error) {
      setErrorMessage('Error submitting form');
      console.error('Error :', error);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 900, margin: 'auto', mt: 5 }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography
          variant='h5'
          gutterBottom
          sx={{ fontWeight: 700, color: '#003e2d', display: 'flex', alignItems: 'center' }}
        >
          Shipping Form
          {shippingFormData.trackingRef ? (
            <Box
              component='span'
              sx={{
                ml: 2,
                px: 1.5,
                py: 0.3,
                bgcolor: '#ffc928',
                color: '#003e2d',
                borderRadius: 1,
                fontWeight: 600,
                fontSize: '0.875rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                userSelect: 'none',
              }}
            >
              Tracking: {shippingFormData.trackingRef}
            </Box>
          ) : (
            <Typography
              component='span'
              variant='subtitle1'
              sx={{
                ml: 2,
                fontStyle: 'italic',
                color: 'text.secondary',
                fontWeight: 400,
              }}
            >
              New Waybill
            </Typography>
          )}
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
        <Typography variant='h6'>Booking Information</Typography>

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
        </Grid>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label='Shipper Reference'
              name='shipperRef'
              type='text'
              value={shippingFormData.shipperRef}
              onChange={handleChange}
              fullWidth
              size='small'
              margin='dense'
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label='Consignee Reference'
              name='consigneeRef'
              type='text'
              value={shippingFormData.consigneeRef}
              onChange={handleChange}
              fullWidth
              size='small'
              margin='dense'
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label='Waybill Reference'
              name='trackingRef'
              type='text'
              value={shippingFormData.trackingRef}
              onChange={handleChange}
              fullWidth
              size='small'
              margin='dense'
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
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
          <Grid size={{ xs: 12, sm: 4 }}>
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
                <Typography sx={{ ml: 2 }}>
                  {shippingFormData.packages.length}{' '}
                  {shippingFormData.packages.length > 1 ? 'Packages' : 'Package'}
                </Typography>
                <Select
                  size='small'
                  displayEmpty
                  value={selectedIndex}
                  onChange={(e) => handleJumpToPackage(e.target.value)}
                  sx={{ ml: 2 }}
                >
                  <MenuItem value='' disabled>
                    Jump to package
                  </MenuItem>
                  {shippingFormData.packages.map((pkg, index) => (
                    <MenuItem key={index} value={index}>
                      <Tooltip
                        title={
                          <Box sx={{ p: 1 }}>
                            <Typography variant='body2'>
                              <strong>Weight:</strong> {pkg?.packageWeight} kg
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Type:</strong>{' '}
                              {pkg?.packageType?.charAt(0).toUpperCase() +
                                pkg?.packageType.slice(1)}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Length:</strong> {pkg?.packageLength} cm
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Width:</strong> {pkg?.packageWidth} cm
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Height:</strong> {pkg?.packageHeight} cm
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Note:</strong> {pkg?.packageNote}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Value:</strong> {pkg?.valueOfGoods} EUR
                            </Typography>
                            <Typography variant='body2'>
                              <strong>CBM:</strong> {pkg?.CBM}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>LDM:</strong> {pkg?.LDM}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Taxable Weight:</strong> {pkg?.TaxableWeight}
                            </Typography>
                            {showSSCC && (
                              <Typography variant='body2'>
                                <strong>SSCC:</strong> {pkg?.sscc}
                              </Typography>
                            )}
                          </Box>
                        }
                        arrow
                        placement='top-start'
                      >
                        <span>Package {index + 1}</span>
                      </Tooltip>
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {shippingFormData.packages.map((pkg, index) => (
                <Box
                  key={index}
                  ref={(el) => (packageRefs.current[index] = el)}
                  sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}
                >
                  <Tooltip
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography variant='body2'>
                          <strong>Weight:</strong> {pkg?.packageWeight} kg
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Type:</strong>{' '}
                          {pkg?.packageType?.charAt(0).toUpperCase() + pkg?.packageType.slice(1)}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Length:</strong> {pkg?.packageLength} cm
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Width:</strong> {pkg?.packageWidth} cm
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Height:</strong> {pkg?.packageHeight} cm
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Note:</strong> {pkg?.packageNote}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Value:</strong> {pkg?.valueOfGoods} EUR
                        </Typography>
                        <Typography variant='body2'>
                          <strong>CBM:</strong> {pkg?.CBM}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>LDM:</strong> {pkg?.LDM}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Taxable Weight:</strong> {pkg?.TaxableWeight}
                        </Typography>
                        {showSSCC && (
                          <Typography variant='body2'>
                            <strong>SSCC:</strong> {pkg?.sscc}
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
                      <Typography
                        variant='subtitle1'
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Box
                          component='span'
                          sx={{
                            display: 'inline-block',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '18px',
                            px: 1.5,
                            py: 0.5,
                            fontSize: '0.75rem',
                            mr: 1.5, // margin-right between badge and text
                            minWidth: 24,
                            textAlign: 'center',
                            mb: 1.5, // margin-bottom to align with text
                            cursor: 'pointer',
                          }}
                          onClick={
                            showPackageDetails
                              ? () => setShowPackageDetails(false)
                              : () => setShowPackageDetails(true)
                          }
                        >
                          # {index + 1}
                        </Box>
                        {!showPackageDetails && (
                          <>
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                                px: 1,
                                py: 1,
                                '& .smallText': {
                                  fontSize: '0.85rem', // Smaller font size
                                },
                              }}
                            >
                              <Typography variant='body2' className='smallText'>
                                <strong>Weight:</strong> {pkg?.packageWeight || '-'} kg
                              </Typography>
                              <Typography variant='body2' className='smallText'>
                                <strong>Type:</strong>{' '}
                                {pkg?.packageType
                                  ? pkg.packageType.charAt(0).toUpperCase() +
                                    pkg.packageType.slice(1)
                                  : '-'}
                              </Typography>
                              <Typography variant='body2' className='smallText'>
                                <strong>CBM:</strong> {pkg?.CBM || '-'}
                              </Typography>
                              <Typography variant='body2' className='smallText'>
                                <strong>LDM:</strong> {pkg?.LDM || '-'}
                              </Typography>
                              <Typography variant='body2' className='smallText'>
                                <strong>Taxable:</strong> {pkg?.TaxableWeight || '-'}
                              </Typography>
                              <Typography variant='body2' className='smallText'>
                                <strong>Note:</strong>{' '}
                                {pkg?.packageNote?.length > 70
                                  ? pkg.packageNote.slice(0, 70) + '...'
                                  : pkg?.packageNote || '-'}
                              </Typography>
                              <Typography variant='body2' className='smallText'>
                                <strong>Value:</strong> {pkg?.valueOfGoods || '-'} €
                              </Typography>
                            </Box>
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
                    <Grid container spacing={2}>
                      {/* Top-right CBM section */}
                      <Grid
                        size={{ xs: 12 }}
                        sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}
                      >
                        <Grid>
                          <Typography variant='body2' component='h6'>
                            <strong>CBM:</strong> {pkg?.CBM || '-'}
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography variant='body2' component='h6'>
                            <strong>LDM:</strong> {pkg?.LDM || '-'}
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography variant='body2' component='h6'>
                            <strong>Taxable Weight:</strong> {pkg?.TaxableWeight || '-'}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid size={{ xs: 6 }}>
                        <TextField
                          label='Package Weight (kg)'
                          name={`packageWeight_${index}`}
                          type='number'
                          value={pkg?.packageWeight}
                          onChange={(e) =>
                            handlePackageChange(index, 'packageWeight', e.target.value)
                          }
                          fullWidth
                          size='small'
                          required
                          slotProps={{ htmlInput: { min: 0 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <TextField
                          select
                          label='Package Type'
                          name={'packageType'}
                          value={pkg?.packageType}
                          onChange={(e) =>
                            handlePackageChange(index, 'packageType', e.target.value)
                          }
                          fullWidth
                          size='small'
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
                          value={pkg?.packageLength}
                          onChange={(e) =>
                            handlePackageChange(index, 'packageLength', e.target.value)
                          }
                          fullWidth
                          required
                          size='small'
                          slotProps={{ htmlInput: { min: 0 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label='Width (cm)'
                          name={`packageWidth_${index}`}
                          type='number'
                          value={pkg?.packageWidth}
                          onChange={(e) =>
                            handlePackageChange(index, 'packageWidth', e.target.value)
                          }
                          fullWidth
                          required
                          size='small'
                          slotProps={{ htmlInput: { min: 0 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label='Height (cm)'
                          name={`packageHeight_${index}`}
                          type='number'
                          value={pkg?.packageHeight}
                          onChange={(e) =>
                            handlePackageChange(index, 'packageHeight', e.target.value)
                          }
                          fullWidth
                          required
                          size='small'
                          slotProps={{ htmlInput: { min: 0 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          label='Note'
                          name={`packageNote_${index}`}
                          value={pkg?.packageNote}
                          onChange={(e) =>
                            handlePackageChange(index, 'packageNote', e.target.value)
                          }
                          fullWidth
                          required
                          multiline
                          size='small'
                          rows={3}
                        />
                      </Grid>
                      <TextField
                        label='Marks and Numbers'
                        name={`marksAndNumbers_${index}`}
                        type='text'
                        value={shippingFormData.packages[index]?.marksAndNumbers}
                        onChange={(e) =>
                          handlePackageChange(index, 'marksAndNumbers', e.target.value)
                        }
                        fullWidth
                        size='small'
                        required
                      />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1, mb: 1 }}>
                        <TextField
                          label='Package Value (EUR)'
                          name={`packageValue_${index}`}
                          type='number'
                          value={pkg?.valueOfGoods}
                          onChange={(e) =>
                            handlePackageChange(index, 'valueOfGoods', e.target.value)
                          }
                          size='small'
                          required
                          sx={{ minWidth: 180 }}
                          slotProps={{ htmlInput: { min: 0 } }}
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={pkg?.stackable || false}
                              onChange={(e) =>
                                handlePackageChange(index, 'stackable', e.target.checked)
                              }
                              name={`stackable_${index}`}
                              color='primary'
                            />
                          }
                          label='Stackable'
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={pkg?.dangerousGoods || false}
                              onChange={(e) =>
                                handlePackageChange(index, 'dangerousGoods', e.target.checked)
                              }
                              name={`dangerousGoods_${index}`}
                              color='primary'
                            />
                          }
                          label='Dangerous Goods'
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={pkg?.customs || false}
                              onChange={(e) =>
                                handlePackageChange(index, 'customs', e.target.checked)
                              }
                              name={`customs_${index}`}
                              color='primary'
                            />
                          }
                          label='Customs'
                        />
                      </Box>

                      {showSSCC && (
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            label='SSCC'
                            name='sscc'
                            type='text'
                            value={pkg?.sscc}
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
                <Typography sx={{ ml: 2 }}>
                  {shippingFormData.packages.length}{' '}
                  {shippingFormData.packages.length > 1 ? 'Packages' : 'Package'}
                </Typography>
                <Select
                  size='small'
                  displayEmpty
                  value={selectedIndex}
                  onChange={(e) => handleJumpToPackage(e.target.value)}
                  sx={{ ml: 2 }}
                >
                  <MenuItem value='' disabled>
                    Jump to package
                  </MenuItem>
                  {shippingFormData.packages.map((pkg, index) => (
                    <MenuItem key={index} value={index}>
                      <Tooltip
                        title={
                          <Box sx={{ p: 1 }}>
                            <Typography variant='body2'>
                              <strong>Weight:</strong> {pkg?.packageWeight} kg
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Type:</strong>{' '}
                              {pkg?.packageType?.charAt(0).toUpperCase() +
                                pkg?.packageType.slice(1)}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Length:</strong> {pkg?.packageLength} cm
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Width:</strong> {pkg?.packageWidth} cm
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Height:</strong> {pkg?.packageHeight} cm
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Note:</strong> {pkg?.packageNote}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Value:</strong> {pkg?.valueOfGoods} EUR
                            </Typography>
                            <Typography variant='body2'>
                              <strong>CBM:</strong> {pkg?.CBM}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>LDM:</strong> {pkg?.LDM}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Taxable Weight:</strong> {pkg?.TaxableWeight}
                            </Typography>
                            {showSSCC && (
                              <Typography variant='body2'>
                                <strong>SSCC:</strong> {pkg?.sscc}
                              </Typography>
                            )}
                          </Box>
                        }
                        arrow
                        placement='top-start'
                      >
                        <span>Package {index + 1}</span>
                      </Tooltip>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  label='Shipping Service'
                  name={'shippingService'}
                  value={shippingFormData.shippingService}
                  onChange={handleChange}
                  fullWidth
                  size='small'
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
        {errorMessage && (
          <Typography color='error' variant='h5' gutterBottom>
            {errorMessage}
          </Typography>
        )}
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
