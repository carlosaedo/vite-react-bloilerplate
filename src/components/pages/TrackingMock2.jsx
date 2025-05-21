import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useTranslation } from 'react-i18next';
import TrackingMap from '../trackingMap/TrackingMap';

// MUI Components
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Chip,
  Collapse,
  LinearProgress,
  Dialog,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';

// MUI Icons
import {
  CheckCircleOutline as CheckIcon,
  Inventory as InventoryIcon,
  LocalShipping as TruckIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Warning as WarningIcon,
  Map as MapIcon,
} from '@mui/icons-material';

const TTL = 10 * 60 * 1000; // 10 minutes in ms

const TrackingPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const stages = [
    { label: t('documented'), icon: <CheckIcon /> },
    { label: t('collected'), icon: <InventoryIcon /> },
    { label: t('inTransit'), icon: <TruckIcon /> },
    { label: t('inDeliver'), icon: <PersonIcon /> },
    { label: t('delivered'), icon: <HomeIcon /> },
  ];

  const stageException = { label: t('exception'), icon: <WarningIcon color='error' /> };

  const { trackingNumber } = useParams();
  const cacheKey = `trackingData-${trackingNumber}`;
  const timestampKey = `trackingTimestamp-${trackingNumber}`;

  const [data, setData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapCurrentLocal, setMapCurrentLocal] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(timestampKey);
    const now = Date.now();

    if (cachedData && cachedTime && now - parseInt(cachedTime, 10) < TTL) {
      console.log('Using cached data:', cachedData);
      setData(JSON.parse(cachedData));
      setLoading(false);
    } else {
      async function fetchTrackingInfo() {
        try {
          const response = await api.get(`/tracking/${trackingNumber}`);
          if (response) {
            console.log('Tracking data:', response.data.trackingData);
            setData(response.data.trackingData);
            localStorage.setItem(cacheKey, JSON.stringify(response.data.trackingData));
            localStorage.setItem(timestampKey, now.toString());
          }
        } catch (error) {
          console.error('Error fetching tracking data:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchTrackingInfo();
    }
  }, [trackingNumber]);

  if (loading) {
    return (
      <Container maxWidth='md' sx={{ my: 4 }}>
        <LinearProgress />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant='h6'>{t('loading')}</Typography>
        </Box>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth='md' sx={{ my: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant='h6' color='error'>
            {t('errorLoadingData')}
          </Typography>
        </Paper>
      </Container>
    );
  }

  const {
    currentStage,
    entity,
    entityRef,
    ourRef,
    estimated,
    from,
    to,
    packages,
    pallets,
    deliveryDetails,
    statusLog,
    hasException,
  } = data;

  // Inject "Exception" stage after the current stage if reported
  const getStagesWithException = (currentStage, hasException) => {
    if (!hasException) return stages;

    return [
      ...stages.slice(0, currentStage + 1),
      stageException,
      ...stages.slice(currentStage + 1),
    ];
  };

  const modifiedStages = getStagesWithException(currentStage, hasException);

  const handleMapClick = (lat, lng, local) => {
    setCoordinates({ lat, lng });
    setMapCurrentLocal(local);
    setShowMap(true);
  };

  // Calculate days in transit and determine color
  const daysInTransit = 15; // From your image, hardcoded. In real app, calculate this
  let statusColor = theme.palette.info.main;
  if (daysInTransit > 20) {
    statusColor = theme.palette.error.main;
  } else if (daysInTransit > 10) {
    statusColor = theme.palette.warning.main;
  }

  // Calculate progress percentage based on current stage
  const progressPercentage = ((currentStage + 1) / stages.length) * 100;

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={2}
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 2,
          borderLeft: `5px solid ${statusColor}`,
        }}
      >
        <Typography variant='h5' gutterBottom fontWeight='bold'>
          {t('yourPackageInTransit')} {daysInTransit} {t('days')}
        </Typography>
        <Typography variant='body1' color='text.secondary' gutterBottom>
          {t('expectedDelivery')} 1-5 {t('days')} ({t('basedOn')} 1000 {t('similarDeliveries')})
        </Typography>
        <LinearProgress
          variant='determinate'
          value={progressPercentage}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: alpha(theme.palette.primary.main, 0.2),
            '& .MuiLinearProgress-bar': {
              bgcolor: statusColor,
            },
          }}
        />
      </Paper>

      {/* Tracking Progress Stepper */}
      <Box sx={{ mb: 4 }}>
        {isMobile ? (
          <Stepper activeStep={currentStage} orientation='vertical'>
            {modifiedStages.map((stage, index) => {
              const isException = stage.label === t('exception');
              return (
                <Step key={index} completed={index <= currentStage}>
                  <StepLabel
                    StepIconProps={{
                      icon: stage.icon,
                      active: index === currentStage,
                      completed: index < currentStage,
                      error: isException,
                    }}
                  >
                    <Typography
                      variant='body2'
                      fontWeight={index === currentStage ? 'bold' : 'normal'}
                    >
                      {stage.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    {statusLog && statusLog[statusLog.length - index - 1] && (
                      <Typography variant='caption' color='text.secondary'>
                        {statusLog[statusLog.length - index - 1].date}
                      </Typography>
                    )}
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
        ) : (
          <Stepper activeStep={currentStage} alternativeLabel>
            {modifiedStages.map((stage, index) => {
              const isException = stage.label === t('exception');
              return (
                <Step key={index}>
                  <StepLabel
                    StepIconProps={{
                      icon: stage.icon,
                      active: index === currentStage,
                      completed: index < currentStage,
                      error: isException,
                    }}
                  >
                    {stage.label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        )}
      </Box>

      {/* Shipment Details Section */}
      <Card variant='outlined' sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            {t('shipmentDetails')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='body2' color='text.secondary'>
                {t('entity')}
              </Typography>
              <Typography variant='body1' fontWeight='medium'>
                {entity}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='body2' color='text.secondary'>
                {t('entityRef')}
              </Typography>
              <Typography variant='body1' fontWeight='medium'>
                {entityRef}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='body2' color='text.secondary'>
                {t('ourReference')}
              </Typography>
              <Typography variant='body1' fontWeight='medium'>
                {ourRef}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='body2' color='text.secondary'>
                {t('estimated')}
              </Typography>
              <Typography variant='body1' fontWeight='medium'>
                {estimated}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='body2' color='text.secondary'>
                {t('from')}
              </Typography>
              <Typography variant='body1' fontWeight='medium'>
                {from}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='body2' color='text.secondary'>
                {t('to')}
              </Typography>
              <Typography variant='body1' fontWeight='medium'>
                {to}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='body2' color='text.secondary'>
                {t('packages')}
              </Typography>
              <Typography variant='body1' fontWeight='medium'>
                {packages}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='body2' color='text.secondary'>
                {t('pallets')}
              </Typography>
              <Typography variant='body1' fontWeight='medium'>
                {pallets}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Delivery Details Toggle Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => setShowDetails(!showDetails)}
          endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            borderRadius: 4,
            px: 3,
            py: 1,
            borderWidth: 2,
          }}
        >
          {t('deliveryDetails')}
        </Button>
      </Box>

      {/* Delivery Details Content */}
      <Collapse in={showDetails}>
        <Box sx={{ mb: 4 }}>
          {/* Delivery Instructions */}
          {deliveryDetails && deliveryDetails.length > 0 && (
            <Paper variant='outlined' sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
              <List disablePadding>
                {deliveryDetails.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <ListItem>
                      <ListItemText primary={item} />
                    </ListItem>
                    {idx < deliveryDetails.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}

          {/* Status Log Table */}
          <TableContainer component={Paper} variant='outlined' sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: theme.palette.primary.main }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>{t('local')}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{t('date')}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{t('status')}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{t('location')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statusLog.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>
                      <Chip label={row.local} variant='outlined' size='small' color='primary' />
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      {row.location && (
                        <Button
                          variant='contained'
                          size='small'
                          color='primary'
                          startIcon={<MapIcon />}
                          onClick={() =>
                            handleMapClick(row.location.lat, row.location.lng, row.local)
                          }
                          sx={{ borderRadius: 2 }}
                        >
                          {t('map')}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Collapse>

      {/* Map Dialog */}
      <Dialog
        open={showMap}
        onClose={() => setShowMap(false)}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            height: '80vh',
          },
        }}
      >
        <DialogContent sx={{ p: 0, height: '100%' }}>
          <TrackingMap coordinates={coordinates} title={mapCurrentLocal} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant='contained'
            onClick={() => setShowMap(false)}
            sx={{ borderRadius: 4, px: 4 }}
          >
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TrackingPage;
