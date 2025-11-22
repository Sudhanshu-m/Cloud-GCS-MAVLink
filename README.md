# Cloud-Based Ground Control Station (GCS)


A real-time, cloud-enabled Ground Control Station (GCS) designed to
monitor and control UAVs over the internet. This system utilizes the
**MAVLink protocol** for standard telemetry and **ZeroTier/Tailscale**
for secure, NAT-traversing network connectivity, enabling remote
operations over 4G/LTE networks.

## 🚀 Features

-   **Real-Time Telemetry:** Live visualization of Drone GPS location,
    Altitude, Roll, Pitch, and Yaw.
-   **Interactive Map:** Leaflet-based dynamic map tracking the drone's
    flight path.
-   **Bi-Directional Control:** Send commands (Takeoff, Land, Move) from
    the web dashboard to the drone.
-   **Cloud Architecture:** Decoupled Frontend and Backend communicating
    via WebSockets.
-   **Network Independence:** Designed to work over Virtual Private
    Networks (ZeroTier) for remote access.

## 🛠️ Technology Stack

-   **Frontend:** React.js, Leaflet Maps, WebSocket API.
-   **Backend:** Python 3.10+, FastAPI, PyMAVLink.
-   **Network:** ZeroTier / Tailscale.
-   **Simulation:** Custom Python script simulating ArduPilot MAVLink
    packets.

## 📂 Project Structure

``` text
GCS_Project/
├── backend/
│   ├── main.py           # FastAPI Server (UDP to WebSocket Bridge)
│   ├── mock_drone.py     # MAVLink Drone Simulator
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/              # React source code
│   ├── public/           # Static assets
│   └── package.json      # Node dependencies
└── README.md             # Documentation
```

## ⚙️ Installation & Setup

### Prerequisites

-   Node.js & npm\
-   Python 3.8+

------------------------------------------------------------------------

## 1️⃣ Backend Setup (Server)

The backend listens for MAVLink UDP packets and streams them to the
frontend via WebSockets.

``` bash
cd backend

# Create virtual environment
python -m venv venv

# Activate environment (Windows)
.env\Scriptsctivate
# Mac/Linux
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

------------------------------------------------------------------------

## 2️⃣ Drone Simulation

Run the mock drone in a separate terminal.

``` bash
cd backend
.env\Scriptsctivate
python mock_drone.py
```

> Note: Update `target_ip` in **mock_drone.py** if using ZeroTier.

------------------------------------------------------------------------

## 3️⃣ Frontend Setup (Dashboard)

``` bash
cd frontend
npm install
npm start
```

Dashboard available at:\
**http://localhost:3000**

------------------------------------------------------------------------

## 🎮 Controls

  Key   Command   Action
  ----- --------- ---------------
  T     TAKEOFF   Ascend to 20m
  L     LAND      Descend to 0m
  ⬆️    NORTH     Move North
  ⬇️    SOUTH     Move South
  ➡️    EAST      Move East
  ⬅️    WEST      Move West

------------------------------------------------------------------------

## 🌐 Network Configuration (Remote Access)

To run over the internet:

1.  Install ZeroTier on drone + GCS machines\
2.  Join same ZeroTier network\
3.  Modify backend/mock_drone.py:

``` python
target_ip = "YOUR_ZEROTIER_SERVER_IP"
```

4.  Modify frontend/src/App.js:

``` javascript
const ws = new WebSocket("ws://YOUR_ZEROTIER_SERVER_IP:8000/ws");
```

------------------------------------------------------------------------
