import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import * as stringUtils from '../../utils/stringOperations.js';
import { useShippingFormContext } from '../context/ShippingFormContext';
import calculateShippingFormSizeValues from '../../utils/calculateShippingFormSizeShippingForm';
import calculateShippingFormTotals from '../../utils/calculateShippingFormTotals.js';
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
  Alert,
  Stack,
  Divider,
  useMediaQuery,
  CircularProgress,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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

const typeOfGoodsOptions = [{ value: 'general_goods', label: 'General Goods' }];

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
  const packageRefs = useRef([]);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState('');
  const [entitiesData, setEntitiesData] = useState([]);
  const [selectedEntityIndex, setSelectedEntityIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  /*const handleJumpToPackage = (index) => {
      packageRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };*/

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
    setMessage(null);
    setErrorMessage(null);
    const el = packageRefs.current[index];
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    // Reset dropdown after scroll
    setSelectedPackageIndex('');
  };

  const {
    shippingFormData,
    setShippingFormData,
    resetShippingFormData,
    trackingNumberShippingForm,
    retryFetchTrackingNumber,
  } = useShippingFormContext();

  const [step, setStep] = useState(0);

  const [showSSCC, setShowSSCC] = useState(false);

  const [showCBM, setShowCBM] = useState(true);
  const [hideLDM, setShowLDM] = useState(true);
  const [activeCBM, setActiveCBM] = useState(false);
  const [activeLDM, setActiveLDM] = useState(false);
  const [showDimensions, setShowDimensions] = useState(true);

  const [showPackageDetails, setShowPackageDetails] = useState(true);
  const [infoValues, setInfoValues] = useState(() => {
    const { totalQuantity, totalWeight } = calculateShippingFormTotals(shippingFormData.packages);
    return { totalWeight, totalQuantity };
  });
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
  };

  const handlePackageChange = (index, field, value) => {
    setMessage(null);
    setErrorMessage(null);

    // Create the updated package object FIRST with the new value
    const currentPackage = shippingFormData.packages[index];
    const updatedPackage = {
      ...currentPackage,
      [field]: value, // Use the NEW value
    };

    let newCalculationsForPackage = null;

    // Use the updated package for calculations
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
    setMessage(null);
    setErrorMessage(null);
    const newPackage = {
      packageQuantity: '',
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
      typeOfGoods: '',
    };

    const updatedFormData = {
      ...shippingFormData,
      packages: [...shippingFormData.packages, newPackage],
    };

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
    setMessage(null);
    setErrorMessage(null);
    if (shippingFormData.packages.length > 1) {
      const updatedPackages = shippingFormData.packages.filter((_, i) => i !== index);
      const updatedFormData = {
        ...shippingFormData,
        packages: updatedPackages,
      };

      const { totalPackages, totalWeight } = calculateShippingFormTotals(updatedPackages);

      setInfoValues({ totalWeight, totalPackages });

      setShippingFormData(updatedFormData);
    }
  };

  const resetForm = () => {
    setMessage(null);
    setErrorMessage(null);
    resetShippingFormData();
    setInfoValues({ totalWeight: 0, totalPackages: 0 });
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

        <Tabs
          value={step}
          onChange={handleStepChange}
          variant='fullWidth'
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            minHeight: '52px',
            p: 0.5,
            boxShadow: 'inset 0 0 4px rgba(0,0,0,0.08)',
            '& .MuiTabs-flexContainer': {
              gap: 0.5,
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          {['Sender Info', 'Recipient Info', 'Package Details', 'Review & Submit'].map(
            (label, index) => (
              <Tab
                key={index}
                label={label}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  borderRadius: '12px',
                  minHeight: '44px',
                  mx: 0.25,
                  color: '#003D2C',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    backgroundColor: '#003D2C',
                    color: '#ffffff',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                  },
                  '&:hover': {
                    backgroundColor: '#ffc928',
                    color: '#003D2C',
                  },
                }}
              />
            ),
          )}
        </Tabs>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {step === 0 && (
            <React.Fragment>
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
            </React.Fragment>
          )}

          {step === 1 && (
            <React.Fragment>
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
            </React.Fragment>
          )}

          {step === 2 && (
            <React.Fragment>
              {/* Package Info - Multiple Packages */}
              <Box sx={{ mb: 4, width: '100%' }}>
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
                            <React.Fragment>
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
                            </React.Fragment>
                          )}
                        </Typography>

                        {shippingFormData.packages.length > 1 && (
                          <IconButton
                            onClick={() => removePackage(index)}
                            color='error'
                            size='small'
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Tooltip>
                    {showPackageDetails && (
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
                                name={`packageWeight_${index}`}
                                type='number'
                                value={shippingFormData.packages[index]?.packageWeight}
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
                                      name={`packageLength_${index}`}
                                      type='number'
                                      value={shippingFormData.packages[index]?.packageLength}
                                      onChange={(e) =>
                                        handlePackageChange(index, 'packageLength', e.target.value)
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
                                      name={`packageWidth_${index}`}
                                      type='number'
                                      value={shippingFormData.packages[index]?.packageWidth}
                                      onChange={(e) =>
                                        handlePackageChange(index, 'packageWidth', e.target.value)
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
                                      name={`packageHeight_${index}`}
                                      type='number'
                                      value={shippingFormData.packages[index]?.packageHeight}
                                      onChange={(e) =>
                                        handlePackageChange(index, 'packageHeight', e.target.value)
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
                                  name={`CBM_${index}`}
                                  type='number'
                                  value={shippingFormData.packages[index]?.CBM}
                                  onChange={(e) =>
                                    handlePackageChange(index, 'CBM', e.target.value)
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
                                          handlePackageClearDimensions(index);
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
                                  name={`LDM_${index}`}
                                  type='number'
                                  value={shippingFormData.packages[index]?.LDM}
                                  onChange={(e) =>
                                    handlePackageChange(index, 'LDM', e.target.value)
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
                                          handlePackageClearDimensions(index);
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
                                name={`TaxableWeight_${index}`}
                                type='number'
                                value={shippingFormData.packages[index]?.TaxableWeight}
                                onChange={(e) =>
                                  handlePackageChange(index, 'TaxableWeight', e.target.value)
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
                              name={`packageQuantity_${index}`}
                              type='number'
                              value={shippingFormData.packages[index]?.packageQuantity}
                              onChange={(e) =>
                                handlePackageChange(index, 'packageQuantity', e.target.value)
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
                              name={`packageType_${index}`}
                              value={shippingFormData.packages[index]?.packageType}
                              onChange={(e) =>
                                handlePackageChange(index, 'packageType', e.target.value)
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
                              name={`typeOfGoods_${index}`}
                              value={shippingFormData.packages[index]?.typeOfGoods || ''}
                              onChange={(e) =>
                                handlePackageChange(index, 'typeOfGoods', e.target.value)
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
                              name={`packageDescription_${index}`}
                              value={shippingFormData.packages[index]?.packageNote}
                              onChange={(e) =>
                                handlePackageChange(index, 'packageNote', e.target.value)
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
                              name={`marksAndNumbers_${index}`}
                              type='text'
                              value={shippingFormData.packages[index]?.marksAndNumbers}
                              onChange={(e) =>
                                handlePackageChange(index, 'marksAndNumbers', e.target.value)
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
                          {shippingFormData.packages[index]?.insured && (
                            <Grid size={{ xs: 12, sm: 2 }}>
                              <TextField
                                label='Value of Goods (€)'
                                name={`packageValue_${index}`}
                                type='number'
                                value={shippingFormData.packages[index]?.valueOfGoods}
                                onChange={(e) =>
                                  handlePackageChange(index, 'valueOfGoods', e.target.value)
                                }
                                fullWidth
                                size='small'
                                margin='dense'
                                required={shippingFormData.packages[index]?.insured || false}
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
                                  checked={shippingFormData.packages[index]?.insured || false}
                                  onChange={(e) =>
                                    handlePackageChange(index, 'insured', e.target.checked)
                                  }
                                  name={`insured_${index}`}
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
                                  checked={shippingFormData.packages[index]?.stackable || false}
                                  onChange={(e) =>
                                    handlePackageChange(index, 'stackable', e.target.checked)
                                  }
                                  name={`stackable_${index}`}
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
                                    shippingFormData.packages[index]?.dangerousGoods || false
                                  }
                                  onChange={(e) =>
                                    handlePackageChange(index, 'dangerousGoods', e.target.checked)
                                  }
                                  name={`dangerousGoods_${index}`}
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
                                  checked={shippingFormData.packages[index]?.customs || false}
                                  onChange={(e) =>
                                    handlePackageChange(index, 'customs', e.target.checked)
                                  }
                                  name={`customs_${index}`}
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
                            value={shippingFormData.packages[index]?.sscc}
                            fullWidth
                            size='small'
                            margin='dense'
                            disabled={true}
                          />
                        )}
                      </React.Fragment>
                    )}
                  </Box>
                ))}

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
            </React.Fragment>
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
                    <span>Package {index + 1}</span>
                  </Tooltip>
                </MenuItem>
              ))}
            </Select>
            <Grid container spacing={2} justifyContent='space-between' sx={{ mt: 3 }}>
              <Grid>
                <Button
                  disabled={step === 0}
                  onClick={handleBack}
                  variant='outlined'
                  color='primary'
                >
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
          </Stack>
        </Box>
      </Paper>
    </React.Fragment>
  );
}

export default ShippingForm;
