import React from 'react';
import './truckLoader.css';
import Truck from '../../assets/torrestir_loadingTruck_optimized.png';

const TruckLoader = () => {
  return (
    <div className='truck-loader'>
      <img src={Truck} alt='Loading Truck' />
      <div className='road' />
    </div>
  );
};

export default TruckLoader;
