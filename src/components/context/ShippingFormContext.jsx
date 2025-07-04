import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import torrestirApi from '../api/torrestirApi';

// Create context
const ShippingFormContext = createContext(null);

// Provider Component
export const ShippingFormProvider = ({ children }) => {
  const { token } = useAuth();

  // Loading state while fetching form / tracking numbers
  const [loadingShippingForm, setLoadingShippingForm] = useState(true);

  // List of tracking numbers created so far
  const [trackingNumberShippingForm, setTrackingNumberShippingForm] = useState([]);

  // The current form data state
  const [formData, setFormData] = useState(null);
  const didInitRef = useRef(false); // 👈 prevent duplicate effect run

  // Helper: get initial empty form data, optionally with trackingRef
  const getInitialFormData = (trackingRef = null) => {
    const now = new Date();
    const time = now.toTimeString().slice(0, 5); // "HH:MM"
    const today = now.toISOString().slice(0, 10); // "yyyy-MM-dd"
    const year = now.getFullYear();

    return {
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
          packageType: 'VLM',
          CBM: '',
          LDM: '',
          TaxableWeight: '',
          stackable: false,
          dangerousGoods: false,
          marksAndNumbers: '',
          typeOfGoods: 'GEN',
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
      clientDepartmentId: '',
    };
  };

  // Fetch a new tracking number from the API
  const fetchTrackingNumber = async () => {
    if (!token) {
      setLoadingShippingForm(false);
      return null;
    }

    const existing = JSON.parse(localStorage.getItem('trackingNumberShippingForm'));
    if (Array.isArray(existing) && existing.length > 0) {
      return null;
    }

    try {
      setLoadingShippingForm(true);
      const response = await torrestirApi.post(
        '/api/Trackings',
        {
          clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // TODO: make dynamic if needed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response?.data?.trackingNumber) {
        const trackingNumber = response.data.trackingNumber;

        // Add to tracking numbers list and save to localStorage
        setTrackingNumberShippingForm((prev) => {
          const updated = [...prev, trackingNumber];
          localStorage.setItem('trackingNumberShippingForm', JSON.stringify(updated));
          return updated;
        });

        // Create a fresh form with the new tracking number
        const newForm = getInitialFormData(trackingNumber);
        setFormData(newForm);

        setLoadingShippingForm(false);
        return trackingNumber;
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

  const fetchNewTrackingNumber = async () => {
    if (!token) {
      setLoadingShippingForm(false);
      return null;
    }

    try {
      setLoadingShippingForm(true);
      const response = await torrestirApi.post(
        '/api/Trackings',
        {
          clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // TODO: make dynamic if needed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response?.data?.trackingNumber) {
        const trackingNumber = response.data.trackingNumber;

        // Add to tracking numbers list and save to localStorage
        setTrackingNumberShippingForm((prev) => {
          const updated = [...prev, trackingNumber];
          localStorage.setItem('trackingNumberShippingForm', JSON.stringify(updated));
          return updated;
        });

        // Create a fresh form with the new tracking number
        const newForm = getInitialFormData(trackingNumber);
        setFormData(newForm);

        setLoadingShippingForm(false);
        return trackingNumber;
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

  // On mount, load saved data or fetch a new tracking number
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    let retryInterval = null;

    async function initializeData() {
      // Try loading tracking numbers from localStorage
      const storedTrackingNumbers =
        JSON.parse(localStorage.getItem('trackingNumberShippingForm')) || [];

      if (storedTrackingNumbers.length > 0) {
        // Load last tracking number data from localStorage
        const latestTracking = storedTrackingNumbers[storedTrackingNumbers.length - 1];
        setTrackingNumberShippingForm(storedTrackingNumbers);

        const key = `shippingFormData_${latestTracking}`;
        const storedData = localStorage.getItem(key);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          parsedData.trackingRef = latestTracking;
          setFormData(parsedData);
        } else {
          // No saved form for this tracking number, create initial form
          setFormData(getInitialFormData(latestTracking));
        }
        setLoadingShippingForm(false);
        return;
      }

      // No stored tracking numbers, fetch a new one
      const trackingNumber = await fetchTrackingNumber();

      // If fetch fails, retry every 10 seconds until success or token missing
      if (!trackingNumber && token) {
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
      if (retryInterval) clearInterval(retryInterval);
    };
  }, [token]);

  // Save formData to localStorage whenever it changes
  useEffect(() => {
    if (!formData?.trackingRef) return;

    try {
      const key = `shippingFormData_${formData.trackingRef}`;
      localStorage.setItem(key, JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving form data to localStorage:', error);
    }
  }, [formData]);

  // Reset form data for a given tracking number
  const resetForm = (activeTrackingNumber) => {
    const resetData = getInitialFormData(activeTrackingNumber);
    setFormData(resetData);
  };

  // Update form data partially
  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  // Switch active tracking number, loading data from storage or create new form
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

  // Remove a tracking number and its saved data
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
        fetchNewTrackingNumber,
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
