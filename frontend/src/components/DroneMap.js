import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapUpdater({ center }) {
  const map = useMap();
  if (center[0] !== 0 && center[1] !== 0) {
    map.setView(center);
  }
  return null;
}

const DroneMap = ({ lat, lon }) => {
  const position = [lat || 0, lon || 0];

  return (
    <MapContainer center={[0, 0]} zoom={15} style={{ height: "100%", width: "100%" }} keyboard={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <MapUpdater center={position} />
      <CircleMarker center={position} radius={10} color="red" fillColor="#f03" fillOpacity={0.5}>
        <Popup>
          Drone Location<br />
          Lat: {lat.toFixed(5)}<br />
          Lon: {lon.toFixed(5)}
        </Popup>
      </CircleMarker>
    </MapContainer>
  );
};

export default DroneMap;