import time
import math
import socket
from pymavlink import mavutil

target_ip = '127.0.0.1' 

master = mavutil.mavlink_connection(f'udpout:{target_ip}:14550', source_system=1)

cmd_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
cmd_sock.bind(('0.0.0.0', 14551)) 
cmd_sock.setblocking(False)      


lat = 19.0330
lon = 73.0297
alt = 0
target_alt = 0
yaw = 0

print(f"Drone Ready. Listening for commands on Port 14551...")
boot_time = time.time()

while True:
    try:
        data, addr = cmd_sock.recvfrom(1024)
        command = data.decode().strip()
        print(f"Received Command: {command}")
        
        
        if command == "TAKEOFF":
            target_alt = 20
        elif command == "LAND":
            target_alt = 0
        elif command == "NORTH":
            lat += 0.001  
        elif command == "SOUTH":
            lat -= 0.001
        elif command == "EAST":
            lon += 0.001
        elif command == "WEST":
            lon -= 0.001
            
    except BlockingIOError:
        pass 

    if alt < target_alt: alt += 0.1
    if alt > target_alt: alt -= 0.1
    
    current_time_ms = int((time.time() - boot_time) * 1000)

    master.mav.global_position_int_send(
        current_time_ms, int(lat * 1e7), int(lon * 1e7), int(alt * 1000), int(alt * 1000), 0, 0, 0, 65535
    )
    
    master.mav.attitude_send(
        current_time_ms, 0, 0, yaw, 0, 0, 0
    )

    time.sleep(0.1)