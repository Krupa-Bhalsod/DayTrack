from datetime import datetime, timezone
from typing import List, Optional
from app.database.mongodb import db
from app.schemas.task_schema import TaskCreate, TaskUpdate
from app.core.websocket_manager import manager
from app.core.exceptions import NotFoundException
from app.utils.mongo_utils import parse_object_id, document_to_dict

class TaskService:
    @staticmethod
    async def create_task(user_id: str, task_data: TaskCreate) -> dict:
        now = datetime.now(timezone.utc)
        task_dict = task_data.model_dump()
        task_dict.update({
            "user_id": user_id,
            "created_at": now,
            "updated_at": now,
            "completed_at": None
        })
        
        result = await db.tasks.insert_one(task_dict)
        task_dict["_id"] = str(result.inserted_id)
        return task_dict

    @staticmethod
    async def get_tasks(user_id: str) -> List[dict]:
        cursor = db.tasks.find({"user_id": user_id})
        return [document_to_dict(task) async for task in cursor]

    @staticmethod
    async def get_today_tasks(user_id: str) -> List[dict]:
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        cursor = db.tasks.find({
            "user_id": user_id,
            "created_at": {"$gte": today_start}
        })
        return [document_to_dict(task) async for task in cursor]

    @staticmethod
    async def get_task_or_404(task_id: str, collection="tasks") -> dict:
        oid = parse_object_id(task_id)
        task = await db[collection].find_one({"_id": oid})
        if not task:
            raise NotFoundException(f"Task with ID {task_id} not found")
        return document_to_dict(task)

    @staticmethod
    async def update_task(task_id: str, task_data: TaskUpdate) -> dict:
        update_dict = {k: v for k, v in task_data.model_dump(exclude_unset=True).items()}
        if not update_dict:
            return await TaskService.get_task_or_404(task_id)
        
        now = datetime.now(timezone.utc)
        update_dict["updated_at"] = now
        
        if update_dict.get("status") == "COMPLETED":
            update_dict["completed_at"] = now

        result = await db.tasks.find_one_and_update(
            {"_id": parse_object_id(task_id)},
            {"$set": update_dict},
            return_document=True
        )
        
        if not result:
            raise NotFoundException(f"Task with ID {task_id} not found")
            
        task = document_to_dict(result)
        if update_dict.get("status") == "COMPLETED":
            await TaskService.notify_task_completed(task)
        return task

    @staticmethod
    async def delete_task(task_id: str) -> bool:
        result = await db.tasks.delete_one({"_id": parse_object_id(task_id)})
        if result.deleted_count == 0:
            raise NotFoundException(f"Task with ID {task_id} not found")
        return True

    @staticmethod
    async def mark_task_complete(task_id: str) -> dict:
        now = datetime.now(timezone.utc)
        result = await db.tasks.find_one_and_update(
            {"_id": parse_object_id(task_id)},
            {
                "$set": {
                    "status": "COMPLETED",
                    "completed_at": now,
                    "updated_at": now
                }
            },
            return_document=True
        )
        
        if not result:
            raise NotFoundException(f"Task with ID {task_id} not found")
            
        task = document_to_dict(result)
        await TaskService.notify_task_completed(task)
        return task

    @staticmethod
    async def get_archived_tasks(user_id: str, date: Optional[str] = None) -> List[dict]:
        query = {"user_id": user_id}
        if date:
            query["archive_date"] = date
        
        cursor = db.archived_tasks.find(query).sort("archive_date", -1)
        return [document_to_dict(task) async for task in cursor]

    @staticmethod
    async def delete_archived_task(task_id: str) -> bool:
        result = await db.archived_tasks.delete_one({"_id": parse_object_id(task_id)})
        if result.deleted_count == 0:
            raise NotFoundException(f"Archived task with ID {task_id} not found")
        return True

    @staticmethod
    async def archive_user_tasks(user_id: str, date: str) -> dict:
        cursor = db.tasks.find({"user_id": user_id})
        tasks_to_archive = await cursor.to_list(length=None)
        
        if not tasks_to_archive:
            return {"message": "No tasks to archive", "archived_count": 0}
        
        now = datetime.now(timezone.utc)
        archived_docs = []
        for task in tasks_to_archive:
            archived_doc = task.copy()
            if archived_doc.get("status") not in ["COMPLETED", "NOT_COMPLETED"]:
                archived_doc["status"] = "NOT_COMPLETED"
            
            archived_doc.update({
                "archive_date": date,
                "archived_at": now
            })
            archived_docs.append(archived_doc)
        
        try:
            await db.archived_tasks.insert_many(archived_docs)
            task_ids = [task["_id"] for task in tasks_to_archive]
            await db.tasks.delete_many({"_id": {"$in": task_ids}})
            
            return {
                "message": "Archiving successful",
                "archived_count": len(archived_docs),
                "date": date
            }
        except Exception as e:
            # Re-raise as a database exception or let it bubble up
            raise e

    @staticmethod
    async def notify_task_completed(task: dict):
        user_id = task.get("user_id")
        print(f"Attempting to send notification for task {task.get('_id')} to user {user_id}")
        notification = {
            "type": "TASK_COMPLETED",
            "title": "Task Completed! 🚀",
            "message": f"Hurray! {task.get('title')} is completed!",
            "data": {
                "task_id": task.get("_id"),
                "title": task.get("title"),
                "completed_at": task.get("completed_at").isoformat() if hasattr(task.get("completed_at"), "isoformat") else task.get("completed_at")
            }
        }
        await manager.send_personal_message(notification, task.get("user_id"))
