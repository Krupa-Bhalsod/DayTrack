from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from app.core.scheduler import start_scheduler, stop_scheduler
from app.routes import health_routes, task_routes, eod_routes, websocket_routes
from app.database.mongodb import connect_to_mongo, close_mongo_connection, db
from app.core.config import settings
from app.core.exceptions import DayTrackException
from fastapi.responses import JSONResponse
from fastapi import Request


def create_app() -> FastAPI:
    app = FastAPI(
        title="DayTrack API",
        description="Daily Task Management System",
        version="1.0.0"
    )

    # CORS Configuration
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers
    app.include_router(health_routes.router)
    app.include_router(task_routes.router)
    app.include_router(eod_routes.router)
    app.include_router(websocket_routes.router)

    # Exception Handlers
    @app.exception_handler(DayTrackException)
    async def daytrack_exception_handler(request: Request, exc: DayTrackException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.public_message},
        )


    # Startup Event
    @app.on_event("startup")
    async def startup_event():
        print("DayTrack API starting...")
        await connect_to_mongo()
        # Seed default user
        user = await db.users.find_one({"_id": settings.DEFAULT_USER_ID})
        if not user:
            await db.users.insert_one({
                "_id": settings.DEFAULT_USER_ID,
                "name": "Default User",
                "email": "user@daytrack.com",
                "created_at": datetime.now(timezone.utc)
            })
            print(f"Created default user with ID: {settings.DEFAULT_USER_ID}")
        
        # Start background EOD scheduler
        start_scheduler()

    # Shutdown Event
    @app.on_event("shutdown")
    async def shutdown_event():
        print("DayTrack API shutting down...")
        await close_mongo_connection()
        stop_scheduler()

    return app


app = create_app()

# Local Development Entry
def main():
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )


if __name__ == "__main__":
    main()