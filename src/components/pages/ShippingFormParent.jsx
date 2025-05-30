import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ShippingForm from './ShippingForm';
import ShippingFormSinglePage from './ShippingFormSinglePage'; // Fixed incorrect import
import { CircularProgress } from '@mui/material';
import { ShippingFormProvider } from '../context/ShippingFormContext';
import { useAuth } from '../context/AuthContext';

function ShippingFormParent({ sidebarWidth }) {
  const navigateTo = useNavigate();
  const { checkLoginStatusAuth, loadingAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [shippingFormTypeSinglePage, setShippingFormTypeSinglePage] = useState(null);

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const loginStatus = await checkLoginStatusAuth();

        if (!loginStatus) {
          navigateTo('/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        navigateTo('/login');
      }
    }
    checkLoginStatus();
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

  if (loading || loadingAuth) return <CircularProgress sx={{ marginTop: 4 }} />;

  return (
    <>
      <ShippingFormProvider>
        {shippingFormTypeSinglePage ? (
          <ShippingFormSinglePage
            handleChangeFormType={handleChangeFormType}
            sidebarWidth={sidebarWidth}
          />
        ) : (
          <ShippingForm handleChangeFormType={handleChangeFormType} sidebarWidth={sidebarWidth} />
        )}
      </ShippingFormProvider>
    </>
  );
}

export default ShippingFormParent;
