from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    @property
    def users(self):
        return self.db.users

    @property
    def tasks(self):
        return self.db.tasks

    @property
    def archived_tasks(self):
        return self.db.archived_tasks

    @property
    def daily_summaries(self):
        return self.db.daily_summaries

db = MongoDB()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db.db = db.client[settings.DATABASE_NAME]
    
    # Create Indexes for efficient querying
    await db.tasks.create_index([("user_id", 1), ("created_at", 1)])
    await db.archived_tasks.create_index([("user_id", 1), ("archive_date", -1)])
    await db.daily_summaries.create_index([("user_id", 1), ("date", -1)], unique=True)
    
    print("Connected to MongoDB and initialized indexes")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")
