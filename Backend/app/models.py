import cv2
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image

print("Loading Blip Model")
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

print("Blip Model loaded successfully")

def extract_frames(video_path, interval=2):
    """Video se frames nikalta hai fixed interval pe"""
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


def generate_caption(frame):
    """Ek single frame ke liye caption banata hai"""
    image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)) 
    # converting matrix image into image object file  NUM array -> PIL Image
    inputs = processor(image, return_tensors="pt") #it will convert image into tensor or matrix so model can understand and vice verca for the computer version
    out = model.generate(**inputs)
    caption = processor.decode(out[0], skip_special_tokens=True)
    return caption


def extract_and_caption_frames(video_path, interval=2):
    """Video se frames nikal ke unke captions banata hai"""
    frames = extract_frames(video_path, interval)
    captions = [generate_caption(frame) for frame in frames]
    print(type(captions))
    print(captions)
    for c in captions:
        print("Captions are from the images are ::::::", c)
    return captions
