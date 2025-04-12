from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import json
import os

# Load saved components
MODEL_DIR = "saved_model"
model = joblib.load(os.path.join(MODEL_DIR, "disease_prediction_model.joblib"))
vectorizer = joblib.load(os.path.join(MODEL_DIR, "symptom_vectorizer.joblib"))
label_encoder = joblib.load(os.path.join(MODEL_DIR, "label_encoder.joblib"))

# Load metadata
with open(os.path.join(MODEL_DIR, "model_metadata.json")) as f:
    metadata = json.load(f)

# Initialize FastAPI app
app = FastAPI(
    title="Disease Prediction API",
    description="Predicts diseases based on input symptoms using an ensemble ML model",
    version="1.0.0"
)

# Define request model
class SymptomInput(BaseModel):
    symptoms: list[str]

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Disease Prediction API (FastAPI version!)"}

# Prediction endpoint
@app.post("/predict")
async def predict(input_data: SymptomInput):
    symptoms = input_data.symptoms

    if not symptoms or not all(isinstance(s, str) for s in symptoms):
        raise HTTPException(status_code=400, detail="Invalid 'symptoms' input. Provide a list of strings.")

    symptom_text = ' '.join(symptoms)
    vectorized = vectorizer.transform([symptom_text])
    probs = model.predict_proba(vectorized)[0]
    top_indices = np.argsort(probs)[::-1][:3]

    top_preds = [
        {
            "disease": label_encoder.inverse_transform([idx])[0],
            "confidence": round(float(probs[idx]) * 100, 2)
        }
        for idx in top_indices
    ]

    return {
        "input_symptoms": symptoms,
        "predictions": top_preds,
        "model_info": {
            "type": metadata["model"],
            "accuracy": metadata["accuracy"],
            "version": metadata["version"]
        }
    }
