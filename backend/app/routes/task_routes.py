from fastapi import APIRouter, HTTPException, Path, Header
from typing import List
from app.services.task_service import TaskService
from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskResponse
from app.core.config import settings

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate):
    return await TaskService.create_task(settings.DEFAULT_USER_ID, task)

@router.get("/", response_model=List[TaskResponse])
async def get_tasks():
    return await TaskService.get_tasks(settings.DEFAULT_USER_ID)

@router.get("/today", response_model=List[TaskResponse])
async def get_today_tasks():
    return await TaskService.get_today_tasks(settings.DEFAULT_USER_ID)

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, task: TaskUpdate):
    updated_task = await TaskService.update_task(task_id, task)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@router.delete("/{task_id}")
async def delete_task(task_id: str):
    success = await TaskService.delete_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def mark_task_complete(task_id: str):
    updated_task = await TaskService.mark_task_complete(task_id)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task
