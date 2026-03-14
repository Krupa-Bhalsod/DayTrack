from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.services.eod_service import EODService
from app.core.config import settings
from datetime import datetime, timedelta

scheduler = AsyncIOScheduler()

async def scheduled_eod():
    """
    Background task to run EOD process daily at midnight.
    Requirement 3: Automatic execution of EOD process.
    """
    # Archive tasks for "yesterday" (the day that just ended at midnight)
    yesterday_date = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    print(f"Running scheduled EOD process for date: {yesterday_date}")
    
    # Run historical processing for the hardcoded default user
    await EODService.run_eod_process(settings.DEFAULT_USER_ID, yesterday_date)

def start_scheduler():
    # Requirement 3: Executes at the end of each calendar day (Midnight)
    scheduler.add_job(
        scheduled_eod,
        CronTrigger(hour=0, minute=0),
        id="daily_eod",
        replace_existing=True
    )
    
    scheduler.start()
    print("Scheduler started: Midnight EOD process active.")

def stop_scheduler():
    scheduler.shutdown()
    print("Scheduler stopped.")
