import React from 'react';
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
  LinearProgress,
  IconButton,
  Tooltip,
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
} from '@mui/icons-material';

export default function ShippingFormDetails({ form }) {
  if (!form) return null;

  const getStatusColor = (insured) => (insured ? 'success' : 'error');
  const getStatusIcon = (insured) => (insured ? <CheckCircle /> : <Cancel />);

  return (
    <Card
      variant='outlined'
      sx={{
        margin: 3,
        borderRadius: 4,
        p: 0,
        bgcolor: 'background.paper',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.06)',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #2196F3, #21CBF3, #2196F3)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite',
        },
        '@keyframes shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={4}>
          {/* Enhanced Tracking Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              borderRadius: 3,
              p: 3,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
              },
            }}
          >
            <Stack direction='row' alignItems='center' spacing={2}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                <LocalShipping sx={{ fontSize: 28 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant='h5' fontWeight='bold' sx={{ mb: 0.5 }}>
                  {form.trackingNumber}
                </Typography>
                <Typography variant='body2' sx={{ opacity: 0.9 }}>
                  Shipment Tracking Number
                </Typography>
              </Box>
              <Tooltip title='Track shipment'>
                <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                  <Info />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Enhanced Shipment Info */}
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(76, 175, 80, 0.08)',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: '#4caf50',
                  },
                }}
              >
                <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 1 }}>
                  <Avatar sx={{ bgcolor: '#4caf50', width: 40, height: 40 }}>
                    <Assessment sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Typography variant='subtitle1' fontWeight='600' color='#2e7d32'>
                    Delivery Schedule
                  </Typography>
                </Stack>
                <Typography variant='h6' fontWeight='bold' sx={{ mb: 0.5 }}>
                  {form.deliveryDate}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  at {form.deliveryDateHour}
                </Typography>
              </Paper>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(156, 39, 176, 0.08)',
                  border: '1px solid rgba(156, 39, 176, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: '#9c27b0',
                  },
                }}
              >
                <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 1 }}>
                  <Avatar sx={{ bgcolor: '#9c27b0', width: 40, height: 40 }}>
                    <Security sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Typography variant='subtitle1' fontWeight='600' color='#7b1fa2'>
                    Payment Method
                  </Typography>
                </Stack>
                <Typography variant='h6' fontWeight='bold' sx={{ mb: 0.5 }}>
                  {form.shippingPayment}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  → {form.shippingPaymentTo}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2, borderStyle: 'dashed', borderColor: 'rgba(0,0,0,0.12)' }} />

          {/* Enhanced Shipper & Consignee */}
          <Grid container spacing={4}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 152, 0, 0.06)',
                  border: '1px solid rgba(255, 152, 0, 0.2)',
                  height: '100%',
                }}
              >
                <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#ff9800', width: 48, height: 48 }}>
                    <Business sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Typography variant='h6' fontWeight='bold' color='#f57c00'>
                    Shipper
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant='subtitle1' fontWeight='600' sx={{ mb: 0.5 }}>
                      {form.shipperName}
                    </Typography>
                    <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 1 }}>
                      <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant='body2' color='text.secondary'>
                        {form.shipperEmail}
                      </Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                      <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant='body2' color='text.secondary'>
                        {form.shipperPhone}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction='row' alignItems='flex-start' spacing={1}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mt: 0.5 }} />
                      <Typography variant='body2' color='text.secondary'>
                        {form.shipperAdd1}
                        {form.shipperAdd2 ? `, ${form.shipperAdd2}` : ''}
                        <br />
                        {form.shipperCity}, {form.shipperZip}, {form.shipperCountry}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 152, 0, 0.1)',
                      borderRadius: 2,
                      p: 2,
                      border: '1px solid rgba(255, 152, 0, 0.2)',
                    }}
                  >
                    <Typography variant='caption' color='#f57c00' fontWeight='600'>
                      VAT: {form.shipperVAT} • REF: {form.shipperReference}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(33, 150, 243, 0.06)',
                  border: '1px solid rgba(33, 150, 243, 0.2)',
                  height: '100%',
                }}
              >
                <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#2196f3', width: 48, height: 48 }}>
                    <Person sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Typography variant='h6' fontWeight='bold' color='#1976d2'>
                    Consignee
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant='subtitle1' fontWeight='600' sx={{ mb: 0.5 }}>
                      {form.consigneeName}
                    </Typography>
                    <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 1 }}>
                      <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant='body2' color='text.secondary'>
                        {form.consigneeEmail}
                      </Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                      <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant='body2' color='text.secondary'>
                        {form.consigneePhone}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction='row' alignItems='flex-start' spacing={1}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mt: 0.5 }} />
                      <Typography variant='body2' color='text.secondary'>
                        {form.consigneeAdd1}
                        {form.consigneeAdd2 ? `, ${form.consigneeAdd2}` : ''}
                        <br />
                        {form.consigneeCity}, {form.consigneeZip}, {form.consigneeCountry}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      borderRadius: 2,
                      p: 2,
                      border: '1px solid rgba(33, 150, 243, 0.2)',
                    }}
                  >
                    <Typography variant='caption' color='#1976d2' fontWeight='600'>
                      VAT: {form.consigneeVAT} • REF: {form.consigneeReference}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2, borderStyle: 'dashed', borderColor: 'rgba(0,0,0,0.12)' }} />

          {/* Enhanced Value, Insurance, Customs */}
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(76, 175, 80, 0.06)',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Typography variant='h4' fontWeight='bold' color='#2e7d32' sx={{ mb: 1 }}>
                  {form.valueOfGoods}€
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Value of Goods
                </Typography>
              </Paper>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: form.insured ? 'rgba(76, 175, 80, 0.06)' : 'rgba(244, 67, 54, 0.06)',
                  border: form.insured
                    ? '1px solid rgba(76, 175, 80, 0.2)'
                    : '1px solid rgba(244, 67, 54, 0.2)',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: form.insured ? '#4caf50' : '#f44336',
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {getStatusIcon(form.insured)}
                </Avatar>
                <Typography
                  variant='h6'
                  fontWeight='bold'
                  color={form.insured ? '#2e7d32' : '#c62828'}
                  sx={{ mb: 1 }}
                >
                  {form.insured ? 'Insured' : 'Not Insured'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Insurance Status
                </Typography>
              </Paper>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(156, 39, 176, 0.06)',
                  border: '1px solid rgba(156, 39, 176, 0.2)',
                  textAlign: 'center',
                }}
              >
                <Typography variant='h6' fontWeight='bold' color='#7b1fa2' sx={{ mb: 1 }}>
                  {form.customs}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Customs
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Enhanced Instructions */}
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 193, 7, 0.06)',
                  border: '1px solid rgba(255, 193, 7, 0.2)',
                  minHeight: 120,
                }}
              >
                <Typography variant='subtitle1' fontWeight='600' color='#f57c00' sx={{ mb: 2 }}>
                  📋 Shipper Instructions
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ fontStyle: 'italic' }}>
                  {form.shipperInstructions || 'No special instructions provided'}
                </Typography>
              </Paper>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(103, 58, 183, 0.06)',
                  border: '1px solid rgba(103, 58, 183, 0.2)',
                  minHeight: 120,
                }}
              >
                <Typography variant='subtitle1' fontWeight='600' color='#512da8' sx={{ mb: 2 }}>
                  📝 Consignee Instructions
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ fontStyle: 'italic' }}>
                  {form.consigneeInstructions || 'No special instructions provided'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2, borderStyle: 'dashed', borderColor: 'rgba(0,0,0,0.12)' }} />

          {/* Enhanced Packages */}
          {form.packages?.length ? (
            <Box>
              <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: '#673ab7', width: 48, height: 48 }}>
                  <Inventory sx={{ fontSize: 24 }} />
                </Avatar>
                <Box>
                  <Typography variant='h6' fontWeight='bold'>
                    Packages ({form.packages.length})
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Detailed package information
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={3}>
                {form.packages.map((pkg, index) => (
                  <Paper
                    key={pkg.sscc}
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      bgcolor: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                      border: '2px solid rgba(103, 58, 183, 0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: '0 8px 25px rgba(103, 58, 183, 0.15)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, #673ab7, #9c27b0)`,
                      },
                    }}
                  >
                    <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 3 }}>
                      <Avatar sx={{ bgcolor: '#673ab7', width: 56, height: 56 }}>
                        <Typography variant='h6' fontWeight='bold'>
                          #{index + 1}
                        </Typography>
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='h6' fontWeight='bold' color='#673ab7'>
                          {pkg.packageType.toUpperCase()}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ fontFamily: 'monospace' }}
                        >
                          SSCC: {pkg.sscc}
                        </Typography>
                      </Box>
                    </Stack>

                    <Grid container spacing={3}>
                      <Grid item size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                          <Box sx={{ bgcolor: 'rgba(103, 58, 183, 0.05)', borderRadius: 2, p: 2 }}>
                            <Typography
                              variant='subtitle2'
                              color='#673ab7'
                              fontWeight='600'
                              sx={{ mb: 1 }}
                            >
                              📏 Dimensions & Weight
                            </Typography>
                            <Typography variant='body2' sx={{ mb: 0.5 }}>
                              <strong>Weight:</strong> {pkg.packageWeight} kg
                            </Typography>
                            <Typography variant='body2' sx={{ mb: 0.5 }}>
                              <strong>Size:</strong> {pkg.packageLength}×{pkg.packageWidth}×
                              {pkg.packageHeight} cm
                            </Typography>
                            <Typography variant='body2' sx={{ mb: 0.5 }}>
                              <strong>CBM:</strong> {pkg.cbm}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Taxable Weight:</strong> {pkg.TaxableWeight}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                          <Box sx={{ bgcolor: 'rgba(103, 58, 183, 0.05)', borderRadius: 2, p: 2 }}>
                            <Typography
                              variant='subtitle2'
                              color='#673ab7'
                              fontWeight='600'
                              sx={{ mb: 1 }}
                            >
                              ⚙️ Package Properties
                            </Typography>
                            <Stack direction='row' spacing={1} sx={{ mb: 1 }}>
                              <Chip
                                label={pkg.stackable ? 'Stackable' : 'Not Stackable'}
                                color={pkg.stackable ? 'success' : 'default'}
                                size='small'
                                icon={pkg.stackable ? <CheckCircle /> : <Cancel />}
                              />
                            </Stack>
                            <Stack direction='row' spacing={1} sx={{ mb: 1 }}>
                              <Chip
                                label={pkg.dangerousGoods ? 'Dangerous' : 'Safe'}
                                color={pkg.dangerousGoods ? 'error' : 'success'}
                                size='small'
                                icon={pkg.dangerousGoods ? <Warning /> : <CheckCircle />}
                              />
                            </Stack>
                            <Typography variant='body2'>
                              <strong>Temperature:</strong>{' '}
                              {pkg.tempControlled
                                ? `${pkg.tempControlledMinTemp}°C to ${pkg.tempControlledMaxTemp}°C`
                                : 'No control needed'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                      <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                        <strong>Marks & Numbers:</strong> {pkg.marksAndNumbers}
                      </Typography>
                      <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                        <strong>Type of Goods:</strong> {pkg.typeOfGoods}
                      </Typography>
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ fontStyle: 'italic' }}
                      >
                        <strong>Note:</strong> {pkg.packageNote}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Box>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: 'rgba(158, 158, 158, 0.05)',
                border: '1px dashed rgba(158, 158, 158, 0.3)',
                textAlign: 'center',
              }}
            >
              <Typography variant='body1' color='text.secondary'>
                📦 No packages provided
              </Typography>
            </Paper>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
