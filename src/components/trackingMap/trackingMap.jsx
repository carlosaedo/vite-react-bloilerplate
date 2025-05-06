import './trackingMap.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

import gpsIcon from '../../assets/gps.png';

const TrackingMap = ({ coordinates, title = 'Current local' }) => {
  const [map, setMap] = useState(null);
  useEffect(() => {
    // Create a custom icon instead of modifying the default
    const customIcon = L.icon({
      iconUrl: gpsIcon,
      iconSize: [32, 32], // Set your desired width and height in pixels
      iconAnchor: [16, 16], // Usually half of iconSize to center the icon on the marker position
      popupAnchor: [0, -16], // Position of the popup relative to the icon
    });

    // Use this custom icon when creating markers
    if (map && coordinates.length) {
      coordinates.forEach((coord) => {
        L.marker([coord.lat, coord.lng], { icon: customIcon }).addTo(map).bindPopup(title);
      });
    }
  }, [map, coordinates, title]);

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
