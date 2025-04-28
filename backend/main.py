from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import os
import shutil
import uuid

app = FastAPI()

# Create a folder to save uploaded files if it doesn't exist
UPLOAD_DIRECTORY = "uploaded_videos"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@app.get("/")
def root():
    return {"message": "Clip Finder API is running."}

@app.post("/upload/")
async def upload_video(file: UploadFile = File(...)):
    try:
        # Generate a random filename to avoid conflicts
        file_extension = os.path.splitext(file.filename)[1]
        random_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIRECTORY, random_filename)

        # Save the uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return JSONResponse(
            content={
                "message": "Upload successful",
                "saved_as": random_filename,
                "file_path": file_path
            },
            status_code=200
        )

    except Exception as e:
        return JSONResponse(
            content={
                "message": "Upload failed",
                "error": str(e)
            },
            status_code=500
        )
