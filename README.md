# See2Say - AI Vision to Speech for the Visually Impaired

**See2Say** is an AI-powered accessibility platform that helps visually impaired users understand videos through natural speech. It converts video content into meaningful audio narration using modern Computer Vision and Generative AI.

Think of it as: A companion that describes visual surroundings through audio.

---

## What See2Say Does

1. User uploads a video
2. Video is broken into frames using OpenCV
3. Each frame is captioned using BLIP (Vision-Language Model)
4. All captions are merged into natural Hinglish narration using Gemini
5. Final narration is converted into audio output
6. User listens to the scene description without needing visual access

---

## Core Features

- AI-based video understanding
- Vision to Language to Speech pipeline
- Hinglish narration (human-like, not robotic)
- Built for blind and low-vision users
- FastAPI backend (scalable)
- React + Tailwind frontend
- Hugging Face-ready deployment

---

## Tech Stack

### Backend (FastAPI)

```
fastapi
uvicorn
python-dotenv
google-genai
opencv-python
Pillow (PIL)
transformers
torch
gtts
numpy
```

**Technology Choices**

- `transformers + torch` for BLIP image captioning
- `google-genai` for Gemini summarization
- `opencv-python` for frame extraction
- `gtts` for text-to-speech conversion
- `fastapi` for clean, asynchronous API backend

### Frontend (React + Vite)

```json
{
  "react": "^19.x",
  "vite": "^7.x",
  "tailwindcss": "^4.x"
}
```

- Minimal UI focused on accessibility
- Lightweight and fast performance

---

## Project Structure

```
see2say/
├── Backend/
│   ├── main.py                # FastAPI entry point
│   ├── app/
│   │   ├── routes.py          # API routes
│   │   ├── models.py          # BLIP captioning logic
│   │   ├── gemini_client.py   # Gemini summarization
│   │   ├── utils.py           # TTS and helper functions
│   └── uploads/               # Temporary video storage
│
├── frontend/
│   ├── src/
│   ├── package.json
│
├── requirements.txt
├── Dockerfile
├── .gitignore
└── README.md
```

---

## Environment Variables

Create a `.env` file (do not commit this file):

```
GEMINI_API_KEY=your_api_key_here
```

On Hugging Face Spaces, set this under Settings -> Repository Secrets.

---

## How It Works

```
Video Input
  ↓
Frame Extraction (OpenCV)
  ↓
Image Captioning (BLIP)
  ↓
Narration Generation (Gemini)
  ↓
Speech Synthesis (gTTS)
  ↓
Audio Output
```

---
### Screenshots
  <img width="1761" height="969" alt="image" src="https://github.com/user-attachments/assets/8a80b50f-b1dc-430b-b592-204834b0d7bb" />
  <img width="634" height="545" alt="image" src="https://github.com/user-attachments/assets/d3782390-47a5-401a-8ca0-3286f1e27915" />

## API Endpoint

### POST /process-video

**Input**
- Video file upload

**Output**
```json
{
  "captions": ["man walking on road", "car passing by"],
  "final_summary": "Ek aadmi road ke side chal raha hai...",
  "audio": "base64_audio_string"
}
```

---

## Local Setup

### Backend Setup

```bash
pip install -r requirements.txt
uvicorn Backend.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Deployment

- Backend deployed using Hugging Face Spaces (Docker)
- Models are not stored in GitHub repository
- BLIP model downloads at runtime from Hugging Face Hub

This approach keeps the repository clean, lightweight, and secure.

---

## Security Notes

- `.env` file is never committed to version control
- Model weights are never pushed to the repository
- Secrets managed via Hugging Face settings or environment variables

---

## Use Cases

- Accessibility for visually impaired users
- Video narration and summarization
- Multimodal AI research
- Assistive learning tools

---

## Future Improvements

- Real-time camera narration
- Multi-language support
- Emotion-aware descriptions
- Mobile-first UI optimization
- Offline TTS fallback capability

---

## Project Significance

Accessibility is not merely a feature—it is a responsibility. See2Say is built to reduce dependency and provide blind users with greater confidence in understanding their visual environment.

---
