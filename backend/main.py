from fastapi import FastAPI

app = FastAPI(title="DayTrack API")

@app.get("/")
async def root():
    return {"message": "Welcome to DayTrack API"}


def main():
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)


if __name__ == "__main__":
    main()
