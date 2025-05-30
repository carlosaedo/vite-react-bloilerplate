import React, { useState, useEffect } from 'react';

import api from '../api/api';
import { useShippingFormContext } from '../context/ShippingFormContext';
import * as stringUtils from '../../utils/stringOperations.js';
import calculateShippingFormSizeValues from '../../utils/calculateShippingFormSizeShippingForm';
import calculateShippingFormTotals from '../../utils/calculateShippingFormTotals.js';
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
  FormControlLabel,
  Checkbox,
  Alert,
  Stack,
  useMediaQuery,
  CircularProgress,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LiaWpforms } from 'react-icons/lia';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const shippingServices = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'overnight', label: 'Overnight' },
];

const typeOfGoodsOptions = [{ value: 'general_goods', label: 'General Goods' }];

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

function ShippingForm({ handleChangeFormType, sidebarWidth }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    shippingFormData,
    setShippingFormData,
    resetShippingFormData,
    trackingNumberShippingForm,
    retryFetchTrackingNumber,
  } = useShippingFormContext();
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [entitiesData, setEntitiesData] = useState([]);
  const [selectedEntityIndex, setSelectedEntityIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const packagesToShow = shippingFormData?.packages?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const [showSSCC, setShowSSCC] = useState(false);

  const [showCBM, setShowCBM] = useState(true);
  const [hideLDM, setShowLDM] = useState(true);
  const [activeCBM, setActiveCBM] = useState(false);
  const [activeLDM, setActiveLDM] = useState(false);
  const [showDimensions, setShowDimensions] = useState(true);

  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);

  const [infoValues, setInfoValues] = useState(() => {
    const { totalQuantity, totalWeight } = calculateShippingFormTotals(shippingFormData.packages);
    return { totalWeight, totalQuantity };
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/shipping-form/get-entities`, {});
        if (response?.data?.entities) {
          setEntitiesData(response?.data?.entities);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to load data.');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleJumpToPackage = (index) => {
    setErrorMessage(null);
    setMessage(null);
    setSelectedPackageIndex(index);
  };

  const handleChange = (event) => {
    setMessage(null);
    setErrorMessage(null);
    setShippingFormData({
      ...shippingFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handlePackageChange = (index, field, value) => {
    setErrorMessage(null);
    setMessage(null);
    let newCalculationsForPackage = null;

    // Create the updated package object FIRST
    const currentPackage = shippingFormData.packages[index];
    const updatedPackage = {
      ...currentPackage,
      [field]: value, // Use the NEW value
    };

    // Now use the updated package for calculations
    if (
      updatedPackage.packageWeight &&
      updatedPackage.packageLength &&
      updatedPackage.packageWidth &&
      updatedPackage.packageHeight
    ) {
      newCalculationsForPackage = calculateShippingFormSizeValues(
        {
          weightKg: parseFloat(updatedPackage.packageWeight) || 0,
          lengthCm: parseFloat(updatedPackage.packageLength) || 0,
          widthCm: parseFloat(updatedPackage.packageWidth) || 0,
          heightCm: parseFloat(updatedPackage.packageHeight) || 0,
        },
        333,
      );
    } else if (updatedPackage.packageWeight && updatedPackage.CBM) {
      newCalculationsForPackage = calculateShippingFormSizeValues(
        {
          weightKg: parseFloat(updatedPackage.packageWeight) || 0,
          cbm: parseFloat(updatedPackage.CBM) || 0,
        },
        333,
      );
    }

    // Update the packages array
    const updatedPackages = [...shippingFormData.packages];
    updatedPackages[index] = {
      ...updatedPackage,
      ...(newCalculationsForPackage || {}),
    };

    const updatedFormData = {
      ...shippingFormData,
      packages: updatedPackages,
    };

    const { totalPackages, totalWeight } = calculateShippingFormTotals(updatedPackages);

    setInfoValues({ totalWeight, totalPackages });

    setShippingFormData(updatedFormData);
  };

  const handleEntityChange = (value) => {
    setMessage(null);
    setErrorMessage(null);
    setShippingFormData({
      ...shippingFormData,
      recipientName: entitiesData[value].Name,
      recipientStreet: entitiesData[value].Add1,
      recipientCity: entitiesData[value].city,
      recipientState: entitiesData[value].state,
      recipientZip: entitiesData[value].zip_code,
      recipientCountry: entitiesData[value].country,
      extNumber: entitiesData[value].external_ref,
      recipientTaxId: entitiesData[value].VAT,
    });
    setSelectedEntityIndex(value);
  };

  const handlePackageClearDimensions = (index) => {
    setErrorMessage(null);
    setMessage(null);

    const updatedPackages = [...shippingFormData.packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      ['packageHeight']: '',
      ['packageLength']: '',
      ['packageWidth']: '',
    };

    const updatedFormData = {
      ...shippingFormData,
      packages: updatedPackages,
    };

    setShippingFormData(updatedFormData);
  };

  const addPackage = () => {
    setErrorMessage(null);
    setMessage(null);
    const newPackage = {
      packageQuantity: '',
      packageWeight: '',
      packageLength: '',
      packageWidth: '',
      packageHeight: '',
      packageNote: '',
      valueOfGoods: '',
      packageType: '',
      sscc: generateMockSSCC(),
      CBM: '',
      LDM: '',
      TaxableWeight: '',
      stackable: false,
      dangerousGoods: false,
      customs: false,
      marksAndNumbers: '',
      typeOfGoods: '',
    };

    const updatedFormData = {
      ...shippingFormData,
      packages: [...shippingFormData.packages, newPackage],
    };

    setShippingFormData(updatedFormData);
    setSelectedPackageIndex(updatedFormData.packages.length - 1);
  };

  const removeAllPackages = () => {
    const confirmed = window.confirm(
      'Are you sure you want to remove all packages? This action cannot be undone.',
    );
    if (!confirmed) return;
    setErrorMessage(null);
    setMessage(null);
    const emptyPackage = {
      packageQuantity: '',
      packageWeight: '',
      packageLength: '',
      packageWidth: '',
      packageHeight: '',
      packageNote: '',
      valueOfGoods: '',
      packageType: '',
      sscc: generateMockSSCC(),
      CBM: '',
      LDM: '',
      TaxableWeight: '',
      stackable: false,
      dangerousGoods: false,
      customs: false,
      marksAndNumbers: '',
      typeOfGoods: '',
    };
    const updatedFormData = {
      ...shippingFormData,
      packages: [emptyPackage],
    };

    setInfoValues({ totalWeight: 0, totalPackages: 0 });

    setShippingFormData(updatedFormData);
    setSelectedPackageIndex(0);
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

      const { totalPackages, totalWeight } = calculateShippingFormTotals(updatedPackages);

      setInfoValues({ totalWeight, totalPackages });

      setShippingFormData(updatedFormData);
      if (selectedPackageIndex === index) {
        setSelectedPackageIndex(selectedPackageIndex - 1);
      }
    }
  };

  const resetForm = () => {
    setErrorMessage(null);
    setMessage(null);
    resetShippingFormData();
    setInfoValues({ totalWeight: 0, totalPackages: 0 });
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
  }, []);

  const handleChangeFormTypeToParent = () => {
    handleChangeFormType(false);
  };

  //if (loadingShippingForm) return <CircularProgress />;
  //
  if (loading) return <CircularProgress sx={{ marginTop: 4 }} />;

  return (
    <React.Fragment>
      {(shippingFormData.trackingRef === null || trackingNumberShippingForm === null) && (
        <Alert
          severity='error'
          action={
            <Button color='inherit' size='small' onClick={retryFetchTrackingNumber}>
              Retry Now
            </Button>
          }
        >
          Cannot get tracking number from the server. Retrying automatically every 10 seconds...
        </Alert>
      )}

      <Paper sx={{ p: 2, width: '98%', margin: 'auto', mt: 5 }}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant='h5'
            gutterBottom
            sx={{ fontWeight: 700, color: '#003e2d', display: 'flex' }}
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
            <Grid size={{ sm: 2, xs: 6 }}>
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
            <Grid size={{ sm: 2, xs: 6 }}>
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
            <Grid size={{ sm: 2, xs: 6 }}>
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
            <Grid size={{ sm: 2, xs: 6 }}>
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

            <Grid size={{ sm: 2, xs: 6 }}>
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
            <Grid size={{ sm: 2, xs: 6 }}>
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
            <Grid size={{ sm: 2, xs: 6 }}>
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
                disabled
              />
            </Grid>
            <Grid size={{ sm: 2, xs: 6 }}>
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
            <Grid size={{ sm: 2, xs: 6 }}>
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
            <Grid size={{ sm: 2, xs: 6 }}>
              <FormControl fullWidth size='small' margin='dense' required>
                <InputLabel>Select Entity</InputLabel>
                <Select
                  value={selectedEntityIndex || ''}
                  onChange={(e) => handleEntityChange(e.target.value)}
                  label='Select Entity'
                >
                  <MenuItem value='' disabled>
                    Select Entity
                  </MenuItem>
                  {entitiesData.map((entity, index) => (
                    <MenuItem key={index} value={index}>
                      {entity.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Box display='flex' gap={4} flexWrap='wrap' sx={{ mb: 4 }}>
          {/* Sender Info */}
          <Box flex={1} minWidth={300}>
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
          <Box flex={1} minWidth={300}>
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

          <Divider sx={{ mb: 2 }} />
          <Paper elevation={2} sx={{ mt: 2, p: 2, mb: 2 }}>
            <Typography variant='h6' gutterBottom>
              Package Table
            </Typography>
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
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
                      <strong>Note</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Value (€)</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {packagesToShow?.map((pkg, index) => {
                    const globalIndex = page * rowsPerPage + index;

                    return (
                      <React.Fragment key={globalIndex}>
                        <Tooltip
                          title={
                            <Box sx={{ p: 1 }}>
                              <Typography variant='body2'>
                                <strong>Quantity:</strong> {pkg?.packageQuantity || '-'}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Weight:</strong> {pkg?.packageWeight || '-'} kg
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Type:</strong>{' '}
                                {stringUtils.capitalizeFirst(pkg?.packageType) || '-'}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Length:</strong> {pkg?.packageLength || '-'} cm
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Width:</strong> {pkg?.packageWidth || '-'} cm
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Height:</strong> {pkg?.packageHeight || '-'} cm
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Marks and Numbers:</strong> {pkg?.marksAndNumbers || '-'}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Type of Goods:</strong>{' '}
                                {stringUtils.toSpacedTitleCase(pkg?.typeOfGoods) || '-'}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Note:</strong> {pkg?.packageNote || '-'}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Value:</strong> {pkg?.valueOfGoods || '-'} €
                              </Typography>
                              <Typography variant='body2'>
                                <strong>CBM:</strong> {pkg?.CBM || '-'}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>LDM:</strong> {pkg?.LDM || '-'}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Taxable Weight:</strong> {pkg?.TaxableWeight || '-'}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Insured:</strong> {pkg?.insured ? 'Yes' : 'No'}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Stackable:</strong> {pkg?.stackable ? 'Yes' : 'No'}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Dangerous Goods:</strong>{' '}
                                {pkg?.dangerousGoods ? 'Yes' : 'No'}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Customs:</strong> {pkg?.customs ? 'Yes' : 'No'}
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
                              {pkg?.packageNote || '-'}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: showSSCC ? 'none !important' : undefined,
                              }}
                            >
                              {pkg?.insured ? pkg?.valueOfGoods || '-' : 'NOT INSURED'}
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
            </Box>
            <TablePagination
              component='div'
              count={shippingFormData?.packages?.length}
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
                    <strong>Quantity:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.packageQuantity || '-'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Weight:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.packageWeight || '-'} kg
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Type:</strong>{' '}
                    {stringUtils.capitalizeFirst(
                      shippingFormData?.packages[selectedPackageIndex]?.packageType,
                    ) || '-'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Length:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.packageLength || '-'} cm
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Width:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.packageWidth || '-'} cm
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Height:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.packageHeight || '-'} cm
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Marks and Numbers:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.marksAndNumbers || '-'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Type of Goods:</strong>{' '}
                    {stringUtils.toSpacedTitleCase(
                      shippingFormData?.packages[selectedPackageIndex]?.typeOfGoods,
                    ) || '-'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Note:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.packageNote || '-'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Value:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.valueOfGoods || '-'} €
                  </Typography>
                  <Typography variant='body2'>
                    <strong>CBM:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.CBM || '-'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>LDM:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.LDM || '-'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Taxable Weight:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.TaxableWeight || '-'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Insured:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.insured ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Stackable:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.stackable ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Dangerous Goods:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.dangerousGoods
                      ? 'Yes'
                      : 'No'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Customs:</strong>{' '}
                    {shippingFormData?.packages[selectedPackageIndex]?.customs ? 'Yes' : 'No'}
                  </Typography>
                  {showSSCC && (
                    <Typography variant='body2'>
                      <strong>SSCC:</strong>{' '}
                      {shippingFormData?.packages[selectedPackageIndex]?.sscc}
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
                    # {selectedPackageIndex + 1}
                  </Box>
                </Typography>

                {shippingFormData.packages.length > 1 && (
                  <IconButton
                    onClick={() => removePackage(selectedPackageIndex)}
                    color='error'
                    size='small'
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Tooltip>

            <React.Fragment>
              <Grid container spacing={2}>
                {/* Top-right CBM section */}
                <Grid
                  size={{ xs: 12 }}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    gap: 2,
                  }}
                >
                  <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                      label='Weight (kg)'
                      name={`packageWeight_${selectedPackageIndex}`}
                      type='number'
                      value={shippingFormData.packages[selectedPackageIndex]?.packageWeight}
                      onChange={(e) =>
                        handlePackageChange(selectedPackageIndex, 'packageWeight', e.target.value)
                      }
                      fullWidth
                      size='small'
                      margin='dense'
                      required
                      slotProps={{ htmlInput: { min: 0 } }}
                    />
                  </Grid>

                  {showDimensions && (
                    <React.Fragment>
                      <Grid size={{ xs: 12, sm: 2 }}>
                        <Tooltip
                          title='Setting this value will automatically calculate CBM'
                          placement='top'
                          arrow
                        >
                          <TextField
                            label='Length (cm)'
                            name={`packageLength_${selectedPackageIndex}`}
                            type='number'
                            value={shippingFormData.packages[selectedPackageIndex]?.packageLength}
                            onChange={(e) =>
                              handlePackageChange(
                                selectedPackageIndex,
                                'packageLength',
                                e.target.value,
                              )
                            }
                            fullWidth
                            size='small'
                            margin='dense'
                            slotProps={{ htmlInput: { min: 0 } }}
                          />
                        </Tooltip>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 2 }}>
                        <Tooltip
                          title='Setting this value will automatically calculate CBM'
                          placement='top'
                          arrow
                        >
                          <TextField
                            label='Width (cm)'
                            name={`packageWidth_${selectedPackageIndex}`}
                            type='number'
                            value={shippingFormData.packages[selectedPackageIndex]?.packageWidth}
                            onChange={(e) =>
                              handlePackageChange(
                                selectedPackageIndex,
                                'packageWidth',
                                e.target.value,
                              )
                            }
                            fullWidth
                            size='small'
                            margin='dense'
                            slotProps={{ htmlInput: { min: 0 } }}
                          />
                        </Tooltip>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 2 }}>
                        <Tooltip
                          title='Setting this value will automatically calculate CBM'
                          placement='top'
                          arrow
                        >
                          <TextField
                            label='Height (cm)'
                            name={`packageHeight_${selectedPackageIndex}`}
                            type='number'
                            value={shippingFormData.packages[selectedPackageIndex]?.packageHeight}
                            onChange={(e) =>
                              handlePackageChange(
                                selectedPackageIndex,
                                'packageHeight',
                                e.target.value,
                              )
                            }
                            fullWidth
                            size='small'
                            margin='dense'
                            slotProps={{ htmlInput: { min: 0 } }}
                          />
                        </Tooltip>
                      </Grid>
                    </React.Fragment>
                  )}

                  {showCBM && (
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <TextField
                        label='CBM'
                        name={`CBM_${selectedPackageIndex}`}
                        type='number'
                        value={shippingFormData.packages[selectedPackageIndex]?.CBM}
                        onChange={(e) =>
                          handlePackageChange(selectedPackageIndex, 'CBM', e.target.value)
                        }
                        fullWidth
                        size='small'
                        margin='dense'
                        disabled={!activeCBM}
                        slotProps={{ htmlInput: { min: 0 } }}
                      />
                      <Tooltip
                        title='This will clear your package dimensions'
                        placement='top'
                        arrow
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={activeCBM}
                              onChange={(e) => {
                                setActiveCBM(e.target.checked);
                                setShowLDM(!e.target.checked);
                                setShowDimensions(!e.target.checked);
                                handlePackageClearDimensions(selectedPackageIndex);
                              }}
                            />
                          }
                          label='Edit CBM'
                        />
                      </Tooltip>
                    </Grid>
                  )}

                  {hideLDM && (
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <TextField
                        label='LDM'
                        name={`LDM_${selectedPackageIndex}`}
                        type='number'
                        value={shippingFormData.packages[selectedPackageIndex]?.LDM}
                        onChange={(e) =>
                          handlePackageChange(selectedPackageIndex, 'LDM', e.target.value)
                        }
                        fullWidth
                        size='small'
                        margin='dense'
                        disabled={!activeLDM}
                        slotProps={{ htmlInput: { min: 0 } }}
                      />
                      <Tooltip
                        title='This will clear your package dimensions'
                        placement='top'
                        arrow
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={activeLDM}
                              onChange={(e) => {
                                setActiveLDM(e.target.checked);
                                setShowCBM(!e.target.checked);
                                setShowDimensions(!e.target.checked);
                                handlePackageClearDimensions(selectedPackageIndex);
                              }}
                            />
                          }
                          label='Edit LDM'
                        />
                      </Tooltip>
                    </Grid>
                  )}

                  <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                      label='TaxableWeight'
                      name={`TaxableWeight_${selectedPackageIndex}`}
                      type='number'
                      value={shippingFormData.packages[selectedPackageIndex]?.TaxableWeight}
                      onChange={(e) =>
                        handlePackageChange(selectedPackageIndex, 'TaxableWeight', e.target.value)
                      }
                      fullWidth
                      size='small'
                      margin='dense'
                      disabled
                      slotProps={{ htmlInput: { min: 0 } }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <TextField
                    label='Quantity'
                    name={`packageQuantity_${selectedPackageIndex}`}
                    type='number'
                    value={shippingFormData.packages[selectedPackageIndex]?.packageQuantity}
                    onChange={(e) =>
                      handlePackageChange(selectedPackageIndex, 'packageQuantity', e.target.value)
                    }
                    fullWidth
                    size='small'
                    margin='dense'
                    required
                    slotProps={{ htmlInput: { min: 0 } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    select
                    label='Package Type'
                    name={`packageType_${selectedPackageIndex}`}
                    value={shippingFormData.packages[selectedPackageIndex]?.packageType}
                    onChange={(e) =>
                      handlePackageChange(selectedPackageIndex, 'packageType', e.target.value)
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

                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    select
                    label='Type of Goods'
                    name={`typeOfGoods_${selectedPackageIndex}`}
                    value={shippingFormData.packages[selectedPackageIndex]?.typeOfGoods || ''}
                    onChange={(e) =>
                      handlePackageChange(selectedPackageIndex, 'typeOfGoods', e.target.value)
                    }
                    fullWidth
                    size='small'
                    margin='dense'
                    required
                  >
                    {typeOfGoodsOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Note'
                    name={`packageDescription_${selectedPackageIndex}`}
                    value={shippingFormData.packages[selectedPackageIndex]?.packageNote}
                    onChange={(e) =>
                      handlePackageChange(selectedPackageIndex, 'packageNote', e.target.value)
                    }
                    fullWidth
                    size='small'
                    margin='dense'
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Marks and Numbers'
                    name={`marksAndNumbers_${selectedPackageIndex}`}
                    type='text'
                    value={shippingFormData.packages[selectedPackageIndex]?.marksAndNumbers}
                    onChange={(e) =>
                      handlePackageChange(selectedPackageIndex, 'marksAndNumbers', e.target.value)
                    }
                    fullWidth
                    multiline
                    size='small'
                    margin='dense'
                    rows={2}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                {shippingFormData.packages[selectedPackageIndex]?.insured && (
                  <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                      label='Value of Goods (€)'
                      name={`packageValue_${selectedPackageIndex}`}
                      type='number'
                      value={shippingFormData.packages[selectedPackageIndex]?.valueOfGoods}
                      onChange={(e) =>
                        handlePackageChange(selectedPackageIndex, 'valueOfGoods', e.target.value)
                      }
                      fullWidth
                      size='small'
                      margin='dense'
                      required={shippingFormData.packages[selectedPackageIndex]?.insured || false}
                      sx={{ minWidth: 180 }}
                      slotProps={{ htmlInput: { min: 0 } }}
                    />
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: 2 }}>
                  <FormControlLabel
                    sx={{ mt: 1 }}
                    control={
                      <Checkbox
                        checked={shippingFormData.packages[selectedPackageIndex]?.insured || false}
                        onChange={(e) =>
                          handlePackageChange(selectedPackageIndex, 'insured', e.target.checked)
                        }
                        name={`insured_${selectedPackageIndex}`}
                        color='primary'
                      />
                    }
                    label='Insured'
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <FormControlLabel
                    sx={{ mt: 1 }}
                    control={
                      <Checkbox
                        checked={
                          shippingFormData.packages[selectedPackageIndex]?.stackable || false
                        }
                        onChange={(e) =>
                          handlePackageChange(selectedPackageIndex, 'stackable', e.target.checked)
                        }
                        name={`stackable_${selectedPackageIndex}`}
                        color='primary'
                      />
                    }
                    label='Stackable'
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <FormControlLabel
                    sx={{ mt: 1 }}
                    control={
                      <Checkbox
                        checked={
                          shippingFormData.packages[selectedPackageIndex]?.dangerousGoods || false
                        }
                        onChange={(e) =>
                          handlePackageChange(
                            selectedPackageIndex,
                            'dangerousGoods',
                            e.target.checked,
                          )
                        }
                        name={`dangerousGoods_${selectedPackageIndex}`}
                        color='primary'
                      />
                    }
                    label='Dangerous Goods'
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <FormControlLabel
                    sx={{ mt: 1 }}
                    control={
                      <Checkbox
                        checked={shippingFormData.packages[selectedPackageIndex]?.customs || false}
                        onChange={(e) =>
                          handlePackageChange(selectedPackageIndex, 'customs', e.target.checked)
                        }
                        name={`customs_${selectedPackageIndex}`}
                        color='primary'
                      />
                    }
                    label='Customs'
                  />
                </Grid>
              </Grid>
              {showSSCC && (
                <TextField
                  label='SSCC'
                  name='sscc'
                  type='text'
                  value={shippingFormData.packages[selectedPackageIndex]?.sscc}
                  fullWidth
                  size='small'
                  margin='dense'
                  disabled={true}
                />
              )}
            </React.Fragment>
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

        <Box
          position='fixed'
          bottom={0}
          // Responsive left and width for mobile:
          left={{ xs: sidebarWidth, sm: sidebarWidth }}
          width={{ xs: `calc(100% - ${sidebarWidth}px)`, sm: `calc(100% - ${sidebarWidth}px)` }}
          sx={{
            transition: 'left 0.3s ease, width 0.3s ease',
            bgcolor: '#fff',
            boxShadow: 3,
            p: { xs: 1, sm: 2 }, // less padding on mobile
            textAlign: 'right',
            zIndex: 100,
            // enforce font size on all descendants:
            '& *': {
              fontSize: !isMobile && '0.8rem !important',
            },
          }}
        >
          <Stack
            direction='row'
            spacing={{ xs: 1, sm: 2 }} // less spacing on mobile
            alignItems='center'
            justifyContent='flex-end'
            flexWrap='wrap'
          >
            <Typography>
              Total Weight: <strong>{infoValues.totalWeight} kg</strong>
            </Typography>
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
              sx={{ marginRight: 1 }}
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={addPackage}
              size='small'
            >
              Add Package
            </Button>
            <Button
              variant='contained'
              color='error'
              startIcon={<DeleteIcon />}
              onClick={removeAllPackages}
              size='small'
            >
              Remove All
            </Button>
            <Typography sx={{ ml: 2 }}>
              <strong>
                {shippingFormData.packages.length}{' '}
                {shippingFormData.packages.length > 1 ? 'Packages' : 'Package'}
              </strong>
            </Typography>
            <Select
              size='small'
              displayEmpty
              value={selectedPackageIndex}
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
                          <strong>Quantity:</strong> {pkg?.packageQuantity || '-'}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Weight:</strong> {pkg?.packageWeight || '-'} kg
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Type:</strong>{' '}
                          {stringUtils.capitalizeFirst(pkg?.packageType) || '-'}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Length:</strong> {pkg?.packageLength || '-'} cm
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Width:</strong> {pkg?.packageWidth || '-'} cm
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Height:</strong> {pkg?.packageHeight || '-'} cm
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Marks and Numbers:</strong> {pkg?.marksAndNumbers || '-'}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Type of Goods:</strong>{' '}
                          {stringUtils.toSpacedTitleCase(pkg?.typeOfGoods) || '-'}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Note:</strong> {pkg?.packageNote || '-'}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Value:</strong> {pkg?.valueOfGoods || '-'} €
                        </Typography>
                        <Typography variant='body2'>
                          <strong>CBM:</strong> {pkg?.CBM || '-'}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>LDM:</strong> {pkg?.LDM || '-'}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Taxable Weight:</strong> {pkg?.TaxableWeight || '-'}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Insured:</strong> {pkg?.insured ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Stackable:</strong> {pkg?.stackable ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Dangerous Goods:</strong> {pkg?.dangerousGoods ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant='body2'>
                          <strong>Customs:</strong> {pkg?.customs ? 'Yes' : 'No'}
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
                    <span>Package: {index + 1}</span>
                  </Tooltip>
                </MenuItem>
              ))}
            </Select>
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
          </Stack>
        </Box>
      </Paper>
    </React.Fragment>
  );
}

export default ShippingForm;
