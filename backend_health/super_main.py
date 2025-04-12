
import warnings
warnings.filterwarnings("ignore")

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import pandas as pd
import numpy as np
import joblib
import os
import json

# Import ECG prediction helper
from ecg_backend.model_utils import predict_from_csv

# ✅ Only one app instance
app = FastAPI(title="Personalized Health Tracker API")

# ✅ CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================= Meal Prediction ==============================

MODEL_DIR = "\diet_backend\models"
reference_columns = joblib.load(os.path.join(MODEL_DIR, "reference_columns.pkl"))

class UserProfile(BaseModel):
    Ages: int
    Gender: str
    Height: float
    Weight: float
    Activity_Level: str
    Dietary_Preference: str
    Daily_Calorie_Target: float
    Diseases: List[str]

def preprocess_input(user_input_dict: dict) -> pd.DataFrame:
    df = pd.DataFrame([user_input_dict])
    for col in ['Gender', 'Activity_Level', 'Dietary_Preference']:
        df[col] = df[col].astype(str).str.strip()
    if 'Diseases' in df.columns:
        for disease in df.at[0, 'Diseases']:
            disease_col = f"Disease_{disease.strip()}"
            df[disease_col] = 1
        df = df.drop(columns=['Diseases'])
    df_encoded = pd.get_dummies(df)
    df_encoded = df_encoded.reindex(columns=reference_columns, fill_value=0)
    return df_encoded

def get_meal_predictions(user_input: dict) -> Dict[str, List[str]]:
    X_input = preprocess_input(user_input)
    predictions = {}
    for meal in ['Breakfast', 'Lunch', 'Dinner', 'Snacks']:
        try:
            model = joblib.load(os.path.join(MODEL_DIR, f"{meal}_model.pkl"))
            le = joblib.load(os.path.join(MODEL_DIR, f"{meal}_label_encoder.pkl"))
            probs = model.predict_proba(X_input)[0]
            top3_indices = np.argsort(probs)[-3:][::-1]
            top3_labels = [le.inverse_transform([i])[0] for i in top3_indices]
            predictions[meal] = top3_labels
        except Exception as e:
            predictions[meal] = [f"Error: {str(e)}"]
    return predictions

@app.post("/predict_meals", response_model=Dict[str, List[str]])
async def predict_meals(user: UserProfile):
    try:
        user_input = user.dict()
        predictions = get_meal_predictions(user_input)
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========================= Disease Prediction ==============================

disease_model = joblib.load("\disease_backend\saved_model\disease_prediction_model.joblib")
vectorizer = joblib.load("\disease_backend\saved_model\symptom_vectorizer.joblib")
label_encoder = joblib.load("\disease_backend\saved_model\label_encoder.joblib")

with open("\disease_backend\saved_model\model_metadata.json") as f:
    metadata = json.load(f)

class SymptomInput(BaseModel):
    symptoms: List[str]

@app.post("/predict_disease")
async def predict_disease(input_data: SymptomInput):
    symptoms = input_data.symptoms
    if not symptoms or not all(isinstance(s, str) for s in symptoms):
        raise HTTPException(status_code=400, detail="Invalid 'symptoms' input. Provide a list of strings.")
    symptom_text = ' '.join(symptoms)
    vectorized = vectorizer.transform([symptom_text])
    probs = disease_model.predict_proba(vectorized)[0]
    top_indices = np.argsort(probs)[::-1][:3]
    top_preds = [{
        "disease": label_encoder.inverse_transform([idx])[0],
        "confidence": round(float(probs[idx]) * 100, 2)
    } for idx in top_indices]
    return {
        "input_symptoms": symptoms,
        "predictions": top_preds,
        "model_info": {
            "type": metadata["model"],
            "accuracy": metadata["accuracy"],
            "version": metadata["version"]
        }
    }

# ========================= ECG Prediction ==============================

@app.post("/predict_ecg")
async def predict_ecg(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(file.file)
        prediction, confidence = predict_from_csv(df)
        return {
            "predicted_class": int(prediction),
            "confidence_percent": round(confidence * 100, 2)
        }
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

# ========================= Health Risk Prediction ==============================

# Load health risk model and encoders
health_model_path = "\health_risk_backend"
model = joblib.load(os.path.join(health_model_path, 'health_risk_model.pkl'))
scaler = joblib.load(os.path.join(health_model_path, 'scaler.pkl'))
target_encoder = joblib.load(os.path.join(health_model_path, 'target_encoder.pkl'))
feature_label_encoders = joblib.load(os.path.join(health_model_path, 'feature_label_encoders.pkl'))

class HealthData(BaseModel):
    Age: int
    Gender: str
    Heart_Rate: float
    Blood_Pressure_Systolic: float
    Blood_Pressure_Diastolic: float
    Stress_Level_Biosensor: float
    Stress_Level_Self_Report: str
    Physical_Activity: str
    Sleep_Quality: str
    Mood: str
    Study_Hours: float
    Project_Hours: float

@app.post("/predict_risk")
def predict_risk(data: HealthData):
    try:
        new_data = pd.DataFrame([data.dict()])

        for col, le in feature_label_encoders.items():
            val = new_data[col].values[0]
            if val not in le.classes_:
                print(f"⚠️ Warning: '{val}' not seen during training in column '{col}'. Using default '{le.classes_[0]}'")
                new_data[col] = le.transform([le.classes_[0]])[0]
            else:
                new_data[col] = le.transform([val])[0]

        input_features = [
            'Age', 'Gender', 'Heart_Rate', 'Blood_Pressure_Systolic',
            'Blood_Pressure_Diastolic', 'Stress_Level_Biosensor',
            'Stress_Level_Self_Report', 'Physical_Activity', 'Sleep_Quality',
            'Mood', 'Study_Hours', 'Project_Hours'
        ]
        new_data = new_data[input_features]

        scaled_data = scaler.transform(new_data)
        prediction = model.predict(scaled_data)
        predicted_label = target_encoder.inverse_transform(prediction)

        return {"predicted_risk": predicted_label[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========================= Fitness Prediction ==============================

fitness_model = joblib.load("\fitness_backend\fast_fitness_regressor.pkl")

class FitnessInput(BaseModel):
    age: int
    weight_kg: float
    height_cm: float
    bmi: float
    resting_heart_rate: int
    active_heart_rate: int
    avg_heart_rate: float
    daily_steps: int
    hours_sleep: float
    hydration_level: float
    water_intake_liters: float
    stress_level: int
    blood_pressure_systolic: int
    blood_pressure_diastolic: int
    calories_burned: int
    calorie_intake: int
    duration_minutes: int
    gender: str
    activity_type: str
    intensity: str
    health_condition: str
    smoking_status: str
@app.post("/predict_fitness")
def predict_fitness(data: FitnessInput):
    try:
        input_df = pd.DataFrame([data.dict()])
        prediction = fitness_model.predict(input_df)[0]

        # Categorize prediction
        if prediction <= 0.4:
            category = "Low"
        elif prediction <= 0.7:
            category = "Medium"
        else:
            category = "High"

        return {
            "predicted_fitness_score": round(prediction, 2),
            "fitness_level_category": category
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
