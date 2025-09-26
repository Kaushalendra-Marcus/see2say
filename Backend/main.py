from fastapi import FastAPI, UploadFile, File
from app.routes import router
from fastapi.responses import JSONResponse
import shutil
import os

from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from app.models import extract_and_caption_frames
from app.utils import text_to_speech_base64
from app.gemini_client import generate_summary_with_gemini
from app.routes import router

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title ="Image Caption Backend")
UPLOAD_DIR = Path("uploads")
app.include_router(router)

UPLOAD_DIR.mkdir(exist_ok=True)

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("Loaded API key:", GEMINI_API_KEY[:10]) 
@app.post("/process-video")
async def process_video(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        captions = extract_and_caption_frames(str(file_path) , interval = 2)
        summary_text = generate_summary_with_gemini(captions)
        audio_base64_str = text_to_speech_base64(summary_text)
        os.remove(file_path)
        return JSONResponse(content = {
            "captions" : captions,
            "final Summary" : summary_text,
            "audio": audio_base64_str
        })
    except Exception as e :
        return JSONResponse(status_code = 500,content ={"error": str(e)})
    




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # for only frontend ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)