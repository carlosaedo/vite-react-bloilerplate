import React, { useState, useEffect } from 'react';

import api from '../api/api';
import torrestirApi from '../api/torrestirApi';
import { useShippingFormContext } from '../context/ShippingFormContext';
import * as stringUtils from '../../utils/stringOperations.js';
import {
  calculateShippingFormSizeValues,
  calculateShippingFormSizeValuesLDM,
} from '../../utils/calculateShippingFormSizeShippingForm';
import calculateShippingFormTotals from '../../utils/calculateShippingFormTotals.js';

import { sanitizeDecimalInput, sanitizeDecimalInputTemp } from '../../utils/sanitizeDecimalInput';
import { useAuth } from '../context/AuthContext';
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
  Autocomplete,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LiaWpforms } from 'react-icons/lia';
import { FaUserTie } from 'react-icons/fa';
import { BsInfoCircleFill } from 'react-icons/bs';
import { FaClone } from 'react-icons/fa';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit,
  EditOff,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from '@mui/icons-material';
import EntitySelector from '../entityComponent/EntitySelector';

const shippingServices = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'overnight', label: 'Overnight' },
];

const customsClearedByOptions = [
  { value: 'torresAduana', label: 'TorresAduana' },
  { value: 'client', label: 'Client' },
];

const insuredByOptions = [
  { value: 'torrestir', label: 'Torrestir' },
  { value: 'client', label: 'Client' },
];

const typeOfGoodsOptions = [{ value: 'general_goods', label: 'General Goods' }];

function generateMockSSCC() {
  let randomDigits = '';
  for (let i = 0; i < 16; i++) {
    randomDigits += Math.floor(Math.random() * 10);
  }
  return '00' + randomDigits;
}

const defaultPackageValues = {
  packageQuantity: '1',
  packageWeight: '',
  packageLength: '',
  packageWidth: '',
  packageHeight: '',
  packageNote: '',
  packageType: 'volume',
  sscc: generateMockSSCC(),
  CBM: '',
  LDM: '',
  TaxableWeight: '',
  stackable: false,
  dangerousGoods: false,
  marksAndNumbers: '',
  typeOfGoods: 'general_goods',
  tempControlled: false,
  tempControlledMinTemp: '',
  tempControlledMaxTemp: '',
};

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
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorClient, setErrorClient] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { token } = useAuth();
  const {
    shippingFormData,
    setShippingFormData,
    resetShippingFormData,
    trackingNumberShippingForm,
    retryFetchTrackingNumber,
    loadingShippingForm,
  } = useShippingFormContext();
  const [message, setMessage] = useState(null);

  const [compactShippingInfo, setCompactShippingInfo] = useState(true);

  //const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const packagesToShow = shippingFormData?.packages?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const [showSSCC, setShowSSCC] = useState(false);

  const [showDimensions, setShowDimensions] = useState(false);

  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);

  const [infoValues, setInfoValues] = useState(() => {
    const { totalQuantity, totalWeight, totalCBM, totalLDM, totalTaxableWeight, quantityByType } =
      calculateShippingFormTotals(shippingFormData.packages);
    return { totalQuantity, totalWeight, totalCBM, totalLDM, totalTaxableWeight, quantityByType };
  });

  const [shippingSenderRouting, setShippingSenderRouting] = useState({});
  const [shippingRecipientRouting, setShippingRecipientRouting] = useState({});

  const clientFromStorage = JSON.parse(localStorage.getItem('selectedClient')) || null;

  const handleJumpToPackage = (index) => {
    setErrorMessage(null);
    setMessage(null);
    setSelectedPackageIndex(index);
  };

  const handlePackageDuplication = (index) => {
    const packageToClone = shippingFormData.packages[index];
    const newPackage = {
      ...defaultPackageValues,
      ...packageToClone,
    };

    const updatedFormData = {
      ...shippingFormData,
      packages: [...shippingFormData.packages, newPackage],
    };

    setShippingFormData(updatedFormData);
    setSelectedPackageIndex(updatedFormData.packages.length - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const totalPackages = shippingFormData.packages.length;
      const maxPage = Math.ceil(totalPackages / rowsPerPage) - 1;

      // Ctrl + ArrowUp: Previous package (or wrap to last)
      if (e.ctrlKey && e.key === 'ArrowUp') {
        const newIndex = selectedPackageIndex > 0 ? selectedPackageIndex - 1 : totalPackages - 1;

        handleJumpToPackage(newIndex);
        setPage(Math.floor(newIndex / rowsPerPage));
      }

      // Ctrl + ArrowDown: Next package (or wrap to first)
      if (e.ctrlKey && e.key === 'ArrowDown') {
        const newIndex = selectedPackageIndex < totalPackages - 1 ? selectedPackageIndex + 1 : 0;

        handleJumpToPackage(newIndex);
        setPage(Math.floor(newIndex / rowsPerPage));
      }

      // Ctrl + ArrowRight: Next page (or wrap to first)
      if (e.ctrlKey && e.key === 'ArrowRight') {
        const newPage = page < maxPage ? page + 1 : 0;
        setPage(newPage);

        const newSelectedIndex = newPage * rowsPerPage;
        handleJumpToPackage(newSelectedIndex);
      }

      // Ctrl + ArrowLeft: Previous page (or wrap to last)
      if (e.ctrlKey && e.key === 'ArrowLeft') {
        const newPage = page > 0 ? page - 1 : maxPage;
        setPage(newPage);

        const newSelectedIndex = newPage * rowsPerPage;
        handleJumpToPackage(newSelectedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPackageIndex, shippingFormData, page]);

  useEffect(() => {
    const getShippingSenderRouting = async () => {
      try {
        if (
          shippingFormData?.deliveryDate &&
          shippingFormData?.senderZip &&
          shippingFormData?.senderCountry
        ) {
          console.log('Get sender routing');
          const response = await torrestirApi.get(
            `/Routing/zipcode-lookup?country=${shippingFormData?.senderCountry.toUpperCase()}&zipcode=${shippingFormData?.senderZip
              .replace(/-/g, '')
              .trim()}&type=Pickup&shippingDate=${shippingFormData?.deliveryDate}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (response?.data?.isSuccess) {
            setShippingSenderRouting(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching shipping sender routing:', error);
      }
    };

    const getShippingRecipientRouting = async () => {
      try {
        if (
          shippingFormData?.deliveryDate &&
          shippingFormData?.recipientZip &&
          shippingFormData?.recipientCountry
        ) {
          console.log(
            `/Routing/zipcode-lookup?country=${shippingFormData.recipientCountry.toUpperCase()}&zipcode=${shippingFormData.recipientZip
              .replace(/-/g, '')
              .trim()}&type=Delivery&shippingDate=${shippingFormData.deliveryDate}`,
          );
          const response = await torrestirApi.get(
            `/Routing/zipcode-lookup?country=${shippingFormData.recipientCountry.toUpperCase()}&zipcode=${shippingFormData.recipientZip
              .replace(/-/g, '')
              .trim()}&type=Delivery&shippingDate=${shippingFormData.deliveryDate}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (response?.data?.isSuccess) {
            setShippingRecipientRouting(response?.data);
          }
          console.log(response);
        }
      } catch (error) {
        console.error('Error fetching shipping sender routing:', error);
      }
    };
    getShippingSenderRouting();
    getShippingRecipientRouting();
  }, [
    shippingFormData?.senderZip,
    shippingFormData.recipientZip,
    shippingFormData.deliveryDate,
    shippingFormData?.senderCountry,
    shippingFormData.recipientCountry,
    token,
  ]);

  useEffect(() => {
    if (!loadingShippingForm && !clientFromStorage?.clientId) {
      setErrorClient('No client selected. Cannot show shipping form. Please select a client.');
    }
  }, [loadingShippingForm, clientFromStorage?.clientId]);

  const handleChange = (event) => {
    const { name, type, checked } = event.target;
    let value = event.target.value;

    if (['valueOfGoods'].includes(name) && value !== '') {
      value = sanitizeDecimalInput(value);
    }

    let updatedShippingFormData = { ...shippingFormData };

    if (name === 'insured' && checked === false) {
      updatedShippingFormData['valueOfGoods'] = '';
    }

    setMessage(null);
    setErrorMessage(null);
    setShippingFormData({
      ...updatedShippingFormData,
      //[event.target.name]: event.target.value,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePackageChange = (index, field, value) => {
    console.log('handlePackageChange triggered with', { index, field, value });

    if (
      ['packageWeight', 'packageHeight', 'packageWidth', 'packageLength', 'LDM', 'CBM'].includes(
        field,
      ) &&
      value !== ''
    ) {
      value = sanitizeDecimalInput(value);
    }

    if (['tempControlledMaxTemp', 'tempControlledMinTemp'].includes(field) && value !== '') {
      value = sanitizeDecimalInputTemp(value);
    }

    const newInputs = { ...shippingFormData.packages[index], [field]: value };

    if (field === 'CBM' && value !== '') {
      // Manual CBM entered → clear dimensions and LDM
      newInputs.packageLength = '';
      newInputs.packageWidth = '';
      newInputs.packageHeight = '';
      newInputs.LDM = '';
    }

    if (field === 'LDM' && value !== '') {
      // Manual LDM entered → clear dimensions and CBM
      newInputs.packageLength = '';
      newInputs.packageWidth = '';
      newInputs.packageHeight = '';
      newInputs.CBM = '';
      newInputs.stackable = false;
    }

    // If a dimension is entered → clear CBM and LDM
    if (['packageHeight', 'packageWidth', 'packageLength'].includes(field) && value !== '') {
      newInputs.CBM = '';
      newInputs.LDM = '';
    }

    if (field === 'tempControlled' && value === false) {
      newInputs.tempControlledMaxTemp = '';
      newInputs.tempControlledMinTemp = '';
    }

    setErrorMessage(null);
    setMessage(null);
    let newCalculationsForPackage = null;

    // Create the updated package object FIRST
    const currentPackage = shippingFormData.packages[index];
    const updatedPackage = {
      ...currentPackage,
      ...newInputs,
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
    } else if (updatedPackage.packageWeight && updatedPackage.LDM) {
      newCalculationsForPackage = calculateShippingFormSizeValuesLDM(
        {
          weightKg: parseFloat(updatedPackage.packageWeight) || 0,
          ldm: parseFloat(updatedPackage.LDM) || 0,
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

    const { totalQuantity, totalWeight, totalCBM, totalLDM, totalTaxableWeight, quantityByType } =
      calculateShippingFormTotals(updatedPackages);

    setInfoValues({
      totalQuantity,
      totalWeight,
      totalCBM,
      totalLDM,
      totalTaxableWeight,
      quantityByType,
    });

    setShippingFormData(updatedFormData);
  };

  const handleRecipientEntityChange = (object) => {
    if (object === null) {
      return;
    }
    setMessage(null);
    setErrorMessage(null);
    setShippingFormData({
      ...shippingFormData,
      recipientId: object.id,
      recipientName: object.Name,
      recipientStreet: object.Add1,
      recipientStreet2: object.Add2,
      recipientCity: object.city,
      recipientState: object.state,
      recipientZip: object.zip_code,
      recipientCountry: object.country,
      extNumber: object.external_ref,
      recipientTaxId: object.VAT,
    });
  };

  const handleSenderEntityChange = (object) => {
    if (object === null) {
      return;
    }
    setMessage(null);
    setErrorMessage(null);
    setShippingFormData({
      ...shippingFormData,
      senderId: object.id,
      senderName: object.Name,
      senderStreet: object.Add1,
      senderStreet2: object.Add2,
      senderCity: object.city,
      senderState: object.state,
      senderZip: object.zip_code,
      senderCountry: object.country,
      extNumber: object.external_ref,
      senderTaxId: object.VAT,
    });
  };

  const handleSenderEntityCreated = (object) => {
    if (!object) return;

    setMessage(null);
    setErrorMessage(null);
    setShippingFormData({
      ...shippingFormData,
      senderId: object.id,
      senderName: object.Name,
      senderStreet: object.Add1,
      senderStreet2: object.Add2,
      senderCity: object.city,
      senderState: object.state,
      senderZip: object.zip_code,
      senderCountry: object.country,
      extNumber: object.external_ref,
      senderTaxId: object.VAT,
    });
  };

  const handleRecipientEntityCreated = (object) => {
    if (!object) return;

    setMessage(null);
    setErrorMessage(null);
    setShippingFormData({
      ...shippingFormData,
      recipientId: object.id,
      recipientName: object.Name,
      recipientStreet: object.Add1,
      recipientStreet2: object.Add2,
      recipientCity: object.city,
      recipientState: object.state,
      recipientZip: object.zip_code,
      recipientCountry: object.country,
      extNumber: object.external_ref,
      recipientTaxId: object.VAT,
    });
  };

  const handlePackageClearDimensions = (index) => {
    console.log('clearing dimensions');
    setErrorMessage(null);
    setMessage(null);

    const updatedPackages = [...shippingFormData.packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      ['packageHeight']: '',
      ['packageLength']: '',
      ['packageWidth']: '',
      ['LDM']: '',
    };

    const updatedFormData = {
      ...shippingFormData,
      packages: updatedPackages,
    };

    setShippingFormData(updatedFormData);
  };

  const clearPackageDimensionsAndUnsetStackable = (index) => {
    console.log('clearing dimensions');
    setErrorMessage(null);
    setMessage(null);

    const updatedPackages = [...shippingFormData.packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      ['stackable']: false,
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
    const newPackage = defaultPackageValues;

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
    const emptyPackage = defaultPackageValues;
    const updatedFormData = {
      ...shippingFormData,
      packages: [emptyPackage],
    };

    const { totalQuantity, totalWeight, totalCBM, totalLDM, totalTaxableWeight, quantityByType } =
      calculateShippingFormTotals(updatedFormData.packages);

    setInfoValues({
      totalQuantity,
      totalWeight,
      totalCBM,
      totalLDM,
      totalTaxableWeight,
      quantityByType,
    });

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

      const { totalQuantity, totalWeight, totalCBM, totalLDM, totalTaxableWeight, quantityByType } =
        calculateShippingFormTotals(updatedPackages);

      setInfoValues({
        totalQuantity,
        totalWeight,
        totalCBM,
        totalLDM,
        totalTaxableWeight,
        quantityByType,
      });

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

    const formDataToBackendPayload = (formData) => {
      return {
        clientId: clientFromStorage?.clientId,
        trackingNumber: formData.trackingRef,
        shippingPayment: formData.shippingPayment,
        shippingPaymentTo: formData.shippingPaymentTo,
        deliveryDate: formData.date,
        deliveryDateHour: formData.hour,
        shipperReference: formData.shipperRef,
        consigneeReference: formData.consigneeRef,

        shipperId: formData.senderId,
        shipperName: formData.senderName,
        shipperEmail: formData.senderEmail,
        shipperPhone: formData.senderPhone,
        shipperAdd1: formData.senderStreet,
        shipperAdd2: formData.senderStreet2,
        shipperCity: formData.senderCity,
        shipperZip: formData.senderZip,
        shipperCountry: formData.senderCountry,
        shipperVAT: formData.senderTaxId,

        consigneeId: formData.recipientId,
        consigneeName: formData.recipientName,
        consigneeEmail: formData.recipientEmail,
        consigneePhone: formData.recipientPhone,
        consigneeAdd1: formData.recipientStreet,
        consigneeAdd2: formData.recipientStreet2,
        consigneeCity: formData.recipientCity,
        consigneeZip: formData.recipientZip,
        consigneeCountry: formData.recipientCountry,
        consigneeVAT: formData.recipientTaxId,

        packages: formData.packages.map((pkg) => ({
          packageQuantity: pkg.packageQuantity,
          packageWeight: pkg.packageWeight,
          packageLength: pkg.packageLength,
          packageWidth: pkg.packageWidth,
          packageHeight: pkg.packageHeight,
          packageNote: pkg.packageNote,
          packageType: pkg.packageType,
          sscc: pkg.sscc,
          cbm: pkg.CBM,
          ldm: pkg.LDM,
          taxableWeight: pkg.TaxableWeight,
          stackable: pkg.stackable,
          dangerousGoods: pkg.dangerousGoods,
          marksAndNumbers: pkg.marksAndNumbers,
          typeOfGoods: pkg.typeOfGoods,
          tempControlled: pkg.tempControlled,
          tempControlledMinTemp: pkg.tempControlledMinTemp,
          tempControlledMaxTemp: pkg.tempControlledMaxTemp,
        })),

        valueOfGoods: formData.valueOfGoods,
        insured: formData.insured,
        customs: formData.customs,
        shippingService: formData.shippingService,
        shipperInstructions: formData.shipperInstructions,
        consigneeInstructions: formData.consigneeInstructions,
      };
    };

    try {
      const payload = formDataToBackendPayload(shippingFormData);
      const response = await torrestirApi.post(`/api/bookings/external`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  if (loadingShippingForm) return <CircularProgress />;
  //
  //if (loading) return <CircularProgress sx={{ marginTop: 4 }} />;
  if (errorClient) return <Alert severity='error'>{errorClient}</Alert>;

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

      <Paper
        sx={{
          p: 2,
          width: '98%',
          margin: 'auto',
          mt: 5,
          color: '#003D2C',
          '& .MuiInputBase-root': {
            color: '#003D2C',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 1,
            px: 1,
          },
          '& .MuiInputLabel-root': {
            color: '#003D2C',
          },
          '& .MuiInputLabel-shrink': {
            color: '#003D2C',
          },
          '& .MuiCheckbox-root': {
            color: '#003D2C',
          },
          '& .MuiFormControlLabel-label': {
            color: '#003D2C',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffc928',
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffc928',
          },
          '& .MuiTableCell-root': {
            color: '#003D2C',
          },
          '& .MuiTypography-h6': {
            color: '#003D2C',
          },
          '& .MuiTablePagination-displayedRows': {
            color: '#003D2C ',
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 2, sm: 0 },
          }}
        >
          {/* Left side */}
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Typography
              variant='h5'
              sx={{
                fontWeight: 700,
                color: '#003e2d',
                display: 'flex',
                alignItems: 'baseline',
                flexWrap: 'wrap',
              }}
            >
              Shipping Form
              {shippingFormData.trackingRef ? (
                <Box
                  component='span'
                  sx={{
                    ml: 2,
                    mt: { xs: 1, sm: 0 },
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
                    mt: { xs: 1, sm: 0 },
                    fontStyle: 'italic',
                    color: 'text.secondary',
                    fontWeight: 400,
                  }}
                >
                  New Booking Information
                </Typography>
              )}
            </Typography>

            {/* Optional button (still commented out) */}
            {/*
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
    */}
          </Box>

          {/* Right side */}
          <Typography
            component='span'
            variant='subtitle1'
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
              alignSelf: { xs: 'flex-start', sm: 'center' },
              width: { xs: '100%', sm: 'auto' },
              gap: 1,
              color: 'text.secondary',
              fontWeight: 400,
            }}
          >
            <FaUserTie /> {clientFromStorage?.name}
          </Typography>
        </Box>

        {/* Guia*/}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h6'>Booking Information</Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
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
            <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
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
            <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
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

            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 3 }}>
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
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 3 }}>
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
        </Box>

        <Box display='flex' gap={4} flexWrap='wrap' sx={{ mb: 4 }}>
          {/* Sender Info */}
          <Box
            flex={1}
            minWidth={300}
            sx={{
              mb: 3,
              p: 2,
              border: '1px solid linear-gradient(135deg, #fff7e0 0%, #eaf4f0 100%)', // darker tone for structure
              borderRadius: 2,
              background: 'linear-gradient(135deg, #fff7e0 0%, #eaf4f0 100%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)', // soft shadow for depth
              color: '#003D2C',
              '& .MuiInputBase-root': {
                color: '#003D2C',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                px: 1,
              },
              '& .MuiInputLabel-root': {
                color: '#003D2C',
              },
              '& .MuiInputLabel-shrink': {
                color: '#003D2C',
              },
              '& .MuiCheckbox-root': {
                color: '#003D2C',
              },
              '& .MuiFormControlLabel-label': {
                color: '#003D2C',
              },
              '& .MuiSvgIcon-root': {
                color: '#003D2C',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ffc928',
              },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ffc928',
              },
            }}
          >
            {compactShippingInfo ? (
              <React.Fragment>
                <Typography variant='h6'>Shipper Information</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label='Name'
                      name='senderName'
                      value={shippingFormData.senderName || ''}
                      onChange={handleChange}
                      fullWidth
                      size='small'
                      margin='dense'
                      required
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      label='ZIP'
                      name='senderZip'
                      value={shippingFormData.senderZip || ''}
                      onChange={handleChange}
                      fullWidth
                      size='small'
                      margin='dense'
                      required
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography onClick={() => setCompactShippingInfo(false)}>
                      <ArrowDropDownIcon
                        sx={{
                          height: '48px',
                          width: '48px',
                          color: 'white',
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.2)',
                          },
                        }}
                      />
                    </Typography>
                  </Grid>
                </Grid>
                {shippingSenderRouting?.data !== null && (
                  <Grid container spacing={1} sx={{ ml: 2 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Agent Name' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingSenderRouting?.data?.agentName ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Route Name' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingSenderRouting?.data?.routeName ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Service Name' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingSenderRouting?.data?.serviceName ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Route' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingSenderRouting?.data?.routeAbbreviation2 ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                  </Grid>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography variant='h6'>Sender Information</Typography>
                <Typography onClick={() => setCompactShippingInfo(true)}>
                  <ArrowDropUpIcon
                    sx={{
                      height: '48px',
                      width: '48px',
                      color: 'white',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.2)',
                      },
                    }}
                  />
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <EntitySelector
                  selectedEntityName={shippingFormData.senderName}
                  handleEntityChange={handleSenderEntityChange}
                  onEntityCreated={(newEntityData) => {
                    handleSenderEntityCreated(newEntityData);
                  }}
                  isSender={true}
                />
                <TextField
                  label='Name'
                  name='senderName'
                  value={shippingFormData.senderName || ''}
                  onChange={handleChange}
                  fullWidth
                  size='small'
                  margin='dense'
                  required
                  disabled
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label='Email'
                      name='senderEmail'
                      type='email'
                      value={shippingFormData.senderEmail || ''}
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
                      value={shippingFormData.senderPhone || ''}
                      onChange={handleChange}
                      fullWidth
                      size='small'
                      margin='dense'
                      required
                    />
                  </Grid>
                </Grid>
                <TextField
                  label='Address'
                  name='senderStreet'
                  value={shippingFormData.senderStreet || ''}
                  onChange={handleChange}
                  fullWidth
                  size='small'
                  margin='dense'
                  required
                  disabled
                />
                <TextField
                  label='Address 2'
                  name='senderStreet2'
                  value={shippingFormData.senderStreet2 || ''}
                  onChange={handleChange}
                  fullWidth
                  size='small'
                  margin='dense'
                  disabled
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      label='City'
                      name='senderCity'
                      value={shippingFormData.senderCity || ''}
                      onChange={handleChange}
                      fullWidth
                      size='small'
                      margin='dense'
                      required
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      label='State'
                      name='senderState'
                      value={shippingFormData.senderState || ''}
                      onChange={handleChange}
                      fullWidth
                      size='small'
                      margin='dense'
                      required
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      label='ZIP'
                      name='senderZip'
                      value={shippingFormData.senderZip || ''}
                      onChange={handleChange}
                      fullWidth
                      size='small'
                      margin='dense'
                      required
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      label='Country'
                      name='senderCountry'
                      value={shippingFormData.senderCountry || ''}
                      onChange={handleChange}
                      fullWidth
                      size='small'
                      margin='dense'
                      required
                      disabled
                    />
                  </Grid>
                </Grid>
                {shippingSenderRouting?.data !== null && (
                  <Grid container spacing={1} sx={{ ml: 2 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Agent Name' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingSenderRouting?.data?.agentName ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Route Name' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingSenderRouting?.data?.routeName ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Service Name' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingSenderRouting?.data?.serviceName ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Route' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingSenderRouting?.data?.routeAbbreviation2 ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                  </Grid>
                )}
              </React.Fragment>
            )}
          </Box>

          {/* Recipient Info */}
          <Box
            flex={1}
            minWidth={300}
            sx={{
              mb: 3,
              p: 2,
              border: '1px solid linear-gradient(135deg, #eaf4f0 0%, #fff7e0 100%)', // darker tone for structure
              borderRadius: 2,
              background: 'linear-gradient(135deg, #eaf4f0 0%, #fff7e0 100%)',

              boxShadow: '0 4px 12px rgba(0,0,0,0.3)', // soft shadow for depth
              color: '#003D2C',
              '& .MuiInputBase-root': {
                color: '#003D2C',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                px: 1,
              },
              '& .MuiInputLabel-root': {
                color: '#003D2C',
              },
              '& .MuiInputLabel-shrink': {
                color: '#003D2C',
              },
              '& .MuiCheckbox-root': {
                color: '#003D2C',
              },
              '& .MuiFormControlLabel-label': {
                color: '#003D2C',
              },
              '& .MuiSvgIcon-root': {
                color: '#003D2C',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ffc928',
              },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ffc928',
              },
            }}
          >
            {compactShippingInfo ? (
              <React.Fragment>
                <Typography variant='h6'>Consignee Information</Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label='Name'
                      name='recipientName'
                      value={shippingFormData.recipientName || ''}
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
                      value={shippingFormData.recipientZip || ''}
                      onChange={handleChange}
                      fullWidth
                      size='small'
                      margin='dense'
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography onClick={() => setCompactShippingInfo(false)}>
                      <ArrowDropDownIcon
                        sx={{
                          height: '48px',
                          width: '48px',
                          color: 'white',
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.2)',
                          },
                        }}
                      />
                    </Typography>
                  </Grid>
                </Grid>
                {shippingRecipientRouting?.data !== null && (
                  <Grid container spacing={1} sx={{ ml: 2 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Agent Name' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingRecipientRouting?.data?.agentName ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Route Name' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingRecipientRouting?.data?.routeName ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Service Name' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingRecipientRouting?.data?.serviceName ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Route' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingRecipientRouting?.data?.routeAbbreviation2 ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                  </Grid>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography variant='h6'>Recipient Information</Typography>
                <Typography onClick={() => setCompactShippingInfo(true)}>
                  <ArrowDropUpIcon
                    sx={{
                      height: '48px',
                      width: '48px',
                      color: 'white',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.2)',
                      },
                    }}
                  />
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <EntitySelector
                  selectedEntityName={shippingFormData.recipientName}
                  handleEntityChange={handleRecipientEntityChange}
                  onEntityCreated={(newEntityData) => {
                    handleRecipientEntityCreated(newEntityData);
                  }}
                  isRecipient={true}
                />
                <TextField
                  label='Name'
                  name='recipientName'
                  value={shippingFormData.recipientName || ''}
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
                      value={shippingFormData.recipientEmail || ''}
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
                      value={shippingFormData.recipientPhone || ''}
                      onChange={handleChange}
                      fullWidth
                      size='small'
                      margin='dense'
                      required
                    />
                  </Grid>
                </Grid>
                <TextField
                  label='Address'
                  name='recipientStreet'
                  value={shippingFormData.recipientStreet || ''}
                  onChange={handleChange}
                  fullWidth
                  size='small'
                  margin='dense'
                  required
                />
                <TextField
                  label='Address 2'
                  name='recipientStreet2'
                  value={shippingFormData.recipientStreet2 || ''}
                  onChange={handleChange}
                  fullWidth
                  size='small'
                  margin='dense'
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      label='City'
                      name='recipientCity'
                      value={shippingFormData.recipientCity || ''}
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
                      value={shippingFormData.recipientState || ''}
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
                      value={shippingFormData.recipientZip || ''}
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
                      value={shippingFormData.recipientCountry || ''}
                      onChange={handleChange}
                      fullWidth
                      size='small'
                      margin='dense'
                      required
                    />
                  </Grid>
                </Grid>
                {shippingRecipientRouting?.data !== null && (
                  <Grid container spacing={1} sx={{ ml: 2 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Agent Name' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingRecipientRouting?.data?.agentName ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Route Name' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingRecipientRouting?.data?.routeName ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Service Name' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingRecipientRouting?.data?.serviceName ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, ld: 3 }}>
                      <Tooltip title='Route' placement='bottom' arrow>
                        <Typography
                          variant='body2'
                          sx={{
                            backgroundColor: 'white',
                            color: '#003D2C',
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {shippingRecipientRouting?.data?.routeAbbreviation2 ?? '—'}
                        </Typography>
                      </Tooltip>
                    </Grid>
                  </Grid>
                )}
              </React.Fragment>
            )}
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 6,
              lg: 6,
            }}
          >
            <TextField
              label='Shipper Instructions'
              name='shipperInstructions'
              type='text'
              value={shippingFormData.shipperInstructions}
              onChange={handleChange}
              fullWidth
              size='small'
              margin='dense'
              required
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 6,
              lg: 6,
            }}
          >
            <TextField
              label='Consignee Instructions'
              name='consigneeInstructions'
              type='text'
              value={shippingFormData.consigneeInstructions}
              onChange={handleChange}
              fullWidth
              size='small'
              margin='dense'
              required
            />
          </Grid>
        </Grid>
        {/* Additional Info */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h6'>Payment Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
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
            <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
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
            <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
              <TextField
                label='VAT Shipper'
                name='senderTaxId'
                type='text'
                value={shippingFormData.senderTaxId}
                onChange={handleChange}
                fullWidth
                size='small'
                margin='dense'
                required
                disabled
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
              <TextField
                label='VAT Consignee'
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
                      <strong>Quantity</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Weight (kg)</strong>
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
                      <strong>S</strong>
                    </TableCell>
                    <TableCell>
                      <strong>DG</strong>
                    </TableCell>
                    <TableCell>
                      <strong>TC</strong>
                    </TableCell>
                    <TableCell>
                      <strong>MIN / MAX</strong>
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
                              background:
                                selectedPackageIndex === globalIndex
                                  ? 'linear-gradient(135deg, #fff7e0 0%, #eaf4f0 100%)'
                                  : 'transparent',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #fff7e0 0%, #eaf4f0 100%)',
                              },
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
                              {pkg?.packageQuantity || '-'}
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
                              {pkg?.packageWeight || '-'}
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
                              <Tooltip title='Stackable' arrow>
                                {pkg?.stackable ? 'Yes' : 'No'}
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: showSSCC ? 'none !important' : undefined,
                              }}
                            >
                              <Tooltip title='Dangerous Goods' arrow>
                                {pkg?.dangerousGoods ? 'Yes' : 'No'}
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: showSSCC ? 'none !important' : undefined,
                              }}
                            >
                              <Tooltip title='Temperature Controlled' arrow>
                                {pkg?.tempControlled ? 'Yes' : 'No'}
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: showSSCC ? 'none !important' : undefined,
                              }}
                            >
                              {pkg?.tempControlled
                                ? pkg?.tempControlledMinTemp || pkg?.tempControlledMaxTemp
                                  ? `${
                                      pkg?.tempControlledMinTemp
                                        ? pkg.tempControlledMinTemp + 'ºC'
                                        : 'Not Set'
                                    } / ${
                                      pkg?.tempControlledMaxTemp
                                        ? pkg.tempControlledMaxTemp + 'ºC'
                                        : 'Not Set'
                                    }`
                                  : 'Not Set'
                                : 'Not Set'}
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
            <Grid
              container
              spacing={1}
              alignItems='center'
              justifyContent='flex-end'
              sx={{ mt: 2 }}
            >
              {/* Info Icon aligned to center */}
              <Grid>
                <Tooltip title='Navigate the table using the Ctrl + Arrow Up / Down and Ctrl + Arrow Left / Right'>
                  <BsInfoCircleFill style={{ verticalAlign: 'middle', fontSize: 20 }} />
                </Tooltip>
              </Grid>

              {/* Pagination aligned to right */}
              <Grid>
                <TablePagination
                  component='div'
                  count={shippingFormData?.packages?.length || 0}
                  page={page}
                  onPageChange={(event, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10]} // Hides rowsPerPage selector
                />
              </Grid>
            </Grid>
          </Paper>
          <Typography variant='h6'>Package Details</Typography>
          <Box
            sx={{
              mb: 3,
              p: 2,
              border: '1px solid linear-gradient(135deg, #fff7e0 0%, #eaf4f0 100%)', // darker tone for structure
              borderRadius: 2,
              background: 'linear-gradient(135deg, #fff7e0 0%, #eaf4f0 100%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)', // soft shadow for depth
              color: '#003D2C',
              '& .MuiInputBase-root': {
                color: '#003D2C',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                px: 1,
              },
              '& .MuiInputLabel-root': {
                color: '#003D2C',
              },
              '& .MuiInputLabel-shrink': {
                color: '#003D2C',
              },
              '& .MuiCheckbox-root': {
                color: '#003D2C',
              },
              '& .MuiFormControlLabel-label': {
                color: '#003D2C',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ffc928',
              },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ffc928',
              },
            }}
          >
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
                  flexWrap: 'wrap',
                }}
              >
                {/* Left: Package Index Badge */}
                <Typography
                  variant='subtitle1'
                  sx={{ display: 'flex', alignItems: 'center', mr: 2 }}
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
                      minWidth: 24,
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    # {selectedPackageIndex + 1}
                  </Box>
                </Typography>
                <React.Fragment>
                  <Dialog
                    open={showDimensions}
                    onClose={() => setShowDimensions(false)}
                    fullWidth
                    maxWidth='sm'
                  >
                    <DialogTitle>Dimensions</DialogTitle>
                    <DialogContent>
                      <Grid
                        container
                        spacing={1}
                        justifyContent='center'
                        alignItems='center'
                        sx={{ flexGrow: 1, maxWidth: '100%' }}
                      >
                        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
                          <Tooltip
                            title='Setting this value will automatically calculate CBM'
                            placement='top'
                            arrow
                          >
                            <TextField
                              label='Length (cm)'
                              name={`packageLength_${selectedPackageIndex}`}
                              value={
                                shippingFormData.packages[selectedPackageIndex]?.packageLength || ''
                              }
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
                              slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                              sx={{
                                '& .MuiInputBase-root': {
                                  fontSize: '0.75rem',
                                  padding: '2px 8px',
                                  height: '48px',
                                },
                                '& .MuiInputLabel-root': {
                                  fontSize: '0.75rem',
                                  top: '-4px',
                                },
                                '& .MuiInputLabel-shrink': {
                                  top: 0,
                                },
                              }}
                            />
                          </Tooltip>
                        </Grid>

                        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
                          <Tooltip
                            title='Setting this value will automatically calculate CBM'
                            placement='top'
                            arrow
                          >
                            <TextField
                              label='Width (cm)'
                              name={`packageWidth_${selectedPackageIndex}`}
                              value={
                                shippingFormData.packages[selectedPackageIndex]?.packageWidth || ''
                              }
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
                              slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                              sx={{
                                '& .MuiInputBase-root': {
                                  fontSize: '0.75rem',
                                  padding: '2px 8px',
                                  height: '48px',
                                },
                                '& .MuiInputLabel-root': {
                                  fontSize: '0.75rem',
                                  top: '-4px',
                                },
                                '& .MuiInputLabel-shrink': {
                                  top: 0,
                                },
                              }}
                            />
                          </Tooltip>
                        </Grid>

                        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
                          <Tooltip
                            title='Setting this value will automatically calculate CBM'
                            placement='top'
                            arrow
                          >
                            <TextField
                              label='Height (cm)'
                              name={`packageHeight_${selectedPackageIndex}`}
                              value={
                                shippingFormData.packages[selectedPackageIndex]?.packageHeight || ''
                              }
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
                              slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                              sx={{
                                '& .MuiInputBase-root': {
                                  fontSize: '0.75rem',
                                  padding: '2px 8px',
                                  height: '48px',
                                },
                                '& .MuiInputLabel-root': {
                                  fontSize: '0.75rem',
                                  top: '-4px',
                                },
                                '& .MuiInputLabel-shrink': {
                                  top: 0,
                                },
                              }}
                            />
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setShowDimensions(false)}>Close</Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>
                {/* Center: Inputs Grouped */}
                <Box sx={{ ml: 'auto' }}>
                  <Tooltip title='Duplicate Package' direction='top' arrow>
                    <IconButton
                      onClick={() => handlePackageDuplication(selectedPackageIndex)}
                      size='small'
                      sx={{ color: '#003D2C' }}
                    >
                      <FaClone />
                    </IconButton>
                  </Tooltip>

                  {/* Right: Delete Button */}
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
              </Box>
            </Tooltip>

            <React.Fragment>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
                  <TextField
                    label='Marks and Numbers'
                    name={`marksAndNumbers_${selectedPackageIndex}`}
                    type='text'
                    value={shippingFormData.packages[selectedPackageIndex]?.marksAndNumbers}
                    onChange={(e) =>
                      handlePackageChange(selectedPackageIndex, 'marksAndNumbers', e.target.value)
                    }
                    fullWidth
                    size='small'
                    margin='dense'
                  />
                </Grid>
                <Grid size={{ sm: 6, xs: 6, md: 2, lg: 1 }}>
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
                <Grid size={{ sm: 6, xs: 6, md: 2, lg: 2 }}>
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

                <Grid size={{ sm: 6, xs: 6, md: 2, lg: 2 }}>
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

                <Grid size={{ sm: 6, xs: 6, md: 2, lg: 1 }}>
                  <TextField
                    label='Weight (kg)'
                    name={`packageWeight_${selectedPackageIndex}`}
                    value={shippingFormData.packages[selectedPackageIndex]?.packageWeight}
                    onChange={(e) =>
                      handlePackageChange(selectedPackageIndex, 'packageWeight', e.target.value)
                    }
                    fullWidth
                    size='small'
                    margin='dense'
                    required
                    slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                  />
                </Grid>
                <Grid>
                  <Button
                    onClick={() => setShowDimensions(true)}
                    variant='outlined'
                    startIcon={<Edit fontSize='small' />}
                    sx={{
                      height: '40px',
                      mt: '8px',
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      pl: 1.5,
                    }}
                    fullWidth
                  >
                    Dimensions
                  </Button>
                </Grid>

                <Grid size={{ sm: 6, xs: 6, md: 2, lg: 1 }}>
                  <Tooltip
                    title='Setting this value will automatically clear dimensions.'
                    placement='top'
                    arrow
                  >
                    <TextField
                      label='CBM'
                      name={`CBM_${selectedPackageIndex}`}
                      value={shippingFormData.packages[selectedPackageIndex]?.CBM}
                      onChange={(e) => {
                        handlePackageChange(selectedPackageIndex, 'CBM', e.target.value);
                      }}
                      fullWidth
                      size='small'
                      margin='dense'
                      slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                    />
                  </Tooltip>
                </Grid>

                <Grid size={{ sm: 6, xs: 6, md: 2, lg: 1 }}>
                  <Tooltip
                    title='Setting this value will automatically clear dimensions.'
                    placement='top'
                    arrow
                  >
                    <TextField
                      label='LDM'
                      name={`LDM_${selectedPackageIndex}`}
                      value={shippingFormData.packages[selectedPackageIndex]?.LDM}
                      onChange={(e) => {
                        handlePackageChange(selectedPackageIndex, 'LDM', e.target.value);
                      }}
                      fullWidth
                      size='small'
                      margin='dense'
                      slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                    />
                  </Tooltip>
                </Grid>

                <Grid>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      background:
                        'linear-gradient(145deg, rgba(0, 61, 44, 0.75), rgba(0, 0, 0, 0.3))',
                      color: 'white',
                    }}
                  >
                    {shippingFormData.packages[selectedPackageIndex]?.CBM ? (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography variant='caption' sx={{ opacity: 0.7, fontSize: '0.65rem' }}>
                            Taxable Wt.
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}
                          >
                            {shippingFormData.packages[selectedPackageIndex]?.TaxableWeight ?? '—'}{' '}
                            kg
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant='caption' sx={{ opacity: 0.7, fontSize: '0.65rem' }}>
                            CBM
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}
                          >
                            {shippingFormData.packages[selectedPackageIndex]?.CBM}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant='caption' sx={{ opacity: 0.7, fontSize: '0.65rem' }}>
                          Taxable Wt.
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}
                        >
                          {shippingFormData.packages[selectedPackageIndex]?.TaxableWeight ?? '—'} kg
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>

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
                ></Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
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
                  />
                </Grid>

                <Grid>
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

                <Grid>
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

                {shippingFormData.packages[selectedPackageIndex]?.insured && (
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                    <TextField
                      label='Value of Goods (€)'
                      name={`packageValue_${selectedPackageIndex}`}
                      value={shippingFormData.packages[selectedPackageIndex]?.valueOfGoods}
                      onChange={(e) =>
                        handlePackageChange(selectedPackageIndex, 'valueOfGoods', e.target.value)
                      }
                      fullWidth
                      size='small'
                      margin='dense'
                      required={shippingFormData.packages[selectedPackageIndex]?.insured || false}
                      slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                    />
                  </Grid>
                )}

                <Grid>
                  <FormControlLabel
                    sx={{ mt: 1 }}
                    control={
                      <Checkbox
                        checked={
                          shippingFormData.packages[selectedPackageIndex]?.tempControlled || false
                        }
                        onChange={(e) =>
                          handlePackageChange(
                            selectedPackageIndex,
                            'tempControlled',
                            e.target.checked,
                          )
                        }
                        name={`tempControlled_${selectedPackageIndex}`}
                        color='primary'
                      />
                    }
                    label='Temperature Controlled'
                  />
                </Grid>

                {shippingFormData.packages[selectedPackageIndex]?.tempControlled && (
                  <React.Fragment>
                    <Grid size={{ xs: 12, sm: 6, md: 2, lg: 1 }}>
                      <Tooltip title='Temperature range from -30ºC to 30ºC' direction='top' arrow>
                        <TextField
                          label='MIN'
                          name={`tempControlledMinTemp_${selectedPackageIndex}`}
                          value={
                            shippingFormData?.packages[selectedPackageIndex]?.tempControlledMinTemp
                          }
                          onChange={(e) =>
                            handlePackageChange(
                              selectedPackageIndex,
                              'tempControlledMinTemp',
                              e.target.value,
                            )
                          }
                          fullWidth
                          size='small'
                          margin='dense'
                          required={
                            shippingFormData.packages[selectedPackageIndex]?.tempControlled || false
                          }
                          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                        />
                      </Tooltip>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2, lg: 1 }}>
                      <Tooltip title='Temperature range from -30ºC to 30ºC' direction='top' arrow>
                        <TextField
                          label='MAX'
                          name={`tempControlledMaxTemp_${selectedPackageIndex}`}
                          value={
                            shippingFormData?.packages[selectedPackageIndex]?.tempControlledMaxTemp
                          }
                          onChange={(e) =>
                            handlePackageChange(
                              selectedPackageIndex,
                              'tempControlledMaxTemp',
                              e.target.value,
                            )
                          }
                          fullWidth
                          size='small'
                          margin='dense'
                          required={
                            shippingFormData.packages[selectedPackageIndex]?.tempControlled || false
                          }
                          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                        />
                      </Tooltip>
                    </Grid>
                  </React.Fragment>
                )}
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
          {/*
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
          */}
          <Grid container spacing={2}>
            {shippingFormData?.insured && (
              <React.Fragment>
                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                  <TextField
                    label='Value of Goods (€)'
                    name='valueOfGoods'
                    value={shippingFormData?.valueOfGoods}
                    onChange={handleChange}
                    fullWidth
                    size='small'
                    margin='dense'
                    required={shippingFormData?.insured || false}
                    slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                  <TextField
                    select
                    label='Insured'
                    name={'insuredBy'}
                    value={shippingFormData.insuredBy}
                    onChange={handleChange}
                    fullWidth
                    size='small'
                    margin='dense'
                    required
                  >
                    {insuredByOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </React.Fragment>
            )}

            <Grid>
              <FormControlLabel
                sx={{ mt: 1 }}
                control={
                  <Checkbox
                    checked={shippingFormData?.insured || false}
                    onChange={handleChange}
                    name='insured'
                    color='primary'
                  />
                }
                label='Insured'
              />
            </Grid>
            {shippingFormData?.customs && (
              <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                <TextField
                  select
                  label='Customs clear'
                  name={'customsClearedBy'}
                  value={shippingFormData.customsClearedBy}
                  onChange={handleChange}
                  fullWidth
                  size='small'
                  margin='dense'
                  required
                >
                  {customsClearedByOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid>
              <FormControlLabel
                sx={{ mt: 1 }}
                control={
                  <Checkbox
                    checked={shippingFormData?.customs || false}
                    onChange={handleChange}
                    name='customs'
                    color='primary'
                  />
                }
                label='Customs'
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
            background: 'linear-gradient(135deg, #ffffff 0%, #eaf4f0 100%)',
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
              Total Weight: <strong>{infoValues.totalWeight || 0} kg</strong>
            </Typography>

            <Typography>
              Total CBM: <strong>{infoValues.totalCBM || 0}</strong>
            </Typography>

            <Typography>
              Total LDM: <strong>{infoValues.totalLDM || 0}</strong>
            </Typography>

            <Typography>
              Total Taxable Weight: <strong>{infoValues.totalTaxableWeight || 0} kg</strong>
            </Typography>

            <Typography>
              Total Volumes: <strong>{infoValues.quantityByType.volume || 0}</strong>
            </Typography>

            <Typography>
              Total Palets: <strong>{infoValues.quantityByType.palete || 0}</strong>
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
                    <span>{index + 1}</span>
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
