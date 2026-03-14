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
    print("Connected to MongoDB")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")
