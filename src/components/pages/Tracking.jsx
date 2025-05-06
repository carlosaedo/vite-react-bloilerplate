import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaThLarge, FaTruck, FaUser, FaHome } from 'react-icons/fa';
import './Tracking.css';

const stages = [
  { label: 'Documented', icon: <FaCheck /> },
  { label: 'Collected', icon: <FaThLarge /> },
  { label: 'In Transit', icon: <FaTruck /> },
  { label: 'In Deliver', icon: <FaUser /> },
  { label: 'Delivered', icon: <FaHome /> },
];

export default function TrackingPage() {
  const [data, setData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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
  } = data;

  return (
    <div className='page-wrapper'>
      <div className='tracker-container'>
        {stages.map((stage, index) => {
          const isActive = index <= currentStage;

          return (
            <div key={index} className='stage-wrapper'>
              {index < stages.length - 1 && (
                <div className={`connector ${index < currentStage ? 'active' : ''}`}></div>
              )}
              <div className={`icon-box ${isActive ? 'active' : ''}`}>{stage.icon}</div>
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='button'
          onClick={() => setShowDetails((prev) => !prev)}
        >
          DELIVERY DETAILS {showDetails ? '➖' : '➕'}
        </motion.button>
      </div>

      {showDetails && (
        <div className='details-section'>
          <ul className='details-list'>
            {deliveryDetails.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <div className='table-wrapper'>
            <table>
              <thead>
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
                    <td>{row.local}</td>
                    <td>{row.date}</td>
                    <td>{row.status}</td>
                    <td>{row.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
