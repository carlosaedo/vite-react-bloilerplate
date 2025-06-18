import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Grid,
  Chip,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Link as MuiLink,
  Button,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  LocalShipping,
  Person,
  Business,
  Inventory,
  Security,
  Info,
  Phone,
  Email,
  LocationOn,
  Assessment,
  Warning,
  CheckCircle,
  Cancel,
  Money,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import * as stringUtils from '../../utils/stringOperations.js';

import { useAuth } from '../context/AuthContext';
import torrestirApi from '../api/torrestirApi';

import { FaTemperatureLow as Temperature } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { RxDimensions } from 'react-icons/rx';
import { AiOutlineBarcode } from 'react-icons/ai';

import { LiaShippingFastSolid, LiaFileSignatureSolid } from 'react-icons/lia';

import Base64Img from '../base64Img/Base64Img';

const ShippingFormDetails = ({ form, openDialog = true, onCloseDialog }) => {
  const navigateTo = useNavigate();

  const [formData, setFormData] = useState(form);

  const [showSSCC, setShowSSCC] = useState({});

  const toggleSSCC = (index) => {
    setShowSSCC((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    console.log(showSSCC);
  };

  // Only update if form actually changed
  useEffect(() => {
    if (form) {
      setFormData(form);
    }
  }, [form]);

  useEffect(() => {
    const fetchLabels = async () => {
      if (!formData?.packages?.length) return;

      try {
        const updatedPackages = await Promise.all(
          formData.packages.map(async (pkg) => {
            const updatedSsccs = pkg?.ssccs?.length
              ? await Promise.all(
                  pkg.ssccs.map(async (sscc) => {
                    try {
                      const [pngResponse, zplResponse] = await Promise.all([
                        torrestirApi.post('/api/BookingLabel/generate', {
                          ClientId: formData?.clientId,
                          TrackingId: formData?.trackingNumber,
                          Sscc: sscc?.sscc,
                          Format: 'png',
                        }),
                        torrestirApi.post('/api/BookingLabel/generate', {
                          ClientId: formData?.clientId,
                          TrackingId: formData?.trackingNumber,
                          Sscc: sscc?.sscc,
                          Format: 'zpl',
                        }),
                      ]);

                      return {
                        ...sscc,
                        labelImg: pngResponse?.data?.pngBase64,
                        labelZpl: zplResponse?.data?.zpl,
                      };
                    } catch (error) {
                      console.error(`Failed to fetch label for ${sscc.sscc}`, error);
                      return { ...sscc, labelImg: null, labelZpl: null };
                    }
                  }),
                )
              : [];

            return {
              ...pkg,
              ssccs: updatedSsccs,
            };
          }),
        );

        console.log('Updated packages:', updatedPackages);

        setFormData((prev) => ({
          ...prev,
          packages: updatedPackages,
        }));
      } catch (error) {
        console.error('Error fetching package labels:', error);
      }
    };

    fetchLabels();
  }, [formData?.clientId, formData?.trackingNumber]); // Only depend on the unique identifiers

  const primaryColor = '#003D2C';
  const secondaryColor = '#ffc928';
  const primaryLight = '#1B5E4F';
  const primaryDark = '#001A14';
  const secondaryLight = '#FFE082';
  const secondaryDark = '#FF8F00';

  const handleEdit = () => {
    const formDataToEditFormPayload = (form) => {
      return {
        clientId: form.clientId,
        trackingRef: form.trackingNumber,
        shippingPayment: form.shippingPayment,
        shippingPaymentTo: form.shippingPaymentTo,
        deliveryDate: form.deliveryDate,
        hour: form.deliveryDateHour,
        shipperRef: form.shipperReference,
        consigneeRef: form.consigneeReference,

        senderId: form.shipperId,
        senderName: form.shipperName,
        senderEmail: form.shipperEmail,
        senderPhone: form.shipperPhone,
        senderStreet: form.shipperStreet,
        senderStreet2: form.shipperSAdd2,
        senderCity: form.shipperCity,
        senderZip: form.shipperZip,
        senderCountry: form.shipperCountry,
        senderVAT: form.shipperTaxId,

        recipientId: form.consigneeId,
        recipientName: form.consigneeName,
        recipientEmail: form.consigneeEmail,
        recipientPhone: form.consigneePhone,
        recipientStreet: form.consigneeAdd,
        recipientStreet2: form.consigneeAdd2,
        recipientCity: form.consigneeCity,
        recipientZip: form.consigneeZip,
        recipientCountry: form.consigneeCountry,
        recipientVAT: form.consigneeTaxId,

        packages: form.packages.map((pkg) => ({
          packageQuantity: pkg.packageQuantity,
          packageWeight: pkg.packageWeight,
          packageLength: pkg.packageLength,
          packageWidth: pkg.packageWidth,
          packageHeight: pkg.packageHeight,
          packageNote: pkg.packageNote,
          packageType: pkg.packageType,
          sscc: pkg.sscc,
          CBM: pkg.cbm,
          LDM: pkg.ldm,
          TaxableWeight: pkg.taxableWeight,
          stackable: pkg.stackable,
          dangerousGoods: pkg.dangerousGoods,
          marksAndNumbers: pkg.marksAndNumbers,
          typeOfGoods: pkg.typeOfGoods,
          tempControlled: pkg.tempControlled,
          tempControlledMinTemp: pkg.tempControlledMinTemp,
          tempControlledMaxTemp: pkg.tempControlledMaxTemp,
        })),

        valueOfGoods: form.valueOfGoods,
        insured: form.insured,
        customs: form.customs,
        shippingService: form.shippingService,
        shipperInstructions: form.shipperInstructions,
        consigneeInstructions: form.consigneeInstructions,
      };
    };
    navigateTo('/edit-shipping-form', { state: { form: formDataToEditFormPayload(form) } });
  };

  if (!form) return null;

  return (
    <Dialog
      open={openDialog}
      onClose={onCloseDialog}
      maxWidth='xl'
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'visible' } } }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Your entire <Card> JSX goes here */}
        <Card
          variant='outlined'
          sx={{
            borderRadius: 3,
            p: 0,
            bgcolor: 'background.paper',
            boxShadow: '0 4px 16px rgba(0,61,44,0.08)',
            border: `1px solid ${primaryColor}20`,
            overflow: 'hidden',
            position: 'relative',
            margin: 0,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s ease-in-out infinite',
            },
            '@keyframes shimmer': {
              '0%': { backgroundPosition: '-200% 0' },
              '100%': { backgroundPosition: '200% 0' },
            },
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Stack spacing={2.5}>
              {/* Compact Tracking Header */}
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryLight} 100%)`,
                  borderRadius: 2,
                  p: 2,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Stack direction='row' alignItems='center' spacing={2}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                    <LocalShipping sx={{ fontSize: 20 }} />
                  </Avatar>
                  {formData.canEdit && (
                    <Button
                      sx={{
                        background: '#ffc928',
                        color: '#003D2C',
                        '&:hover': { background: '#ffffff', color: '#003D2C' },
                      }}
                      onClick={handleEdit}
                    >
                      Edit Form
                    </Button>
                  )}

                  <Box sx={{ flex: 1 }}>
                    <Typography variant='h6' fontWeight='bold'>
                      {formData.trackingNumber}
                    </Typography>
                    <Typography variant='caption' sx={{ opacity: 0.9 }}>
                      Tracking Number
                    </Typography>
                  </Box>
                  <Tooltip title='Track shipment'>
                    <IconButton
                      size='small'
                      sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
                    >
                      <Info fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              {/* Compact Shipment Info */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: `${primaryColor}08`,
                      border: `1px solid ${primaryColor}20`,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        background: primaryColor,
                      },
                    }}
                  >
                    <Stack direction='row' alignItems='center' spacing={1.5}>
                      <Avatar sx={{ bgcolor: primaryColor, width: 32, height: 32 }}>
                        <Assessment sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography variant='body2' color={primaryColor} fontWeight='600'>
                          Delivery
                        </Typography>
                        <Typography variant='body2' fontWeight='bold'>
                          {formData.deliveryDate} at {formData.deliveryDateHour}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: `${secondaryColor}08`,
                      border: `1px solid ${secondaryColor}40`,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        background: secondaryColor,
                      },
                    }}
                  >
                    <Stack direction='row' alignItems='center' spacing={1.5}>
                      <Avatar sx={{ bgcolor: secondaryColor, width: 32, height: 32 }}>
                        <Money sx={{ fontSize: 16, color: primaryColor }} />
                      </Avatar>
                      <Box>
                        <Typography variant='body2' color={secondaryDark} fontWeight='600'>
                          Payment
                        </Typography>
                        <Typography variant='body2' fontWeight='bold'>
                          {formData.shippingPayment} → {formData.shippingPaymentTo}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ borderStyle: 'dashed', borderColor: `${primaryColor}20` }} />

              {/* Compact Shipper & Consignee */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: `${secondaryColor}06`,
                      border: `1px solid ${secondaryColor}30`,
                      height: '100%',
                    }}
                  >
                    <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 1.5 }}>
                      <Avatar sx={{ bgcolor: secondaryColor, width: 32, height: 32 }}>
                        <Business sx={{ fontSize: 16, color: primaryColor }} />
                      </Avatar>
                      <Typography variant='subtitle2' fontWeight='bold' color={secondaryDark}>
                        Shipper
                      </Typography>
                    </Stack>
                    <Stack spacing={1}>
                      <Typography variant='body2' fontWeight='600'>
                        {formData.shipperName}
                      </Typography>
                      <Stack direction='row' alignItems='center' spacing={1}>
                        <Email sx={{ fontSize: 12, color: 'text.secondary' }} />
                        <Typography variant='caption'>{formData.shipperEmail}</Typography>
                        <Phone sx={{ fontSize: 12, color: 'text.secondary', ml: 1 }} />
                        <Typography variant='caption'>{formData.shipperPhone}</Typography>
                      </Stack>
                      <Typography variant='caption' color='text.secondary'>
                        {formData.shipperAdd1}
                        {formData.shipperAdd2 ? `, ${formData.shipperAdd2}` : ''},{' '}
                        {formData.shipperCity}, {formData.shipperZip}, {formData.shipperCountry}
                      </Typography>
                      <Typography
                        variant='caption'
                        color={secondaryDark}
                        sx={{ bgcolor: `${secondaryColor}15`, p: 0.5, borderRadius: 1 }}
                      >
                        VAT: {formData.shipperVAT} • REF: {formData.shipperReference}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: `${primaryColor}06`,
                      border: `1px solid ${primaryColor}30`,
                      height: '100%',
                    }}
                  >
                    <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 1.5 }}>
                      <Avatar sx={{ bgcolor: primaryColor, width: 32, height: 32 }}>
                        <Person sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Typography variant='subtitle2' fontWeight='bold' color={primaryColor}>
                        Consignee
                      </Typography>
                    </Stack>
                    <Stack spacing={1}>
                      <Typography variant='body2' fontWeight='600'>
                        {formData.consigneeName}
                      </Typography>
                      <Stack direction='row' alignItems='center' spacing={1}>
                        <Email sx={{ fontSize: 12, color: 'text.secondary' }} />
                        <Typography variant='caption'>{formData.consigneeEmail}</Typography>
                        <Phone sx={{ fontSize: 12, color: 'text.secondary', ml: 1 }} />
                        <Typography variant='caption'>{formData.consigneePhone}</Typography>
                      </Stack>
                      <Typography variant='caption' color='text.secondary'>
                        {formData.consigneeAdd1}
                        {formData.consigneeAdd2 ? `, ${formData.consigneeAdd2}` : ''},{' '}
                        {formData.consigneeCity}, {formData.consigneeZip},{' '}
                        {formData.consigneeCountry}
                      </Typography>
                      <Typography
                        variant='caption'
                        color={primaryColor}
                        sx={{ bgcolor: `${primaryColor}15`, p: 0.5, borderRadius: 1 }}
                      >
                        VAT: {formData.consigneeVAT} • REF: {formData.consigneeReference}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              {/* Compact Value, Insurance, Customs */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: `${primaryColor}08`,
                      border: `1px solid ${primaryColor}20`,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant='h6' fontWeight='bold' color={primaryColor}>
                      {formData.valueOfGoods}€
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Value of Goods
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: formData.insured ? `${primaryColor}08` : `${secondaryColor}08`,
                      border: formData.insured
                        ? `1px solid ${primaryColor}20`
                        : `1px solid ${secondaryColor}40`,
                      textAlign: 'center',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: formData.insured ? primaryColor : secondaryColor,
                        width: 32,
                        height: 32,
                        mx: 'auto',
                        mb: 1,
                      }}
                    >
                      {formData.insured ? (
                        <CheckCircle sx={{ fontSize: 16 }} />
                      ) : (
                        <Cancel sx={{ fontSize: 16, color: primaryColor }} />
                      )}
                    </Avatar>
                    <Typography
                      variant='body2'
                      fontWeight='bold'
                      color={formData.insured ? primaryColor : secondaryDark}
                    >
                      {formData.insured ? 'Insured' : 'Not Insured'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: `${secondaryColor}08`,
                      border: `1px solid ${secondaryColor}40`,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant='body2' fontWeight='bold' color={secondaryDark}>
                      {formData.customs}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Customs
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: `${primaryColor}06`,
                      border: `1px solid ${primaryColor}30`,
                    }}
                  >
                    <Typography
                      variant='body2'
                      fontWeight='600'
                      color={primaryColor}
                      sx={{ mb: 1 }}
                    >
                      <Temperature />
                      Transport temperature
                    </Typography>
                    <Typography variant='caption' display='block' sx={{ mt: 0.5 }}>
                      {formData.tempControlled
                        ? `${formData.tempControlledMinTemp}°C to ${formData.tempControlledMaxTemp}°C`
                        : 'No temp control'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Compact Instructions */}
              <Grid container spacing={2}>
                <Grid item size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: `${secondaryColor}06`,
                      border: `1px solid ${secondaryColor}30`,
                    }}
                  >
                    <Typography
                      variant='body2'
                      fontWeight='600'
                      color={secondaryDark}
                      sx={{ mb: 1 }}
                    >
                      <LiaShippingFastSolid /> Shipper Instructions
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {formData.shipperInstructions || 'No instructions'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: `${primaryColor}06`,
                      border: `1px solid ${primaryColor}30`,
                    }}
                  >
                    <Typography
                      variant='body2'
                      fontWeight='600'
                      color={primaryColor}
                      sx={{ mb: 1 }}
                    >
                      <LiaFileSignatureSolid /> Consignee Instructions
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {formData.consigneeInstructions || 'No instructions'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ borderStyle: 'dashed', borderColor: `${primaryColor}20` }} />

              {/* Compact Packages */}
              {formData.packages?.length ? (
                <Box>
                  <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: primaryColor, width: 32, height: 32 }}>
                      <Inventory sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant='subtitle1' fontWeight='bold'>
                      Packages ({formData.packages.length})
                    </Typography>
                  </Stack>
                  <Stack spacing={2}>
                    {formData.packages.map((pkg, index) => (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'rgba(248,249,250,0.8)',
                          border: `1px solid ${primaryColor}20`,
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                          },
                        }}
                      >
                        <Grid container spacing={2} alignItems='center'>
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Stack direction='row' alignItems='center' spacing={1}>
                              <Avatar sx={{ bgcolor: primaryColor, width: 28, height: 28 }}>
                                <Typography variant='caption' fontWeight='bold'>
                                  #{index + 1}
                                </Typography>
                              </Avatar>
                              <Box>
                                <Typography variant='body2' fontWeight='bold' color={primaryColor}>
                                  {pkg.packageType.toUpperCase()}
                                </Typography>
                                {!!pkg?.ssccs?.length && (
                                  <Grid>
                                    <Button
                                      variant='outlined'
                                      sx={{ height: '25px', fontSize: '12px' }}
                                      onClick={() => toggleSSCC(index)}
                                    >
                                      {showSSCC[index] ? '- SSCCs' : '+ SSCCs'}
                                    </Button>
                                  </Grid>
                                )}
                              </Box>
                            </Stack>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6, md: 2, ld: 2 }}>
                            <Box sx={{ bgcolor: `${primaryColor}05`, borderRadius: 1, p: 1 }}>
                              <Typography variant='caption' color={primaryColor} fontWeight='600'>
                                <RxDimensions /> Dimensions
                              </Typography>
                              <Typography variant='caption' display='block'>
                                {pkg.packageWeight}kg • {pkg.packageLength}×{pkg.packageWidth}×
                                {pkg.packageHeight}cm
                              </Typography>
                              <Typography variant='caption' display='block'>
                                CBM: {pkg.cbm} • Tax: {pkg.TaxableWeight}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6, md: 2, ld: 2 }}>
                            <Box sx={{ bgcolor: `${secondaryColor}05`, borderRadius: 1, p: 1 }}>
                              <Typography variant='caption' color={secondaryDark} fontWeight='600'>
                                Properties
                              </Typography>
                              <Stack direction='row' spacing={0.5} sx={{ mt: 0.5 }}>
                                <Chip
                                  label={pkg.stackable ? 'Stack' : 'No Stack'}
                                  color={pkg.stackable ? 'success' : 'default'}
                                  size='small'
                                  sx={{ fontSize: '10px', height: '20px' }}
                                />
                                <Chip
                                  label={pkg.dangerousGoods ? 'Danger' : 'Safe'}
                                  color={pkg.dangerousGoods ? 'error' : 'success'}
                                  size='small'
                                  sx={{ fontSize: '10px', height: '20px' }}
                                />
                              </Stack>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Box>
                              <Typography variant='caption' color='text.secondary'>
                                <strong>Marks:</strong> {pkg.marksAndNumbers}
                              </Typography>
                              <Typography variant='caption' color='text.secondary' display='block'>
                                <strong>Goods:</strong>{' '}
                                {stringUtils.toSpacedCapitalized(pkg.typeOfGoods)}
                              </Typography>
                              <Typography
                                variant='caption'
                                color='text.secondary'
                                display='block'
                                sx={{ fontStyle: 'italic' }}
                              >
                                {pkg.packageNote}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        {/* SSCSS */}
                        {showSSCC[index] && pkg?.ssccs?.length > 0 && (
                          <Stack spacing={2} sx={{ mt: 2 }}>
                            <Box>
                              <Stack
                                direction='row'
                                alignItems='center'
                                spacing={1.5}
                                sx={{ mb: 2 }}
                              >
                                <Avatar sx={{ bgcolor: primaryColor, width: 32, height: 32 }}>
                                  <AiOutlineBarcode sx={{ fontSize: 16 }} />
                                </Avatar>
                                <Typography variant='subtitle1' fontWeight='bold'>
                                  SSCCs and Labels ({pkg.ssccs.length})
                                </Typography>
                              </Stack>
                              <Stack direction='row' spacing={2} flexWrap='wrap'>
                                {showSSCC[index] && pkg?.ssccs?.length > 0 && (
                                  <Stack direction='row' spacing={2} flexWrap='wrap' mt={2}>
                                    {pkg.ssccs.map((sscc, ssccIndex) => (
                                      <Stack
                                        key={sscc.id || ssccIndex}
                                        direction='column'
                                        spacing={1}
                                        alignItems='center'
                                      >
                                        <Typography variant='caption' fontWeight='medium'>
                                          #{sscc.sscc}
                                        </Typography>
                                        <Base64Img
                                          base64={sscc.labelImg}
                                          zpl={sscc.labelZpl}
                                          label={sscc.sscc}
                                        />
                                      </Stack>
                                    ))}
                                  </Stack>
                                )}
                              </Stack>
                            </Box>
                          </Stack>
                        )}{' '}
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(158, 158, 158, 0.05)',
                    border: '1px dashed rgba(158, 158, 158, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    <FiPackage /> No packages provided
                  </Typography>
                </Paper>
              )}
            </Stack>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingFormDetails;
