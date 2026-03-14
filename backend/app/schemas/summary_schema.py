from pydantic import BaseModel, Field
from datetime import datetime

class DailySummary(BaseModel):
    date: str
    tasks_created: int
    tasks_completed: int
    tasks_pending: int
    completion_percentage: float
    generated_at: datetime

    class Config:
        from_attributes = True
