from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health_routes, task_routes, eod_routes
from app.database.mongodb import connect_to_mongo, close_mongo_connection, db
from app.core.config import settings
from datetime import datetime, timezone


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

    # Shutdown Event
    @app.on_event("shutdown")
    async def shutdown_event():
        print("DayTrack API shutting down...")
        await close_mongo_connection()

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