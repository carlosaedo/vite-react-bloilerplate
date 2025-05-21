import React from 'react';
import './Tracking.css';
import { IoIosArrowBack, IoMdMore, IoMdArrowDropdown } from 'react-icons/io'; // For icons
import { FaBox } from 'react-icons/fa'; // Example for the small box icon

const trackingData = [
  {
    date: '19 de maio de',
    year: '2025',
    time: '01:00',
    status: 'Seu pacote está em trânsito com a transportadora.',
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
      'Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.Seu pacote está em trânsito com a transportadora.',
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
    status: 'Seu pacote está em trânsito com a transportadora.',
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
  const progressPercentage = 60; // Example value, adjust as needed

  return (
    <div className='tracking-wrapper'>
      <div className='tracking-header-bar'>
        <IoIosArrowBack className='header-icon' />
        <h1 className='tracking-title'>Detalhes do seu pacote</h1>
        <IoMdMore className='header-icon' />
      </div>

      <div className='timeline-container'>
        <div className='status-summary'>
          <div className='status-text'>
            <FaBox className='box-icon' />
            <h2 className='timeline-header'>O seu envio está em trânsito há 15 dia(s)</h2>
          </div>
          <p className='timeline-subtext'>
            A entrega é esperada em 1-5 dias (com base em 1000 entregas semelhantes)
          </p>
          <div className='progress-bar-container'>
            <div className='progress-bar-fill' style={{ width: `${progressPercentage}%` }}></div>
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
                  {item.isExpanded && <IoMdArrowDropdown className='dropdown-icon' />}
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
    </div>
  );
};

export default Tracking;
