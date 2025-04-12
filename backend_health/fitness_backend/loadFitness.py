from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(
    title="🏃‍♂️ Fast Fitness Level Prediction API",
    description="Predicts fitness level from health and activity input using ML",
    version="1.0.0"
)

# ------------------------------
# Load Model
# ------------------------------
model = joblib.load("fast_fitness_regressor.pkl")

# ------------------------------
# Input Schema using Pydantic
# ------------------------------
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

# ------------------------------
# Prediction Route
# ------------------------------
@app.post("/predict")
def predict_fitness(data: FitnessInput):
    # Convert input to DataFrame
    input_df = pd.DataFrame([data.dict()])
    
    # Predict fitness level
    prediction = model.predict(input_df)[0]

    # Categorize fitness level
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
