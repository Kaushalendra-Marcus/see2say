from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils import text_to_speech_base64
from app.models import generate_caption

router = APIRouter()

@router.get("/health")
async def health_check():
    """Check if API is alive"""
    return {"status": "OK"}

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image, generate caption using BLIP model, and return response.
    """
    try:
        # Read image directly from memory
        image = await read_image_from_upload(file)

        # Generate caption with advanced params
        caption = generate_caption(image, max_length=60, num_beams=5, temperature=1.0)

        return {"filename": file.filename, "caption": caption}

    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
