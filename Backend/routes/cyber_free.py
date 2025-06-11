from fastapi import APIRouter, HTTPException, Form, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi import APIRouter, HTTPException, Response
from io import BytesIO
import json
from malay.services.generator import CyberGenerator
from malay.config import settings
import os
router = APIRouter()
cg = CyberGenerator(api_key=settings.gemini_api)
image_dir = "/tmp/"
os.makedirs(image_dir, exist_ok=True)

@router.post("/cyber_free_image", status_code=200)
async def process_image(image: UploadFile = File(...)):
    try:
        # Save the image temporarily to process
        img_path = f"{image_dir}{image.filename}"
        with open(img_path, "wb") as buffer:
            buffer.write(image.file.read())

        # Use CyberGenerator to process the image
        img_bytes = cg.cyber_free_image(img_path)

        # Log the result size to ensure we have valid data
        print(f"Processed Image Size: {len(img_bytes)} bytes")

        # Return the processed image as a response
        return Response(content=img_bytes, media_type="image/png")
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing the image: {str(e)}")
# Endpoint to remove cyber bullying text and return cleaned text
@router.post("/cyber_free_text", status_code=200)
async def process_text(text: str = Form(...)):
    try:
        # Use CyberGenerator to process the text
        result = cg.cyber_free_text(text)

        # Return the cleaned text
        return {"status": "success", "cleaned_text": result['text']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing the text: {str(e)}")
