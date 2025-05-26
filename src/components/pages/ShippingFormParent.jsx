import React, { useState, useEffect } from 'react';

import ShippingForm from './ShippingForm';
import ShippingFormSinglePage from './ShippingFormSinglePage'; // Fixed incorrect import
import { CircularProgress } from '@mui/material';
import { ShippingFormProvider } from '../context/ShippingFormContext';

function ShippingFormParent() {
  const [loading, setLoading] = useState(true);
  const [shippingFormTypeSinglePage, setShippingFormTypeSinglePage] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('formTypeSinglePage');
    setShippingFormTypeSinglePage(storedData === 'true'); // Ensure boolean
    setLoading(false);
  }, []);

  const handleChangeFormType = (singlePage) => {
    setShippingFormTypeSinglePage(singlePage);
    if (singlePage) {
      localStorage.setItem('formTypeSinglePage', 'true');
    } else {
      localStorage.removeItem('formTypeSinglePage');
    }
  };

  if (loading) return <CircularProgress sx={{ marginTop: 4 }} />;

  return (
    <>
      <ShippingFormProvider>
        {shippingFormTypeSinglePage ? (
          <ShippingFormSinglePage handleChangeFormType={handleChangeFormType} />
        ) : (
          <ShippingForm handleChangeFormType={handleChangeFormType} />
        )}
      </ShippingFormProvider>
    </>
  );
}

export default ShippingFormParent;
