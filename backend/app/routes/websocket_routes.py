from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.websocket_manager import manager

router = APIRouter(tags=["Notifications"])

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            # Keep the connection open and wait for messages (optional)
            data = await websocket.receive_text()
            # Echo back or handle incoming messages if needed
            await websocket.send_json({"message": f"Message received: {data}"})
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
