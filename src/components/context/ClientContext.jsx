// src/context/ClientContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [selectedClient, setSelectedClientState] = useState(() => {
    const stored = localStorage.getItem('selectedClient');
    return stored ? JSON.parse(stored) : null;
  });

  const setSelectedClient = (client) => {
    setSelectedClientState(client);
    localStorage.setItem('selectedClient', JSON.stringify(client));
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'selectedClient' && e.newValue) {
        setSelectedClientState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <ClientContext.Provider value={{ selectedClient, setSelectedClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};
