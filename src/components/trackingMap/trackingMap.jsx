import './trackingMap.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

import gpsIcon from '../../assets/gps.png';
import torrestirLogo from '../../assets/logotipo.png';

const TrackingMap = ({ coordinates, title = 'Current location' }) => {
  const [map, setMap] = useState(null);

  // Fix for default markers not showing up
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: gpsIcon,
      iconUrl: gpsIcon,
      shadowUrl: '',
    });
  }, []);

  // Ensure coordinates are valid and in the correct format
  const position =
    coordinates && coordinates.lat && coordinates.lng
      ? [coordinates.lat, coordinates.lng]
      : [51.505, -0.09]; // Default position (London) if coordinates are invalid

  // When map or position changes, update the view
  useEffect(() => {
    if (map) {
      map.setView(position, 13);
    }
  }, [map, position]);

  return (
    <div className='map-container'>
      <img className='torrestir_map_logo' src={torrestirLogo}></img>
      <h3 className='map-title'>{title}</h3>
      <MapContainer
        center={position}
        zoom={13}
        style={{
          height: '400px',
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={position}>
          <Popup>{title}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default TrackingMap;
