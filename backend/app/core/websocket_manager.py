from fastapi import WebSocket
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        # Maps user_id to a list of active WebSockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        print(f"User {user_id} connected via WebSocket")

    def disconnect(self, user_id: str, websocket: WebSocket):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        print(f"User {user_id} disconnected from WebSocket")

    async def send_personal_message(self, message: dict, user_id: str):
        user_id = str(user_id)
        print(f"WS Manager: Looking for user {user_id}. Active users: {list(self.active_connections.keys())}")
        if user_id in self.active_connections:
            print(f"WS Manager: Found {len(self.active_connections[user_id])} connections for user {user_id}")
            for connection in self.active_connections[user_id]:
                await connection.send_json(message)
        else:
            print(f"WS Manager: No active connections for user {user_id}")

    async def broadcast(self, message: dict):
        for user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_json(message)

manager = ConnectionManager()
