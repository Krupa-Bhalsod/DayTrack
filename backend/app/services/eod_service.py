from datetime import datetime, timezone
from typing import List, Optional
from app.database.mongodb import db
from app.services.task_service import TaskService
from app.core.websocket_manager import manager
from app.core.exceptions import NotFoundException, BadRequestException
from app.utils.mongo_utils import parse_object_id, document_to_dict

class EODService:
    @staticmethod
    async def run_eod_process(user_id: str, date: str) -> dict:
        """
        Executes the full End-of-Day process for a user.
        """
        # 1. Fetch current tasks
        cursor = db.tasks.find({"user_id": user_id})
        current_tasks = await cursor.to_list(length=None)
        
        if not current_tasks:
            raise BadRequestException(f"No tasks found for date {date} to process.")

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
        
        # 4. Save summary
        await db.daily_summaries.update_one(
            {"user_id": user_id, "date": date},
            {"$set": summary_data},
            upsert=True
        )

        # 5. Notify about Pending Tasks
        pending_tasks = [t for t in current_tasks if t.get("status") != "COMPLETED"]
        if pending_tasks:
            await EODService.notify_pending_tasks(user_id, pending_tasks)

        # 6. Archive tasks
        archive_result = await TaskService.archive_user_tasks(user_id, date)
        
        # 7. Notify User with Summary
        await EODService.notify_user(user_id, summary_data)

        return {
            "success": True,
            "date": date,
            "summary": summary_data,
            "archived_count": archive_result.get("archived_count", 0)
        }

    @staticmethod
    async def notify_pending_tasks(user_id: str, tasks: List[dict]):
        task_titles = ", ".join([t.get("title") for t in tasks])
        verb = "is" if len(tasks) == 1 else "are"
        notification = {
            "type": "TASKS_PENDING",
            "title": "Unfinished Business! ⏳",
            "message": f"Your {task_titles} {verb} pending. They've been archived.",
            "data": {
                "count": len(tasks),
                "titles": [t.get("title") for t in tasks]
            }
        }
        await manager.send_personal_message(notification, user_id)

    @staticmethod
    async def notify_user(user_id: str, summary: dict):
        notification = {
            "type": "EOD_SUMMARY",
            "title": "Daily Summary Generated ",
            "message": f"Your summary for {summary['date']} is ready! You completed {summary['tasks_completed']} out of {summary['tasks_created']} tasks.",
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
        return [document_to_dict(summary) async for summary in cursor]

    @staticmethod
    async def delete_summary(summary_id: str) -> bool:
        result = await db.daily_summaries.delete_one({"_id": parse_object_id(summary_id)})
        if result.deleted_count == 0:
            raise NotFoundException(f"Summary with ID {summary_id} not found")
        return True
