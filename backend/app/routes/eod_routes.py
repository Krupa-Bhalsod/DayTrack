from fastapi import APIRouter
from typing import List
from app.services.eod_service import EODService
from app.core.config import settings

router = APIRouter(prefix="/eod", tags=["EOD"])

@router.post("/process")
async def run_eod(date: str):
    return await EODService.run_eod_process(settings.DEFAULT_USER_ID, date)

@router.get("/summaries")
async def get_summaries():
    return await EODService.get_daily_summaries(settings.DEFAULT_USER_ID)

@router.delete("/summaries/{summary_id}")
async def delete_summary(summary_id: str):
    await EODService.delete_summary(summary_id)
    return {"message": "Summary deleted successfully"}
