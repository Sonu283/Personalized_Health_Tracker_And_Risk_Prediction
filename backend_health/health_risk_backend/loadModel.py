
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

# Initialize FastAPI app
app = FastAPI()

# Load saved model and preprocessing tools
model = joblib.load('health_risk_model.pkl')
scaler = joblib.load('scaler.pkl')
target_encoder = joblib.load('target_encoder.pkl')
feature_label_encoders = joblib.load('feature_label_encoders.pkl')

# Define input schema using Pydantic
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
    # Convert incoming data to DataFrame
    new_data = pd.DataFrame([data.dict()])

    # Encode categorical columns safely
    for col, le in feature_label_encoders.items():
        val = new_data[col].values[0]
        if val not in le.classes_:
            print(f"⚠️ Warning: '{val}' not seen during training in column '{col}'. Using default '{le.classes_[0]}'")
            new_data[col] = le.transform([le.classes_[0]])[0]
        else:
            new_data[col] = le.transform([val])[0]

    # Ensure correct feature order
    input_features = [
        'Age', 'Gender', 'Heart_Rate', 'Blood_Pressure_Systolic',
        'Blood_Pressure_Diastolic', 'Stress_Level_Biosensor',
        'Stress_Level_Self_Report', 'Physical_Activity', 'Sleep_Quality',
        'Mood', 'Study_Hours', 'Project_Hours'
    ]
    new_data = new_data[input_features]

    # Scale the features
    scaled_data = scaler.transform(new_data)

    # Predict and decode label
    prediction = model.predict(scaled_data)
    predicted_label = target_encoder.inverse_transform(prediction)

    return {
        "predicted_risk": predicted_label[0]
    }
