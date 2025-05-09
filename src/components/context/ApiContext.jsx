import { createContext, useContext, useState } from 'react';

// Initial data
const contextApiData = {
  note: 'This is a note.',
};

// Create context
const ApiContext = createContext(null);

// Provider Component
export const ApiProvider = ({ children }) => {
  const [data, setData] = useState(contextApiData);

  return (
    <ApiContext.Provider value={{ contextApiData: data, setContextApiData: setData }}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use context
export const useContextApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
