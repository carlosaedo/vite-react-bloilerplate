import React, { useState, useEffect } from 'react';

import api from '../api/api';
import { useShippingFormContext } from '../context/ShippingFormContext';

import calculateShippingFormSizeValues from '../../utils/calculateShippingFormSizeShippingForm';

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
  Select,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TablePagination,
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
  const handleJumpToPackage = (index) => {
    setErrorMessage(null);
    setMessage(null);
    setSelectedPackage({ pkgData: shippingFormData.packages[index], pkgIndex: index });
  };

  const { shippingFormData, setShippingFormData, resetShippingFormData } = useShippingFormContext();

  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const packagesToShow = shippingFormData.packages.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const [showSSCC, setShowSSCC] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState({
    pkgData: shippingFormData.packages[0],
    pkgIndex: 0,
  });

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
    setErrorMessage(null);
    setMessage(null);

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
    setErrorMessage(null);
    setMessage(null);
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
    setErrorMessage(null);
    setMessage(null);
    resetShippingFormData();
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
        !pkg?.packageDescription ||
        !pkg?.packageValue
      ) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFromBeforeSubmit()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
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
                New Booking Information
              </Typography>
            )}
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
          <Typography variant='h6'>Booking Information</Typography>
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
              startIcon={showSSCC ? <IoMdEyeOff /> : <IoMdEye />}
              onClick={showSSCC ? () => setShowSSCC(false) : () => setShowSSCC(true)}
              size='small'
            >
              {showSSCC ? 'Hide SSCC' : 'Show SSCC'}
            </Button>
            <Button variant='outlined' startIcon={<AddIcon />} onClick={addPackage} size='small'>
              Add Package
            </Button>
            <Typography sx={{ ml: 2 }}>
              {shippingFormData.packages.length}{' '}
              {shippingFormData.packages.length > 1 ? 'Packages' : 'Package'}
            </Typography>
            <Select
              size='small'
              displayEmpty
              value={selectedPackage?.pkgIndex}
              onChange={(e) => handleJumpToPackage(e.target.value)}
              sx={{ ml: 2 }}
            >
              <MenuItem value='' disabled>
                Select Package
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
                          <strong>Description:</strong> {pkg?.packageDescription}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Value:</strong> {pkg?.packageValue} EUR
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
          <Divider sx={{ mb: 2 }} />
          <Paper elevation={2} sx={{ mt: 2, p: 2, mb: 2 }}>
            <Typography variant='h6' gutterBottom>
              Package Table
            </Typography>

            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>#</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Weight (kg)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Type</strong>
                  </TableCell>
                  <TableCell>
                    <strong>CBM</strong>
                  </TableCell>
                  <TableCell>
                    <strong>LDM</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Taxable Weight</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Value (€)</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {packagesToShow.map((pkg, index) => {
                  const globalIndex = page * rowsPerPage + index;

                  return (
                    <React.Fragment key={globalIndex}>
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
                              <strong>Description:</strong> {pkg?.packageDescription}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Value:</strong> {pkg?.packageValue} EUR
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
                        <TableRow
                          onClick={() => handleJumpToPackage(globalIndex)}
                          sx={{
                            cursor: 'pointer',
                          }}
                        >
                          <TableCell
                            sx={{
                              borderBottom: showSSCC ? 'none !important' : undefined,
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
                                  mr: 1.5,
                                  minWidth: 24,
                                  textAlign: 'center',
                                }}
                              >
                                {globalIndex + 1}
                              </Box>
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: showSSCC ? 'none !important' : undefined,
                            }}
                          >
                            {pkg?.packageWeight || '-'}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: showSSCC ? 'none !important' : undefined,
                            }}
                          >
                            {pkg?.packageType?.charAt(0).toUpperCase() +
                              pkg?.packageType?.slice(1) || '-'}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: showSSCC ? 'none !important' : undefined,
                            }}
                          >
                            {pkg?.CBM || '-'}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: showSSCC ? 'none !important' : undefined,
                            }}
                          >
                            {pkg?.LDM || '-'}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: showSSCC ? 'none !important' : undefined,
                            }}
                          >
                            {pkg?.TaxableWeight || '-'}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: showSSCC ? 'none !important' : undefined,
                            }}
                          >
                            {pkg?.packageDescription || '-'}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: showSSCC ? 'none !important' : undefined,
                            }}
                          >
                            {pkg?.packageValue || '-'}
                          </TableCell>
                        </TableRow>
                      </Tooltip>
                      {showSSCC && (
                        <TableRow>
                          <TableCell colSpan={8}>
                            <Typography
                              variant='body2'
                              sx={{
                                pl: 5,
                                color: 'text.secondary',
                                fontSize: '0.75rem',
                              }}
                              style={{ fontStyle: 'italic !important' }} // inline style with !important
                            >
                              <strong>SSCC:</strong> {pkg?.sscc}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
            <TablePagination
              component='div'
              count={shippingFormData.packages.length}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10]}
              // hide rowsPerPage selector by providing only one option
            />
          </Paper>
          <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Tooltip
              title={
                <Box sx={{ p: 1 }}>
                  <Typography variant='body2'>
                    <strong>Weight:</strong> {selectedPackage?.pkgData?.packageWeight} kg
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Type:</strong>{' '}
                    {selectedPackage?.pkgData?.packageType?.charAt(0).toUpperCase() +
                      selectedPackage?.pkgData?.packageType.slice(1)}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Length:</strong> {selectedPackage?.pkgData?.packageLength} cm
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Width:</strong> {selectedPackage?.pkgData?.packageWidth} cm
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Height:</strong> {selectedPackage?.pkgData?.packageHeight} cm
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Description:</strong> {selectedPackage?.pkgData?.packageDescription}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Value:</strong> {selectedPackage?.pkgData?.packageValue} EUR
                  </Typography>
                  <Typography variant='body2'>
                    <strong>CBM:</strong> {selectedPackage?.pkgData?.CBM}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>LDM:</strong> {selectedPackage?.pkgData?.LDM}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Taxable Weight:</strong> {selectedPackage?.pkgData?.TaxableWeight}
                  </Typography>
                  {showSSCC && (
                    <Typography variant='body2'>
                      <strong>SSCC:</strong> {selectedPackage?.pkgData?.sscc}
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
                <Typography variant='subtitle1' sx={{ display: 'flex', alignItems: 'center' }}>
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
                      cursor: 'pointer',
                    }}
                  >
                    # {selectedPackage?.pkgIndex + 1}
                  </Box>
                </Typography>

                {shippingFormData.packages.length > 1 && (
                  <IconButton
                    onClick={() => removePackage(selectedPackage?.pkgIndex)}
                    color='error'
                    size='small'
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Tooltip>

            <>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    label='Weight (kg)'
                    name={`packageWeight_${selectedPackage?.pkgIndex}`}
                    type='number'
                    value={shippingFormData.packages[selectedPackage?.pkgIndex]?.packageWeight}
                    onChange={(e) =>
                      handlePackageChange(
                        selectedPackage?.pkgIndex,
                        'packageWeight',
                        e.target.value,
                      )
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
                    name={`packageType_${selectedPackage?.pkgIndex}`}
                    value={shippingFormData.packages[selectedPackage?.pkgIndex]?.packageType}
                    onChange={(e) =>
                      handlePackageChange(selectedPackage?.pkgIndex, 'packageType', e.target.value)
                    }
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
                    name={`packageLength_${selectedPackage?.pkgIndex}`}
                    type='number'
                    value={shippingFormData.packages[selectedPackage?.pkgIndex]?.packageLength}
                    onChange={(e) =>
                      handlePackageChange(
                        selectedPackage?.pkgIndex,
                        'packageLength',
                        e.target.value,
                      )
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
                    name={`packageWidth_${selectedPackage?.pkgIndex}`}
                    type='number'
                    value={shippingFormData.packages[selectedPackage?.pkgIndex]?.packageWidth}
                    onChange={(e) =>
                      handlePackageChange(selectedPackage?.pkgIndex, 'packageWidth', e.target.value)
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
                    label='Height (cm)'
                    name={`packageHeight_${selectedPackage?.pkgIndex}`}
                    type='number'
                    value={shippingFormData.packages[selectedPackage?.pkgIndex]?.packageHeight}
                    onChange={(e) =>
                      handlePackageChange(
                        selectedPackage?.pkgIndex,
                        'packageHeight',
                        e.target.value,
                      )
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
                name={`packageDescription_${selectedPackage?.pkgIndex}`}
                value={shippingFormData.packages[selectedPackage?.pkgIndex]?.packageDescription}
                onChange={(e) =>
                  handlePackageChange(
                    selectedPackage?.pkgIndex,
                    'packageDescription',
                    e.target.value,
                  )
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
                name={`packageValue_${selectedPackage?.pkgIndex}`}
                type='number'
                value={shippingFormData.packages[selectedPackage?.pkgIndex]?.packageValue}
                onChange={(e) =>
                  handlePackageChange(selectedPackage?.pkgIndex, 'packageValue', e.target.value)
                }
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
                  value={shippingFormData.packages[selectedPackage?.pkgIndex]?.sscc}
                  fullWidth
                  size='small'
                  margin='dense'
                  disabled={true}
                />
              )}
            </>
          </Box>

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
              startIcon={showSSCC ? <IoMdEyeOff /> : <IoMdEye />}
              onClick={showSSCC ? () => setShowSSCC(false) : () => setShowSSCC(true)}
              size='small'
            >
              {showSSCC ? 'Hide SSCC' : 'Show SSCC'}
            </Button>
            <Button variant='outlined' startIcon={<AddIcon />} onClick={addPackage} size='small'>
              Add Package
            </Button>
            <Typography sx={{ ml: 2 }}>
              {shippingFormData.packages.length}{' '}
              {shippingFormData.packages.length > 1 ? 'Packages' : 'Package'}
            </Typography>
            <Select
              size='small'
              displayEmpty
              value={selectedPackage?.pkgIndex}
              onChange={(e) => handleJumpToPackage(e.target.value)}
              sx={{ ml: 2 }}
            >
              <MenuItem value='' disabled>
                Select Package
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
                          <strong>Description:</strong> {pkg?.packageDescription}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Value:</strong> {pkg?.packageValue} EUR
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
