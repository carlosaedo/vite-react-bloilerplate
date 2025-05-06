import './trackingMap.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

const TrackingMap = ({ coordinates, title = 'Current location' }) => {
  const [map, setMap] = useState(null);

  // Fix for default markers not showing up
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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
      <h3 className='map-title'>{title}</h3>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
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
