import { createContext, useContext, useState } from 'react';

// Create context
const ShippingFormContext = createContext(null);

// Provider Component
export const ShippingFormProvider = ({ children }) => {
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

  return (
    <ShippingFormContext.Provider
      value={{
        shippingFormData: formData,
        setShippingFormData: setFormData,
        resetShippingFormData: resetForm,
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
    throw new Error('useShippingFormContext must be used within an ApiProvider');
  }
  return context;
};
