import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path

# backend ke andar .env ka path
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("GEMINI in client file is :::::::::::::::::::::::::::::::::::::::::: ", GEMINI_API_KEY[10])

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found !")

genai.configure(api_key=GEMINI_API_KEY)

def generate_summary_with_gemini(captions: list) -> str:
    prompt = f"""
        You are an AI assistant for blind users. 
        Your task is to convert these scene captions into a single natural narration. 
        Make it sound like real human speech in Hinglish (simple Hindi + English mix). 
        Keep it clear, casual, and easy to understand — jaise koi dost side me chal ke bata raha ho. 
        Do not repeat captions; instead merge them into one smooth description. 
        Focus only on important and useful details that help the user imagine the scene. 
        Avoid robotic tone, avoid unnecessary fillers. 
        Length should be approx equal to 10 seconds of natural speaking. 
        Give only the final narration text, nothing extra.
        Scene captions:
        {captions}
    """

    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text.strip()
