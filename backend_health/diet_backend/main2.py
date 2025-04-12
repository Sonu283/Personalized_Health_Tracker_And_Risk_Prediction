import warnings
warnings.filterwarnings("ignore")

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import pandas as pd
import numpy as np
import joblib
import uvicorn
import os

# Initialize FastAPI app
app = FastAPI(title="Personalized Meal Recommendation API (with Disease Support)")

# Load reference columns to align input encoding
reference_columns = joblib.load("\diet_backend\models\reference_columns.pkl")

# Define the expected input schema
class UserProfile(BaseModel):
    Ages: int
    Gender: str
    Height: float
    Weight: float
    Activity_Level: str
    Dietary_Preference: str
    Daily_Calorie_Target: float
    Diseases: List[str]  # 🆕 Include list of diseases like ['Diabetes', 'Hypertension']

# Preprocessing function
def preprocess_input(user_input_dict: dict) -> pd.DataFrame:
    df = pd.DataFrame([user_input_dict])

    # Clean string columns
    for col in ['Gender', 'Activity_Level', 'Dietary_Preference']:
        df[col] = df[col].astype(str).str.strip()

    # Handle diseases (multi-label one-hot encoding)
    if 'Diseases' in df.columns:
        for disease in df.at[0, 'Diseases']:
            disease_col = f"Disease_{disease.strip()}"
            df[disease_col] = 1
        df = df.drop(columns=['Diseases'])

    # One-hot encode categorical columns
    df_encoded = pd.get_dummies(df)

    # Align with reference columns
    df_encoded = df_encoded.reindex(columns=reference_columns, fill_value=0)
    return df_encoded

# Prediction logic
def get_meal_predictions(user_input: dict) -> Dict[str, List[str]]:
    X_input = preprocess_input(user_input)
    predictions = {}

    for meal in ['Breakfast', 'Lunch', 'Dinner', 'Snacks']:
        try:
            model = joblib.load(f"models/{meal}_model.pkl")
            le = joblib.load(f"models/{meal}_label_encoder.pkl")

            probs = model.predict_proba(X_input)[0]
            top3_indices = np.argsort(probs)[-3:][::-1]
            top3_labels = [le.inverse_transform([i])[0] for i in top3_indices]

            predictions[meal] = top3_labels
        except Exception as e:
            predictions[meal] = [f"Error: {str(e)}"]

    return predictions

# API endpoint
@app.post("/predict_meals", response_model=Dict[str, List[str]])
async def predict_meals(user: UserProfile):
    try:
        user_input = user.dict()
        predictions = get_meal_predictions(user_input)
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the API (for local testing)
if __name__ == "__main__":
    uvicorn.run("main2:app", host="0.0.0.0", port=8000, reload=True)
