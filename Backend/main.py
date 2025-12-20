from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from pathlib import Path
from dotenv import load_dotenv

from app.models import extract_and_caption_frames
from app.utils import text_to_speech_base64
from app.gemini_client import generate_summary_with_gemini
from app.routes import router

# Load environment variables
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="Image Caption Backend")

# Setup upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


app.include_router(router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Image Caption Backend API",
        "endpoints": {
            "GET /": "This endpoint",
            "GET /health": "Health check",
            "POST /upload": "Upload image for captioning",
            "POST /process-video": "Upload video for narration"
        }
    }

@app.post("/process-video")
async def process_video(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename
    
    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Extract frames and generate captions
        captions = extract_and_caption_frames(str(file_path), interval=2)
        
        # Generate summary using Gemini
        summary_text = generate_summary_with_gemini(captions)
        
        # Convert summary to speech
        audio_base64_str = text_to_speech_base64(summary_text)
        
        # uploaded file
        os.remove(file_path)
        
        return JSONResponse(content={
            "captions": captions,
            "final_summary": summary_text,
            "audio": audio_base64_str
        })
        
    except Exception as e:
       
        if os.path.exists(file_path):
            os.remove(file_path)
        return JSONResponse(status_code=500, content={"error": str(e)})
