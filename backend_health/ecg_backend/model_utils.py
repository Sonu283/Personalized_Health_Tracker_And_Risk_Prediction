import numpy as np
import pandas as pd
import joblib
from scipy.signal import find_peaks

def extract_features_from_csv(df):
    stats = df.describe().loc[['mean', 'std', 'min', 'max', '50%', '25%', '75%']].values.flatten()
    fft_features = np.abs(np.fft.fft(df.values))[:10].mean(axis=1)
    energy = np.sum(df.values**2, axis=0)
    peaks, _ = find_peaks(df.values.flatten())
    peak_features = [len(peaks), np.mean(df.values.flatten()[peaks]) if len(peaks) > 0 else 0]
    zero_crossings = np.sum(np.diff(np.signbit(df.values)))
    skewness = df.skew().values
    kurtosis = df.kurtosis().values
    combined = np.concatenate([stats, fft_features, energy, peak_features, [zero_crossings], skewness, kurtosis])
    return combined.reshape(1, -1)

def load_models():
    print("called")
    models = {
        'MLP': joblib.load("ecg_backend/ecg_disease/mlp_model.pkl"),
        'GB': joblib.load("ecg_backend/ecg_disease/gb_model.pkl"),
        'XGB': joblib.load("ecg_backend/ecg_disease/xgb_model.pkl"),
        'LGB': joblib.load("ecg_backend/ecg_disease/lgb_model.pkl"),
        'CATBOOST': joblib.load("ecg_backend/ecg_disease/catboost_model.pkl"),
        'RF': joblib.load("ecg_backend/ecg_disease/rf_model.pkl")
    }
    scaler = joblib.load("ecg_backend/ecg_disease/scaler.pkl")
    weights = joblib.load("ecg_backend/ecg_disease/ensemble_weights.pkl")
    
    # Normalize keys to uppercase for consistency
    weights = {k.upper(): v for k, v in weights.items()}
    return models, scaler, weights

def predict_from_csv(df):
    features = extract_features_from_csv(df)
    models, scaler, weights = load_models()
    scaled = scaler.transform(features)

    probas = {}
    for name, model in models.items():
        probas[name] = model.predict_proba(scaled)

    weighted_proba = sum(weights[name] * probas[name] for name in probas)
    final_prediction = np.argmax(weighted_proba, axis=1)[0]
    confidence = np.max(weighted_proba)

    return final_prediction, confidence
