from fastapi import FastAPI, BackgroundTasks
import logging
import subprocess
import sys
import os

app = FastAPI(title="Quality Pulse Crawler Service")
logger = logging.getLogger("CrawlerService")

@app.post("/trigger")
async def trigger_pipeline(background_tasks: BackgroundTasks):
    """트리거 수신 시 백그라운드에서 파이프라인을 실행합니다."""
    background_tasks.add_task(run_unified_pipeline)
    return {"message": "Crawler pipeline triggered successfully in background."}

@app.get("/health")
def health():
    return {"status": "ok"}

def run_unified_pipeline():
    """실제 unified_pipeline.py 스크립트 실행"""
    logger.info("Starting unified_pipeline.py...")
    try:
        # Docker 환경이므로 현재 Python 인터프리터를 사용하여 실행
        result = subprocess.run([sys.executable, "unified_pipeline.py"], check=True)
        logger.info("Pipeline completed successfully.")
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
