import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TrackingMap from '../trackingMap/trackingMap';
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

export default function TrackingPage() {
  const { trackingNumber } = useParams();
  console.log('TrackingPage', trackingNumber);

  const [data, setData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  useEffect(() => {
    fetch('/mock-tracking.json')
      .then((res) => res.json())
      .then(setData);
  }, []);

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

  const handleMapClick = (lat, lng) => {
    setCoordinates({ lat, lng });
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
            DELIVERY DETAILS {showDetails ? <FaMinus /> : <FaPlus />}
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
                            onClick={() => handleMapClick(row.location.lat, row.location.lng)}
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
            <TrackingMap coordinates={coordinates} />
            <br />
            <br />
            <br />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className='button'
              onClick={() => setShowMap(false)}
            >
              Close
            </motion.button>
          </div>
        </div>
      )}
    </>
  );
}
