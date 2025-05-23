import React, { useState, useEffect } from 'react';

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
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

import ShippingFormReviewDetails from './ShippingFormReviewDetails';

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
  const [step, setStep] = useState(0);

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

  console.log(formData);

  const handleStepChange = (event, newValue) => {
    setStep(newValue);
  };

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
    handleChangeFormType(true);
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        return (
          formData.senderName &&
          formData.senderEmail &&
          formData.senderPhone &&
          formData.senderStreet &&
          formData.senderCity &&
          formData.senderState &&
          formData.senderZip &&
          formData.senderCountry
        );
      case 1:
        return (
          formData.recipientName &&
          formData.recipientEmail &&
          formData.recipientPhone &&
          formData.recipientStreet &&
          formData.recipientCity &&
          formData.recipientState &&
          formData.recipientZip &&
          formData.recipientCountry
        );
      case 2:
        return (
          formData.packageWeight &&
          formData.packageLength &&
          formData.packageWidth &&
          formData.packageHeight &&
          formData.packageDescription &&
          formData.packageValue &&
          formData.shippingService
        );
      default:
        return true;
    }
  };

  const handleNext = () =>
    validateStep()
      ? setStep((prev) => Math.min(prev + 1, 3))
      : alert('Please fill all required fields on this step.');
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));
  const handleSubmit = () => alert('Submitted data:\n' + JSON.stringify(formData, null, 2));

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
              name='extNumber'
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
                value={formData.senderName}
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
                value={formData.senderEmail}
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
                value={formData.senderPhone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Street Address'
                name='senderStreet'
                value={formData.senderStreet}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='City'
                name='senderCity'
                value={formData.senderCity}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='State/Province'
                name='senderState'
                value={formData.senderState}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='ZIP/Postal Code'
                name='senderZip'
                value={formData.senderZip}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='Country'
                name='senderCountry'
                value={formData.senderCountry}
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
                value={formData.recipientName}
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
                value={formData.recipientEmail}
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
                value={formData.recipientPhone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Street Address'
                name='recipientStreet'
                value={formData.recipientStreet}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='City'
                name='recipientCity'
                value={formData.recipientCity}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='State/Province'
                name='recipientState'
                value={formData.recipientState}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='ZIP/Postal Code'
                name='recipientZip'
                value={formData.recipientZip}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label='Country'
                name='recipientCountry'
                value={formData.recipientCountry}
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
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'right',
                  mb: 2,
                }}
              >
                <Button
                  variant='outlined'
                  startIcon={<AddIcon />}
                  onClick={addPackage}
                  size='small'
                >
                  Add Package
                </Button>
              </Box>

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

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
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
                        onChange={(e) => handlePackageChange(index, 'packageWidth', e.target.value)}
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
                        onChange={(e) => handlePackageChange(index, 'packageValue', e.target.value)}
                        fullWidth
                        required
                        slotProps={{ htmlInput: { min: 0 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        select
                        label='Shipping Service'
                        name={`shippingService_${index}`}
                        value={pkg.shippingService}
                        onChange={(e) =>
                          handlePackageChange(index, 'shippingService', e.target.value)
                        }
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
                  </Grid>
                </Box>
              ))}
            </Box>
          </>
        )}

        {step === 3 && <ShippingFormReviewDetails formData={formData} />}
      </Grid>

      {/* Additional Info */}
      <Box sx={{ mb: 4, marginTop: 3 }}>
        <Typography variant='h6'>Payment Information</Typography>

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

      <Grid container spacing={2} justifyContent='space-between' sx={{ mt: 3 }}>
        <Grid>
          <Button disabled={step === 0} onClick={handleBack} variant='outlined' color='primary'>
            Back
          </Button>
        </Grid>
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
      <Button onClick={resetForm} variant='contained' color='primary'>
        Reset Form
      </Button>
    </Paper>
  );
}

export default ShippingForm;
