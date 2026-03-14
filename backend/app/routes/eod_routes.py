from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.services.eod_service import EODService
from app.schemas.summary_schema import DailySummary
from app.core.config import settings

router = APIRouter(prefix="/eod", tags=["End of Day"])

@router.post("/process")
async def run_eod_process(date: str = Query(..., description="Date for EOD processing (YYYY-MM-DD)")):
    """
    Trigger the End-of-Day process:
    - Generates a daily summary
    - Archives all active tasks
    - Clears the active tasks collection
    """
    result = await EODService.run_eod_process(settings.DEFAULT_USER_ID, date)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result

@router.get("/summaries")
async def get_summaries():
    """
    Fetch all historical daily summaries for the user.
    """
    return await EODService.get_daily_summaries(settings.DEFAULT_USER_ID)
