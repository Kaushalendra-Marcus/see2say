import base64
from gtts import gTTS
from io import BytesIO

def text_to_speech_base64(text: str) -> str:
    """
    Generating the base64 audio string to convert caption statement into audio
    """
    tts = gTTS(text = text,lang = "hi")
    buf= BytesIO()
    tts.write_to_fp(buf)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")
    