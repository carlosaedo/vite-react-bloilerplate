import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TrackingMap from '../trackingMap/TrackingMap';
import Footer from './Footer';
import api from '../api/api';
import {
  FaCheck,
  FaThLarge,
  FaTruck,
  FaUser,
  FaHome,
  FaPlus,
  FaMinus,
  FaExclamationTriangle,
} from 'react-icons/fa';
import './Tracking.css';

const stages = [
  { label: 'Documented', icon: <FaCheck /> },
  { label: 'Collected', icon: <FaThLarge /> },
  { label: 'In Transit', icon: <FaTruck /> },
  { label: 'In Deliver', icon: <FaUser /> },
  { label: 'Delivered', icon: <FaHome /> },
];

const stageException = { label: 'Exception', icon: <FaExclamationTriangle /> };

const TTL = 10 * 60 * 1000; // 10 minutes in ms

const TrackingPage = () => {
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

  if (!data) return <div className='loading'>Loading...</div>;

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

  return (
    <>
      <div className='page-wrapper'>
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

        <div className='card'>
          <div className='info-grid'>
            <div>
              <strong>Entity:</strong> {entity}
            </div>
            <div>
              <strong>Entity Ref:</strong> {entityRef}
            </div>
            <div>
              <strong>Our Reference:</strong> {ourRef}
            </div>
            <div>
              <strong>Estimated:</strong> {estimated}
            </div>
            <div>
              <strong>From:</strong> {from}
            </div>
            <div>
              <strong>To:</strong> {to}
            </div>
            <div>
              <strong>Packages:</strong> {packages}
            </div>
            <div>
              <strong>Pallets:</strong> {pallets}
            </div>
          </div>
        </div>

        <div className='button-wrapper'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='button'
            onClick={() => setShowDetails((prev) => !prev)}
          >
            DELIVERY DETAILS{' '}
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
                    <th>Local</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Location</th>
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
                            Map
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
      </div>
      {showMap && (
        <div className='modal-overlay'>
          <div className='modal-content'>
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
              Close
            </motion.button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default TrackingPage;
