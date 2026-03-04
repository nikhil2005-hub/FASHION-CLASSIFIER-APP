#File: main.py

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
model = tf.keras.models.load_model("kaggle_fashion_model.h5")
class_names = open("classes.txt").read().splitlines()

dummy = np.zeros((1, 128, 128, 3))
model.predict(dummy)


@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image = image.resize((128, 128))

    arr = np.array(image).astype("float32") / 255.0
    arr = np.expand_dims(arr, axis=0)

    preds = model.predict(arr, verbose=0)[0]

    # Top 3 predictions
    top_indices = preds.argsort()[-3:][::-1]

    results = [
        {
            "class": class_names[i],
            "confidence": float(preds[i])
        }
        for i in top_indices
    ]

    return {"predictions": results}