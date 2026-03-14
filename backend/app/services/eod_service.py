from datetime import datetime, timezone
from typing import List, Optional
from app.database.mongodb import db
from app.services.task_service import TaskService
from app.schemas.summary_schema import DailySummary
from app.core.websocket_manager import manager

class EODService:
    @staticmethod
    async def run_eod_process(user_id: str, date: str) -> dict:
        """
        Executes the full End-of-Day process for a user:
        1. Fetch today's tasks
        2. Calculate totals
        3. Convert IN_PROGRESS (and others) -> NOT_COMPLETED
        4. Generate and save summary
        5. Archive and clear tasks
        """
        # 1. Fetch current tasks
        cursor = db.tasks.find({"user_id": user_id})
        current_tasks = await cursor.to_list(length=None)
        
        if not current_tasks:
            return {"message": "No tasks found for EOD processing", "success": False}

        # 2. Calculate totals
        total_created = len(current_tasks)
        total_completed = sum(1 for t in current_tasks if t.get("status") == "COMPLETED")
        total_pending = total_created - total_completed
        completion_percentage = (total_completed / total_created * 100) if total_created > 0 else 0

        # 3. Generate summary document
        summary_data = {
            "user_id": user_id,
            "date": date,
            "tasks_created": total_created,
            "tasks_completed": total_completed,
            "tasks_pending": total_pending,
            "completion_percentage": round(completion_percentage, 2),
            "generated_at": datetime.now(timezone.utc)
        }
        
        # 4. Save summary (Update if already exists for this date/user)
        await db.daily_summaries.update_one(
            {"user_id": user_id, "date": date},
            {"$set": summary_data},
            upsert=True
        )

        # 5. Archive tasks (TaskService handles the movement and status conversion)
        archive_result = await TaskService.archive_user_tasks(user_id, date)
        
        # 6. Notify User via WebSocket (Requirement 3.B)
        await EODService.notify_user(user_id, summary_data)

        return {
            "success": True,
            "date": date,
            "summary": summary_data,
            "archived_count": archive_result.get("archived_count", 0)
        }

    @staticmethod
    async def notify_user(user_id: str, summary: dict):
        """
        Sends a real-time notification via WebSocket (Requirement 3.B).
        """
        notification = {
            "type": "EOD_SUMMARY",
            "title": "Daily Summary Generated",
            "data": {
                "date": summary['date'],
                "tasks_created": summary['tasks_created'],
                "tasks_completed": summary['tasks_completed'],
                "tasks_pending": summary['tasks_pending'],
                "completion_percentage": summary['completion_percentage'],
                "executed_at": summary['generated_at'].isoformat() if hasattr(summary['generated_at'], 'isoformat') else summary['generated_at']
            }
        }
        await manager.send_personal_message(notification, user_id)

    @staticmethod
    async def get_daily_summaries(user_id: str) -> List[dict]:
        cursor = db.daily_summaries.find({"user_id": user_id}).sort("date", -1)
        summaries = []
        async for summary in cursor:
            summary["_id"] = str(summary["_id"])
            summaries.append(summary)
        return summaries
