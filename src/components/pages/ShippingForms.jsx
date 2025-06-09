import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Stack,
  Grid,
  Divider,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import { FaRegUser, FaMapMarkerAlt, FaMoneyCheckAlt } from 'react-icons/fa';
import {
  MdOutlineLocalShipping,
  MdDateRange,
  MdOutlineEuro,
  MdShield,
  MdPayment,
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

// Mock data
const mockShippingForms = [
  {
    clientId: 'client001',
    trackingNumber: 'TRK-1001',
    shippingPayment: 'Pronto',
    shippingPaymentTo: 'Expeditor',
    deliveryDate: '2025-06-10',
    deliveryDateHour: '10:30',
    shipperReference: 'SHIP-001',
    consigneeReference: 'CON-001',
    shipperId: 's001',
    shipperName: 'John Shipper',
    shipperEmail: 'john@ship.com',
    shipperPhone: '123456789',
    shipperAdd1: '123 Main St',
    shipperAdd2: '',
    shipperCity: 'New York',
    shipperZip: '10001',
    shipperCountry: 'USA',
    shipperVAT: 'VAT123',
    consigneeId: 'c001',
    consigneeName: 'Alice Consignee',
    consigneeEmail: 'alice@con.com',
    consigneePhone: '987654321',
    consigneeAdd1: '456 Market Rd',
    consigneeAdd2: '',
    consigneeCity: 'Los Angeles',
    consigneeZip: '90001',
    consigneeCountry: 'USA',
    consigneeVAT: 'VAT456',
    valueOfGoods: 1200,
    insured: true,
    customs: 'Standard',
    shippingService: 'Express',
    shipperInstructions: 'Handle with care',
    consigneeInstructions: 'Deliver before noon',
  },
  {
    clientId: 'client001',
    trackingNumber: 'TRK-1001',
    shippingPayment: 'Pronto',
    shippingPaymentTo: 'Expeditor',
    deliveryDate: '2025-06-10',
    deliveryDateHour: '10:30',
    shipperReference: 'SHIP-001',
    consigneeReference: 'CON-001',
    shipperId: 's001',
    shipperName: 'John Shipper',
    shipperEmail: 'john@ship.com',
    shipperPhone: '123456789',
    shipperAdd1: '123 Main St',
    shipperAdd2: '',
    shipperCity: 'New York',
    shipperZip: '10001',
    shipperCountry: 'USA',
    shipperVAT: 'VAT123',
    consigneeId: 'c001',
    consigneeName: 'Alice Consignee',
    consigneeEmail: 'alice@con.com',
    consigneePhone: '987654321',
    consigneeAdd1: '456 Market Rd',
    consigneeAdd2: '',
    consigneeCity: 'Los Angeles',
    consigneeZip: '90001',
    consigneeCountry: 'USA',
    consigneeVAT: 'VAT456',
    valueOfGoods: 1200,
    insured: true,
    customs: 'Standard',
    shippingService: 'Express',
    shipperInstructions: 'Handle with care',
    consigneeInstructions: 'Deliver before noon',
  },
  {
    clientId: 'client001',
    trackingNumber: 'TRK-1001',
    shippingPayment: 'Pronto',
    shippingPaymentTo: 'Expeditor',
    deliveryDate: '2025-06-10',
    deliveryDateHour: '10:30',
    shipperReference: 'SHIP-001',
    consigneeReference: 'CON-001',
    shipperId: 's001',
    shipperName: 'John Shipper',
    shipperEmail: 'john@ship.com',
    shipperPhone: '123456789',
    shipperAdd1: '123 Main St',
    shipperAdd2: '',
    shipperCity: 'New York',
    shipperZip: '10001',
    shipperCountry: 'USA',
    shipperVAT: 'VAT123',
    consigneeId: 'c001',
    consigneeName: 'Alice Consignee',
    consigneeEmail: 'alice@con.com',
    consigneePhone: '987654321',
    consigneeAdd1: '456 Market Rd',
    consigneeAdd2: '',
    consigneeCity: 'Los Angeles',
    consigneeZip: '90001',
    consigneeCountry: 'USA',
    consigneeVAT: 'VAT456',
    valueOfGoods: 1200,
    insured: true,
    customs: 'Standard',
    shippingService: 'Express',
    shipperInstructions: 'Handle with care',
    consigneeInstructions: 'Deliver before noon',
  },
  {
    clientId: 'client001',
    trackingNumber: 'TRK-1001',
    shippingPayment: 'Pronto',
    shippingPaymentTo: 'Expeditor',
    deliveryDate: '2025-06-10',
    deliveryDateHour: '10:30',
    shipperReference: 'SHIP-001',
    consigneeReference: 'CON-001',
    shipperId: 's001',
    shipperName: 'John Shipper',
    shipperEmail: 'john@ship.com',
    shipperPhone: '123456789',
    shipperAdd1: '123 Main St',
    shipperAdd2: '',
    shipperCity: 'New York',
    shipperZip: '10001',
    shipperCountry: 'USA',
    shipperVAT: 'VAT123',
    consigneeId: 'c001',
    consigneeName: 'Alice Consignee',
    consigneeEmail: 'alice@con.com',
    consigneePhone: '987654321',
    consigneeAdd1: '456 Market Rd',
    consigneeAdd2: '',
    consigneeCity: 'Los Angeles',
    consigneeZip: '90001',
    consigneeCountry: 'USA',
    consigneeVAT: 'VAT456',
    valueOfGoods: 1200,
    insured: true,
    customs: 'Standard',
    shippingService: 'Express',
    shipperInstructions: 'Handle with care',
    consigneeInstructions: 'Deliver before noon',
  },
  {
    clientId: 'client002',
    trackingNumber: 'TRK-1002',
    shippingPayment: 'Pronto',
    shippingPaymentTo: 'Expeditor',
    deliveryDate: '2025-06-11',
    deliveryDateHour: '14:00',
    shipperReference: 'SHIP-002',
    consigneeReference: 'CON-002',
    shipperId: 's002',
    shipperName: 'Sarah Sender',
    shipperEmail: 'sarah@send.com',
    shipperPhone: '555123456',
    shipperAdd1: '789 Oak Ave',
    shipperAdd2: '',
    shipperCity: 'Chicago',
    shipperZip: '60601',
    shipperCountry: 'USA',
    shipperVAT: 'VAT789',
    consigneeId: 'c002',
    consigneeName: 'Bob Receiver',
    consigneeEmail: 'bob@rec.com',
    consigneePhone: '321654987',
    consigneeAdd1: '321 Elm St',
    consigneeAdd2: '',
    consigneeCity: 'Houston',
    consigneeZip: '77001',
    consigneeCountry: 'USA',
    consigneeVAT: 'VAT987',
    valueOfGoods: 0,
    insured: false,
    customs: 'Priority',
    shippingService: 'Standard',
    shipperInstructions: '',
    consigneeInstructions: '',
  },
  // Add 2–3 more entries as needed...
];

const ShippingForms = () => {
  const { getToken } = useAuth();
  const token = getToken();
  const isTokenPresent = !!token;

  const [userInfo] = useState(() => {
    if (token) {
      return jwtDecode(token);
    }
    return {};
  });

  const handleClick = (form) => {
    console.log('Form clicked:', form);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant='h6'
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 3,
          color: '#003D2C',
          letterSpacing: '-0.025em',
        }}
      >
        Shipping Forms
      </Typography>

      <List sx={{ padding: 0 }}>
        {mockShippingForms.map((form, idx) => (
          <Paper
            elevation={0}
            sx={{
              mb: 1.5,
              borderRadius: 2,
              border: '1px solid #eaf4f0',
              backgroundColor: '#ffffff',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                borderColor: '#cbd5e1',
              },
            }}
            key={idx}
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleClick(form)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #fff7e0 0%, #eaf4f0 100%)',
                  },
                }}
              >
                <Box sx={{ width: '100%' }}>
                  {/* Single line layout */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 2,
                    }}
                  >
                    {/* Left section - Tracking & Service */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        minWidth: 0,
                        flex: '1 1 auto',
                      }}
                    >
                      <Typography
                        variant='h6'
                        fontWeight={600}
                        sx={{
                          color: '#003D2C',
                          fontSize: '1rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {form.trackingNumber}
                      </Typography>
                      <Chip
                        label={form.shippingService}
                        size='small'
                        sx={{
                          backgroundColor: '#003D2C',
                          color: '#ffffff',
                          fontWeight: 900,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>

                    {/* Center section - Shipper & Consignee */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        flex: '2 1 auto',
                        minWidth: 0,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                        <FaRegUser color='#ffc928' />
                        <Typography
                          variant='body2'
                          sx={{
                            color: 'rgb(65, 87, 81)',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {form.shipperName} ({form.shipperCity})
                        </Typography>
                      </Box>

                      <Box sx={{ color: '#003D2C', fontSize: '1rem', flexShrink: 0 }}>→</Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                        <FaRegUser color='#003D2C' />

                        <Typography
                          variant='body2'
                          sx={{
                            color: 'rgb(65, 87, 81)',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {form.consigneeName} ({form.consigneeCity})
                        </Typography>
                      </Box>
                    </Box>

                    {/* Right section - Date, Payment, Value */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flex: '1 1 auto',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MdDateRange style={{ color: 'rgb(65, 87, 81)', fontSize: '14px' }} />
                        <Typography
                          variant='body2'
                          sx={{
                            color: 'rgb(65, 87, 81)',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {form.deliveryDate}
                        </Typography>
                      </Box>

                      <Chip
                        label={`${form.shippingPayment} to ${form.shippingPaymentTo}`}
                        size='small'
                        sx={{
                          backgroundColor: '#ffc928',
                          color: '#003D2C',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          border: '1px solid #eaf4f0',
                        }}
                      />

                      {form.insured ? (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1,
                            py: 0.5,
                            backgroundColor: '#dcfce7',
                            borderRadius: 1,
                            border: '1px solid #bbf7d0',
                          }}
                        >
                          <MdShield style={{ color: '#16a34a', fontSize: '12px' }} />
                          <Typography
                            variant='caption'
                            sx={{
                              color: '#16a34a',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          >
                            €{form.valueOfGoods}
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1,
                            py: 0.5,
                            backgroundColor: '#fef2f2',
                            borderRadius: 1,
                            border: '1px solid #fecaca',
                          }}
                        >
                          <MdShield style={{ color: '#dc2626', fontSize: '12px' }} />
                          <Typography
                            variant='caption'
                            sx={{
                              color: '#dc2626',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          >
                            Not Insured
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </ListItemButton>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default ShippingForms;
