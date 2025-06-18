import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import torrestirApi from '../api/torrestirApi';

// Create context
const ShippingFormContext = createContext(null);

// Provider Component
export const ShippingFormProvider = ({ children }) => {
  const [loadingShippingForm, setLoadingShippingForm] = useState(true);
  const [trackingNumberShippingForm, setTrackingNumberShippingForm] = useState([]);
  const { token } = useAuth();

  const now = new Date();
  const time = now.toTimeString().slice(0, 5); // "HH:MM"
  const today = now.toISOString().slice(0, 10); // "yyyy-MM-dd"
  const year = now.getFullYear();

  const getInitialFormData = (trackingRef = null) => ({
    senderTaxId: '',
    recipientTaxId: '',
    shippingPayment: 'pronto',
    shippingPaymentTo: 'expeditor',
    deliveryTime: time,
    date: today,
    year: year,
    hour: time,
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
    clientId: '',
    clientName_REFERENCE: '',
  });

  const [formData, setFormData] = useState(() => {
    try {
      const storedTrackingNumbers =
        JSON.parse(localStorage.getItem('trackingNumberShippingForm')) || [];
      const latestTrackingNumber = storedTrackingNumbers[storedTrackingNumbers.length - 1];
      const key = `shippingFormData_${latestTrackingNumber}`;
      const storedData = localStorage.getItem(key);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        parsedData.trackingRef = latestTrackingNumber;
        return parsedData;
      }
      return getInitialFormData(latestTrackingNumber);
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
      return getInitialFormData();
    }
  });

  const fetchTrackingNumber = async () => {
    if (!token) {
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
        setFormData(getInitialFormData(trackingNumber));

        setTrackingNumberShippingForm((prev) => {
          const updated = [...prev, trackingNumber];
          localStorage.setItem('trackingNumberShippingForm', JSON.stringify(updated));
          return updated;
        });

        setLoadingShippingForm(false);
        return trackingNumber; // Return the actual tracking number string
      } else {
        setLoadingShippingForm(false);
        return null;
      }
    } catch (error) {
      console.error('Error fetching tracking number:', error);
      setLoadingShippingForm(false);
      return null;
    }
  };

  useEffect(() => {
    let retryInterval = null;

    async function initializeData() {
      const stored = JSON.parse(localStorage.getItem('trackingNumberShippingForm')) || [];
      if (stored.length > 0) {
        const latestTracking = stored[stored.length - 1];
        setTrackingNumberShippingForm(stored);
        setFormData((prevData) => ({
          ...prevData,
          trackingRef: latestTracking,
        }));
        setLoadingShippingForm(false);
        return;
      }

      const success = await fetchTrackingNumber();
      if (!success && token) {
        retryInterval = setInterval(async () => {
          const retrySuccess = await fetchTrackingNumber();
          if (retrySuccess) {
            clearInterval(retryInterval);
          }
        }, 10000);
      }
    }

    initializeData();

    return () => {
      if (retryInterval) {
        clearInterval(retryInterval);
      }
    };
  }, [token]);

  useEffect(() => {
    try {
      if (formData?.trackingRef) {
        const key = `shippingFormData_${formData.trackingRef}`;
        localStorage.setItem(key, JSON.stringify(formData));
      }
    } catch (error) {
      console.error('Error saving form data to localStorage:', error);
    }
  }, [formData]);

  const resetForm = (trackingNumber = trackingNumberShippingForm) => {
    const resetData = getInitialFormData(trackingNumber);
    setFormData(resetData);
    try {
      if (trackingNumber) {
        const key = `shippingFormData_${trackingNumber}`;
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const setActiveTrackingNumber = (trackingNumber) => {
    if (!trackingNumber) return;

    const key = `shippingFormData_${trackingNumber}`;
    const storedData = localStorage.getItem(key);

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      parsedData.trackingRef = trackingNumber;
      setFormData(parsedData);
    } else {
      setFormData(getInitialFormData(trackingNumber));
    }
  };

  const removeTrackingNumber = (trackingNumber) => {
    setTrackingNumberShippingForm((prev) => {
      const updated = prev.filter((t) => t !== trackingNumber);
      localStorage.setItem('trackingNumberShippingForm', JSON.stringify(updated));
      localStorage.removeItem(`shippingFormData_${trackingNumber}`);
      return updated;
    });
  };

  return (
    <ShippingFormContext.Provider
      value={{
        shippingFormData: formData,
        setShippingFormData: updateFormData,
        resetShippingFormData: resetForm,
        loadingShippingForm,
        trackingNumberShippingForm,
        retryFetchTrackingNumber: fetchTrackingNumber,
        removeTrackingNumber,
        setActiveTrackingNumber,
      }}
    >
      {children}
    </ShippingFormContext.Provider>
  );
};

export const useShippingFormContext = () => {
  const context = useContext(ShippingFormContext);
  if (!context) {
    throw new Error('useShippingFormContext must be used within a ShippingFormProvider');
  }
  return context;
};
