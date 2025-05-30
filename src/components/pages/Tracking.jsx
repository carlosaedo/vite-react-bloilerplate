import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import TrackingMap from '../trackingMap/TrackingMap';
import api from '../api/api';
import './Tracking.css';
import { motion } from 'framer-motion';
import { CircularProgress } from '@mui/material';
import { GiWeight, GiWoodenCrate } from 'react-icons/gi';
import { IoIosArrowBack, IoMdMore, IoMdArrowDropdown } from 'react-icons/io'; // For icons
import {
  FaBox,
  FaCheck,
  FaThLarge,
  FaTruck,
  FaUser,
  FaHome,
  FaPlus,
  FaMinus,
  FaExclamationTriangle,
} from 'react-icons/fa'; // Example for the small box icon

import { useTranslation } from 'react-i18next';

const TTL = 10 * 60 * 1000; // 10 minutes in ms

const trackingData = [
  {
    date: '19 de maio de',
    year: '2025',
    time: '01:00',
    status: 'O seu pacote está em trânsito com a transportadora.',
    location: 'Portugal, Vila Nova da Telha',
    action: 'Unloaded',
    company: 'TORRESTIR GROUP',
    logo: 'TORRESTIR', // Placeholder for a small logo text
    isExpanded: true, // For the first item to show the dropdown
  },
  {
    date: '13 de maio de',
    year: '2025',
    time: '01:00',
    status:
      'O seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.',
    location: 'Poland, Gliwice',
    company: 'TORRESTIR GROUP',
    logo: 'TORRESTIR',
  },
  {
    date: '8 de maio de',
    year: '2025',
    time: '01:00',
    status: 'A sua encomenda chegou a um centro de trânsito, está a caminho.',
    location: 'Inventory in a warehouse',
    company: 'TORRESTIR GROUP',
    logo: 'TORRESTIR',
  },
  {
    date: '7 de maio de',
    year: '2025',
    time: '01:00',
    status: 'O seu pacote está em trânsito com a transportadora.',
    location: 'Bydgoszcz',
    action: 'Collected',
    company: 'TORRESTIR GROUP',
    logo: 'TORRESTIR',
  },
  {
    date: '6 de maio de',
    year: '2025',
    time: '01:00',
    status: 'A transportadora foi informada e em breve irá recolher o seu pacote.',
    location: 'Chlebnia',
    action: 'Registered in the system',
    company: 'TORRESTIR GROUP',
    logo: 'TORRESTIR',
  },
];

const Tracking = () => {
  const { t } = useTranslation();
  const navigateTo = useNavigate();

  const stages = [
    { label: t('documented'), icon: <FaCheck /> },
    { label: t('collected'), icon: <FaThLarge /> },
    { label: t('inTransit'), icon: <FaTruck /> },
    { label: t('inDeliver'), icon: <FaUser /> },
    { label: t('delivered'), icon: <FaHome /> },
  ];

  const stageException = { label: t('exception'), icon: <FaExclamationTriangle /> };

  const { trackingNumber } = useParams();
  console.log('TrackingPage', trackingNumber);

  const cacheKey = `trackingData-${trackingNumber}`;
  const timestampKey = `trackingTimestamp-${trackingNumber}`;

  const [data, setData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapCurrentLocal, setMapCurrentLocal] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(timestampKey);
    const now = Date.now();

    if (cachedData && cachedTime && now - parseInt(cachedTime, 10) < TTL) {
      console.log('Using cached data:', cachedData);
      setData(JSON.parse(cachedData));
    } else {
      async function fetchTrackingInfo() {
        try {
          const response = await api.get(`/tracking/${trackingNumber}`);
          if (response) {
            console.log('Tracking data:', response.data.trackingData);
            setData(response.data.trackingData);
            localStorage.setItem(cacheKey, JSON.stringify(response.data.trackingData));
            localStorage.setItem(timestampKey, now.toString());
          }
        } catch (error) {
          console.error('Error fetching tracking data:', error);
        }
      }
      fetchTrackingInfo();
    }
  }, [trackingNumber]);

  if (!data) return <CircularProgress sx={{ marginTop: 4 }} />;

  const {
    currentStage,
    entity,
    entityRef,
    ourRef,
    estimated,
    from,
    to,
    packages,
    pallets,
    deliveryDetails,
    statusLog,
    hasException,
  } = data;

  // Inject "Exception" stage after the current stage if reported
  const getStagesWithException = (currentStage, hasException) => {
    if (!hasException) return stages;

    return [
      ...stages.slice(0, currentStage + 1),
      stageException,
      ...stages.slice(currentStage + 1),
    ];
  };
  const modifiedStages = getStagesWithException(currentStage, hasException);

  const handleMapClick = (lat, lng, local) => {
    console.log('handleMapClick', lat, lng, local);
    setCoordinates({ lat, lng });
    setMapCurrentLocal(local);
    console.log(mapCurrentLocal);
    setShowMap(true);
  };

  const progressPercentage = 60; // Example value, adjust as needed

  return (
    <React.Fragment>
      <div className='tracking-wrapper'>
        <div className='tracker-container'>
          {modifiedStages.map((stage, index) => {
            const isActive = hasException ? index <= currentStage + 1 : index <= currentStage;

            const isException = stage.label === 'Exception';

            return (
              <div key={index} className='stage-wrapper'>
                {index < modifiedStages.length - 1 && (
                  <div className={`connector ${isActive ? 'active' : ''}`}></div>
                )}
                <div
                  className={`icon-box ${isActive ? 'active' : ''} ${
                    isException ? 'exception' : ''
                  }`}
                >
                  {stage.icon}
                </div>
                <div className='label'>{stage.label}</div>
              </div>
            );
          })}
        </div>
        <div className='tracking-header-bar'>
          <IoIosArrowBack
            className='header-icon'
            onClick={() => {
              navigateTo('/tracking');
            }}
          />
          <h1 className='tracking-title'>Detalhes do seu envio</h1>
          <IoMdMore className='header-icon' />
        </div>

        <div className='timeline-container'>
          <div className='status-summary'>
            <div className='status-text'>
              <FaBox className='box-icon' />
              <h2 className='timeline-header'>O seu envio está em trânsito há 15 dia(s)</h2>
            </div>
            <p className='timeline-subtext'>
              A entrega é esperada em 1-5 dias {'('}
              {t('estimated')}
              {': '}
              {estimated} {')'} (com base em 1000 entregas semelhantes)
            </p>
            <div className='progress-bar-container'>
              <div className='progress-bar-fill' style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
          <div className='card'>
            <div className='generic-header-bar'>
              <strong>{t('entity')}: </strong> {entity}
            </div>
            <div className='info-grid'>
              {/* Caixa 1: ROTA */}
              <div className='info-box'>
                <h4>Rota</h4>
                <p>
                  <strong>{t('from')}:</strong> {from}
                </p>
                <p>
                  <strong>{t('to')}:</strong> {to}
                </p>
              </div>

              {/* Caixa 2: REFERÊNCIAS */}
              <div className='info-box'>
                <h4>Referências</h4>
                <p>
                  <strong>{t('entityRef')}:</strong> {entityRef}
                </p>
                <p>
                  <strong>{t('ourReference')}:</strong> {ourRef}
                </p>
              </div>

              {/* Caixa 3: VOLUMES & PESO */}
              <div className='info-box'>
                <h4>Volumes & Peso</h4>
                <p>
                  <strong>
                    <FaBox style={{ fontSize: '22px', verticalAlign: 'bottom' }} /> {t('packages')}:
                  </strong>{' '}
                  {packages}
                </p>
                <p>
                  <strong>
                    <GiWeight style={{ fontSize: '25px', verticalAlign: 'bottom' }} /> Peso:
                  </strong>{' '}
                  50 kg
                </p>
              </div>

              {/* Caixa 4: PALETES */}
              <div className='info-box'>
                <h4>Paletes</h4>
                <p>
                  <strong>
                    <GiWoodenCrate style={{ fontSize: '25px', verticalAlign: 'bottom' }} />{' '}
                    {t('pallets')}:
                  </strong>{' '}
                  {pallets}
                </p>
              </div>
            </div>
          </div>
          <div className='timeline'>
            {trackingData.map((item, index) => (
              <div key={index} className='timeline-item'>
                {/* Timeline Dot (Line will be a pseudo-element on timeline-item) */}
                <div className='timeline-marker'>
                  <div className='timeline-dot'></div>
                </div>

                {/* Right: Card */}
                <div className={`timeline-card ${item.isExpanded ? 'expanded' : ''}`}>
                  <div className='card-header'>
                    <div className='date-time-left'>
                      <p className='date'>{item.date}</p>
                      <p className='year'>{item.year}</p>
                      <p className='time'>{item.time}</p>
                    </div>
                    <div className='company-info'>
                      <span className='company-name'>{item.company}</span>
                      <span className='company-logo'>{item.logo}</span>
                    </div>
                    {/*item.isExpanded && <IoMdArrowDropdown className='dropdown-icon' />*/}
                  </div>
                  <div className='card-body'>
                    <p className='status'>{item.status}</p>
                    <p className='location'>{item.location}</p>
                    {item.action && <p className='action'>{item.action}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='button-wrapper'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='button'
            onClick={() => setShowDetails((prev) => !prev)}
          >
            {t('deliveryDetails')}{' '}
            {showDetails ? (
              <FaMinus className='span_delivery' />
            ) : (
              <FaPlus className='span_delivery' />
            )}
          </motion.button>
        </div>

        <br />
        {showDetails && (
          <div className='details-section'>
            <ul className='details-list'>
              {deliveryDetails.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <br />
            <div className='table-wrapper'>
              <table className='status-table'>
                <thead className='table-header'>
                  <tr>
                    <th>{t('local')}</th>
                    <th>{t('date')}</th>
                    <th>{t('status')}</th>
                    <th>{t('location')}</th>
                  </tr>
                </thead>
                <tbody>
                  {statusLog.map((row, idx) => (
                    <tr key={idx}>
                      <td data-label='Local'>{row.local}</td>
                      <td data-label='Date'>{row.date}</td>
                      <td data-label='Status'>{row.status}</td>
                      <td data-label='Location'>
                        {row.location && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className='button'
                            onClick={() =>
                              handleMapClick(row.location.lat, row.location.lng, row.local)
                            }
                          >
                            {t('map')}
                          </motion.button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showMap && (
          <div className='modal-overlay_tracking'>
            <div className='modal-content_tracking'>
              <TrackingMap coordinates={coordinates} title={mapCurrentLocal} />
              <br />
              <br />
              <br />
              <motion.button
                className='button modal_close_button'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMap(false)}
              >
                {t('close')}
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Tracking;
