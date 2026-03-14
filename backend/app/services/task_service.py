from datetime import datetime, timezone
from typing import List, Optional
from bson import ObjectId
from app.database.mongodb import db
from app.schemas.task_schema import TaskCreate, TaskUpdate

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
        tasks = []
        async for task in cursor:
            task["_id"] = str(task["_id"])
            tasks.append(task)
        return tasks

    @staticmethod
    async def get_today_tasks(user_id: str) -> List[dict]:
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        cursor = db.tasks.find({
            "user_id": user_id,
            "created_at": {"$gte": today_start}
        })
        tasks = []
        async for task in cursor:
            task["_id"] = str(task["_id"])
            tasks.append(task)
        return tasks

    @staticmethod
    async def update_task(task_id: str, task_data: TaskUpdate) -> Optional[dict]:
        update_dict = {k: v for k, v in task_data.model_dump(exclude_unset=True).items()}
        if not update_dict:
            return None
        
        now = datetime.now(timezone.utc)
        update_dict["updated_at"] = now
        
        if update_dict.get("status") == "COMPLETED":
            update_dict["completed_at"] = now

        result = await db.tasks.find_one_and_update(
            {"_id": ObjectId(task_id)},
            {"$set": update_dict},
            return_document=True
        )
        
        if result:
            result["_id"] = str(result["_id"])
        return result

    @staticmethod
    async def delete_task(task_id: str) -> bool:
        result = await db.tasks.delete_one({"_id": ObjectId(task_id)})
        return result.deleted_count > 0

    @staticmethod
    async def mark_task_complete(task_id: str) -> Optional[dict]:
        now = datetime.now(timezone.utc)
        result = await db.tasks.find_one_and_update(
            {"_id": ObjectId(task_id)},
            {
                "$set": {
                    "status": "COMPLETED",
                    "completed_at": now,
                    "updated_at": now
                }
            },
            return_document=True
        )
        
        if result:
            result["_id"] = str(result["_id"])
        return result

    @staticmethod
    async def get_archived_tasks(user_id: str, date: str) -> List[dict]:
        cursor = db.archived_tasks.find({
            "user_id": user_id,
            "archive_date": date
        })
        tasks = []
        async for task in cursor:
            task["_id"] = str(task["_id"])
            tasks.append(task)
        return tasks

    @staticmethod
    async def archive_user_tasks(user_id: str, date: str) -> dict:
        """
        Archive tasks for a specific user and date.
        Moves tasks from 'tasks' to 'archived_tasks'.
        Works without transactions for standalone MongoDB compatibility.
        """
        # 1. Fetch tasks
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
            # 2. Insert into archived_tasks
            await db.archived_tasks.insert_many(archived_docs)
            
            # 3. Remove from active tasks ONLY after successful insertion
            task_ids = [task["_id"] for task in tasks_to_archive]
            await db.tasks.delete_many({"_id": {"$in": task_ids}})
            
            return {
                "message": "Archiving successful",
                "archived_count": len(archived_docs),
                "date": date
            }
        except Exception as e:
            # If insertion fails, we don't delete from active tasks
            raise e
