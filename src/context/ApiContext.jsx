import { createContext, useContext, useState } from 'react';

// Initial data
const apiData = {
  kitParts: {
    engineSeal: ['111111111111111111'],
    engine: ['222222222222222222'],
    carburatorSeal: ['33333333333333'],
    carburator: ['444444444444'],
    chassisSeal: ['555555555555555'],
    chassis: ['66666666666666'],
    exhaustSeal: ['77777777777777777'],
    exhaust: ['88888888888888'],
  },
  kitSetTires: [
    ['aaaaaaaaaaaaaaa', 'bbbbbbbbbbbbbb', 'cccccccccccccc', 'ddddddddddd'],
    ['eeeeeeeeeeee', 'fffffffffffffffffffffffff', 'gggggggggggggggggg', 'hhhhhhhhhhhhhhh'],
  ],
  note: 'This is a note.',
  validHelmet: true,
  validOverall: true,
  validTechnic: true,
  validGloves: true,
  validShoes: true,
  validBodyProtection: false,
  validPublicity: true,
};

// Create context
const ApiContext = createContext(null);

// Provider Component
export const ApiProvider = ({ children }) => {
  const [data, setData] = useState(apiData);

  return (
    <ApiContext.Provider value={{ apiData: data, setApiData: setData }}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
