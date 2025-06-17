import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import torrestirApi from '../api/torrestirApi';

// Create context
const ShippingFormContext = createContext(null);

// Provider Component
export const ShippingFormProvider = ({ children }) => {
  const [loadingShippingForm, setLoadingShippingForm] = useState(true);
  const [trackingNumberShippingForm, setTrackingNumberShippingForm] = useState(null);
  const { token } = useAuth();

  // Initialize form data with default values
  const getInitialFormData = (trackingRef = null) => ({
    senderTaxId: '',
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
    senderId: '',
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderStreet: '',
    senderStreet2: '',
    senderCity: '',
    senderState: '',
    senderZip: '',
    senderCountry: '',
    recipientId: '',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    recipientStreet: '',
    recipientStreet2: '',
    recipientCity: '',
    recipientState: '',
    recipientZip: '',
    recipientCountry: '',
    packages: [
      {
        packageQuantity: '1',
        packageWeight: '',
        packageLength: '',
        packageWidth: '',
        packageHeight: '',
        packageNote: '',
        packageType: 'volume',
        CBM: '',
        LDM: '',
        TaxableWeight: '',
        stackable: false,
        dangerousGoods: false,
        marksAndNumbers: '',
        typeOfGoods: 'general_goods',
      },
    ],
    valueOfGoods: '',
    insured: false,
    insuredBy: 'torrestir',
    customs: false,
    customsClearedBy: 'torresAduana',
    shippingService: 'standard',
    trackingRef: trackingRef,
    shipperRef: '',
    consigneeRef: '',
    shipperInstructions: '',
    consigneeInstructions: '',
    tempControlled: false,
    tempControlledMinTemp: '',
    tempControlledMaxTemp: '',
    RetailStoreFlag: false,
    DriversHelperFlag: false,
    PriorContactFlag: false,
    PinCodeFlag: false,
    PinCode: '',
  });

  const [formData, setFormData] = useState(() => {
    // Load from localStorage on initial render
    try {
      const storedData = localStorage.getItem('shippingFormData');
      const storedTrackingNumber = localStorage.getItem('trackingNumberShippingForm');

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Ensure tracking ref is updated if we have a stored tracking number
        if (storedTrackingNumber) {
          parsedData.trackingRef = storedTrackingNumber;
        }
        return parsedData;
      }
      console.log(getInitialFormData(storedTrackingNumber));
      return getInitialFormData(storedTrackingNumber);
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
      return getInitialFormData();
    }
  });

  // Function to fetch tracking number from API
  const fetchTrackingNumber = async () => {
    if (!token) {
      setTrackingNumberShippingForm(null);
      setLoadingShippingForm(false);
      return false;
    }

    try {
      setLoadingShippingForm(true);
      const response = await torrestirApi.post(
        '/api/Trackings',
        {
          clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response?.data) {
        const trackingNumber = response.data.trackingNumber;
        setTrackingNumberShippingForm(trackingNumber);
        localStorage.setItem('trackingNumberShippingForm', trackingNumber);

        // Update form data with the new tracking number
        setFormData((prevData) => ({
          ...prevData,
          trackingRef: trackingNumber,
        }));

        setLoadingShippingForm(false);
        return true; // Success
      } else {
        setTrackingNumberShippingForm(null);
        setLoadingShippingForm(false);
        return false; // Failed
      }
    } catch (error) {
      console.error('Error fetching tracking number:', error);
      setTrackingNumberShippingForm(null);
      setLoadingShippingForm(false);
      return false; // Failed
    }
  };

  // Initialize data and set up retry mechanism
  useEffect(() => {
    let retryInterval = null;

    async function initializeData() {
      // Check if we already have a tracking number in localStorage
      const storedTrackingNumber = localStorage.getItem('trackingNumberShippingForm');

      if (storedTrackingNumber && storedTrackingNumber !== 'null') {
        setTrackingNumberShippingForm(storedTrackingNumber);
        setFormData((prevData) => ({
          ...prevData,
          trackingRef: storedTrackingNumber,
        }));
        setLoadingShippingForm(false);
        return;
      }

      // Try to fetch tracking number
      const success = await fetchTrackingNumber();

      // If failed and we have a token, set up retry interval
      if (!success && token) {
        retryInterval = setInterval(async () => {
          console.log('Retrying to fetch tracking number...');
          const retrySuccess = await fetchTrackingNumber();

          // Clear interval if successful
          if (retrySuccess) {
            clearInterval(retryInterval);
          }
        }, 10000); // Retry every 10 seconds
      }
    }

    initializeData();

    // Cleanup interval on unmount or token change
    return () => {
      if (retryInterval) {
        clearInterval(retryInterval);
      }
    };
  }, [token]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('shippingFormData', JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving form data to localStorage:', error);
    }
  }, [formData]);

  const resetForm = () => {
    const resetData = getInitialFormData(trackingNumberShippingForm);

    setFormData(resetData);

    // Clear stored data
    try {
      localStorage.removeItem('shippingFormData');
      // Note: Keep the tracking number in localStorage unless you want to clear it too
      // localStorage.removeItem('trackingNumberShippingForm');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  const updateFormData = (newData) => {
    console.log('New data on context: ', newData);
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  return (
    <ShippingFormContext.Provider
      value={{
        shippingFormData: formData,
        setShippingFormData: updateFormData,
        resetShippingFormData: resetForm,
        loadingShippingForm,
        trackingNumberShippingForm,
        retryFetchTrackingNumber: fetchTrackingNumber, // Manual retry function
      }}
    >
      {children}
    </ShippingFormContext.Provider>
  );
};

// Custom hook to use context
export const useShippingFormContext = () => {
  const context = useContext(ShippingFormContext);
  if (!context) {
    throw new Error('useShippingFormContext must be used within a ShippingFormProvider');
  }
  return context;
};
