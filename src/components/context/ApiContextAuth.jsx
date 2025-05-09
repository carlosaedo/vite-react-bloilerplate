import { createContext, useContext, useState } from 'react';

const initialContextData = {
  note: 'This is a note.',
  jwt: null,
  user: null,
};

const ApiContext = createContext(null);

export const ApiProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const token = localStorage.getItem('jwt');
    return { ...initialContextData, jwt: token };
  });

  const setJwt = (token) => {
    localStorage.setItem('jwt', token);
    setData((prev) => ({ ...prev, jwt: token }));
  };

  const clearJwt = () => {
    localStorage.removeItem('jwt');
    setData((prev) => ({ ...prev, jwt: null }));
  };

  return (
    <ApiContext.Provider
      value={{ contextApiData: data, setContextApiData: setData, setJwt, clearJwt }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useContextApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useContextApi must be used within an ApiProvider');
  }
  return context;
};
