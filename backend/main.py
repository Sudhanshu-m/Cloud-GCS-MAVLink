import asyncio
import json
import socket
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pymavlink import mavutil

app = FastAPI()

mav_connection = mavutil.mavlink_connection('udpin:0.0.0.0:14550')

drone_command_ip = '127.0.0.1' 
command_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Frontend Connected")

    async def receive_commands():
        """Listen for commands from React and send to Drone via UDP"""
        try:
            while True:
                data = await websocket.receive_text()
                print(f"CMD Received: {data}")
                command_sock.sendto(data.encode(), (drone_command_ip, 14551))
        except WebSocketDisconnect:
            print("Client disconnected")

    async def send_telemetry():
        """Read MAVLink from Drone and send to React"""
        while True:
            msg = mav_connection.recv_match(blocking=False)
            if msg:
                msg_type = msg.get_type()
                data = {}
                if msg_type == 'GLOBAL_POSITION_INT':
                    data = {"type": "gps", "lat": msg.lat/1e7, "lon": msg.lon/1e7, "alt": msg.alt/1000}
                elif msg_type == 'ATTITUDE':
                    data = {"type": "attitude", "roll": msg.roll, "pitch": msg.pitch, "yaw": msg.yaw}
                
                if data:
                    await websocket.send_text(json.dumps(data))
            await asyncio.sleep(0.01)

    await asyncio.gather(receive_commands(), send_telemetry())