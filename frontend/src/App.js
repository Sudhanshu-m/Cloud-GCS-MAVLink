import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import DroneMap from './components/DroneMap';
import Telemetry from './components/Telemetry';

function App() {
  const [data, setData] = useState({
    lat: 0, lon: 0, alt: 0, roll: 0, pitch: 0, yaw: 0, connected: false
  });
  
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/ws');

    ws.current.onopen = () => setData(prev => ({ ...prev, connected: true }));
    ws.current.onclose = () => setData(prev => ({ ...prev, connected: false }));

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'gps') {
        setData(prev => ({ ...prev, lat: message.lat, lon: message.lon, alt: message.alt }));
      } else if (message.type === 'attitude') {
        setData(prev => ({ ...prev, roll: message.roll, pitch: message.pitch, yaw: message.yaw }));
      }
    };

    const handleKeyDown = (e) => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

      let command = "";
      switch(e.key) {
        case "t": 
        case "T":
            command = "TAKEOFF"; 
            break;
        case "l": 
        case "L":
            command = "LAND"; 
            break;
        case "ArrowUp": 
            e.preventDefault(); 
            command = "NORTH"; 
            break;
        case "ArrowDown": 
            e.preventDefault(); 
            command = "SOUTH"; 
            break;
        case "ArrowRight": 
            e.preventDefault();
            command = "EAST"; 
            break;
        case "ArrowLeft": 
            e.preventDefault(); 
            command = "WEST"; 
            break;
        default: return;
      }

      console.log("Sending Command:", command);
      ws.current.send(command);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      ws.current.close();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>GCS Control</h1>
        <span className={data.connected ? "status-ok" : "status-err"}>
          {data.connected ? "LINK ACTIVE" : "DISCONNECTED"}
        </span>
      </header>
      <div className="instructions">
        <p>Controls: <b>T</b> = Takeoff | <b>L</b> = Land | <b>Arrow Keys</b> = Move</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="map-container">
          <DroneMap lat={data.lat} lon={data.lon} />
        </div>
        <div className="telemetry-container">
          <Telemetry data={data} />
        </div>
      </div>
    </div>
  );
}

export default App;