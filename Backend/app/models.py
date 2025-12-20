import cv2
import numpy as np
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
from io import BytesIO
from fastapi import UploadFile

print("Loading Blip Model")
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
print("Blip Model loaded successfully")

async def read_image_from_upload(file: UploadFile):
    """Read image from UploadFile and convert to numpy array"""
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return image

def generate_caption(image: np.ndarray, max_length=60, num_beams=5, temperature=1.0) -> str:
    """Generate caption for a single image/frame"""
    # Convert BGR to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(image_rgb)
    
    inputs = processor(pil_image, return_tensors="pt")
    out = model.generate(**inputs, max_length=max_length, num_beams=num_beams)
    caption = processor.decode(out[0], skip_special_tokens=True)
    return caption

def extract_frames(video_path: str, interval=2):
    """Extract frames from video at fixed intervals"""
    cap = cv2.VideoCapture(video_path)
    frames = []
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % (fps * interval) == 0:
            frames.append(frame)
        frame_count += 1

    cap.release()
    return frames

def extract_and_caption_frames(video_path: str, interval=2):
    """Extract frames and generate captions for each"""
    frames = extract_frames(video_path, interval)
    captions = [generate_caption(frame) for frame in frames]
    return captions
