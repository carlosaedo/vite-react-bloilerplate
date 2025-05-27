import { Grid, Typography, Divider, Paper, Box, Card, CardContent } from '@mui/material';
import { transform } from 'framer-motion';

function ReviewDetails({ formData }) {
  const renderSection = (title, data) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant='h6' sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
        {title}
      </Typography>
      <Card variant='outlined' sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {Object.entries(data).map(([key, value]) => (
            <Grid size={{ xs: 12, sm: 6 }} key={key}>
              <Typography variant='caption' color='text.secondary'>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </Typography>
              <Typography variant='body1' sx={{ fontWeight: 500 }}>
                {value || '-'}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );

  return (
    <Grid size={{ xs: 12 }}>
      <Typography variant='h5' gutterBottom>
        Review your details
      </Typography>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
        {renderSection('Sender Information', {
          senderName: formData.senderName,
          senderEmail: formData.senderEmail,
          senderPhone: formData.senderPhone,
          senderStreet: formData.senderStreet,
          senderCity: formData.senderCity,
          senderState: formData.senderState,
          senderZip: formData.senderZip,
          senderCountry: formData.senderCountry,
        })}

        <Divider sx={{ my: 3 }} />

        {renderSection('Recipient Information', {
          recipientName: formData.recipientName,
          recipientEmail: formData.recipientEmail,
          recipientPhone: formData.recipientPhone,
          recipientStreet: formData.recipientStreet,
          recipientCity: formData.recipientCity,
          recipientState: formData.recipientState,
          recipientZip: formData.recipientZip,
          recipientCountry: formData.recipientCountry,
        })}

        <Divider sx={{ my: 3 }} />

        {renderSection('Shipping Details', {
          shippingPayment: formData.shippingPayment,
          shippingPaymentTo: formData.shippingPaymentTo,
          date: formData.date,
          hour: formData.hour,
          year: formData.year,
          waybillNumber: formData.waybillNumber,
          deliveryDate: formData.deliveryDate,
          shippingService: formData.shippingService,
          trackingNumber: formData.trackingNumber,
        })}

        <Divider sx={{ my: 3 }} />

        {formData.packages.map((pkg, index) => (
          <Box key={index} sx={{ mt: 4 }}>
            <Typography variant='h6' sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
              Package {index + 1}
            </Typography>
            <Card variant='outlined' sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {Object.entries(pkg).map(([key, value]) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={key}>
                    <Typography variant='caption' color='text.secondary'>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </Typography>
                    <Typography variant='body1' sx={{ fontWeight: 500 }}>
                      {key === 'packageLength' || key === 'packageWidth' || key === 'packageHeight'
                        ? value
                          ? value + ' cm'
                          : '- cm'
                        : key === 'packageWeight'
                        ? value
                          ? value + ' kg'
                          : '- kg'
                        : key === 'packageValue'
                        ? value
                          ? value + ' €'
                          : '- €'
                        : value || '-'}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Box>
        ))}
      </Paper>
    </Grid>
  );
}

export default ReviewDetails;
