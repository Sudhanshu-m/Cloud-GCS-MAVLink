import React from 'react';

const Telemetry = ({ data }) => {
  return (
    <div className="telemetry-panel">
      <h2>Flight Data</h2>
      <div className="data-row">
        <span className="label">Altitude:</span>
        <span className="value">{data.alt.toFixed(2)} m</span>
      </div>
      <div className="data-row">
        <span className="label">Roll:</span>
        <span className="value">{(data.roll * (180/Math.PI)).toFixed(1)}°</span>
      </div>
      <div className="data-row">
        <span className="label">Pitch:</span>
        <span className="value">{(data.pitch * (180/Math.PI)).toFixed(1)}°</span>
      </div>
      <div className="data-row">
        <span className="label">Yaw:</span>
        <span className="value">{(data.yaw * (180/Math.PI)).toFixed(1)}°</span>
      </div>
    </div>
  );
};

export default Telemetry;