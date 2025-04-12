

import pandas as pd
import numpy as np
import os
import joblib
import warnings

from sklearn.preprocessing import LabelEncoder, RobustScaler
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, f1_score
from imblearn.over_sampling import SMOTE

from xgboost import XGBClassifier
from lightgbm import LGBMClassifier

warnings.filterwarnings("ignore", category=UserWarning)
os.environ['PYTHONWARNINGS'] = 'ignore'

# Load and clean dataset
df = pd.read_csv("detailed_meals_macros_CLEANED.csv")
df.columns = df.columns.str.strip().str.replace(' ', '_').str.replace('.', '', regex=False)

categorical_cols = ['Gender', 'Activity_Level', 'Dietary_Preference', 'Disease']
df[categorical_cols] = df[categorical_cols].astype(str).apply(lambda x: x.str.strip())

# Define features including Disease
input_features = ['Ages', 'Gender', 'Height', 'Weight', 'Activity_Level', 'Dietary_Preference', 'Daily_Calorie_Target', 'Disease']
X = pd.get_dummies(df[input_features])
reference_columns = X.columns.tolist()

# Save reference columns
os.makedirs("models", exist_ok=True)
joblib.dump(reference_columns, "models/reference_columns.pkl")

# Target columns for meals
meal_targets = {
    'Breakfast': 'Breakfast_Suggestion',
    'Lunch': 'Lunch_Suggestion',
    'Dinner': 'Dinner_Suggestion',
    'Snacks': 'Snack_Suggestion'
}

def drop_rare_classes(X, y_encoded, min_samples=2):
    counts = np.bincount(y_encoded)
    valid_classes = [i for i, count in enumerate(counts) if count >= min_samples]
    mask = np.isin(y_encoded, valid_classes)
    return X[mask], y_encoded[mask]

def train_and_save_model(meal_name, label_col):
    print(f"\n🚀 Training model for: {meal_name}")
    y = df[label_col].astype(str).str.strip()
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    X_cleaned, y_cleaned = drop_rare_classes(X, y_encoded)

    if len(np.unique(y_cleaned)) < 2:
        print(f"❌ Not enough classes for {meal_name}. Skipping.")
        return

    print(f"📊 Class distribution for {meal_name}: {np.bincount(y_cleaned)}")

    try:
        min_class_count = min(np.bincount(y_cleaned))
        k_neighbors = min(5, min_class_count - 1) if min_class_count > 1 else 1
        smote = SMOTE(k_neighbors=k_neighbors, random_state=42)
        X_res, y_res = smote.fit_resample(X_cleaned, y_cleaned)
    except ValueError as e:
        print(f"⚠️ SMOTE failed for {meal_name}: {e}")
        return

    if len(X_res) > 5000:
        X_res, _, y_res, _ = train_test_split(X_res, y_res, train_size=5000, stratify=y_res, random_state=42)

    X_train, X_test, y_train, y_test = train_test_split(X_res, y_res, test_size=0.2, stratify=y_res, random_state=42)

    estimators = [
        ('rf', RandomForestClassifier(n_estimators=150, max_depth=20, class_weight='balanced', n_jobs=-1, random_state=42)),
        ('xgb', XGBClassifier(n_estimators=120, max_depth=8, use_label_encoder=False, eval_metric='mlogloss', n_jobs=-1, random_state=42)),
        ('lgbm', LGBMClassifier(n_estimators=120, max_depth=8, class_weight='balanced', n_jobs=-1, verbose=-1, random_state=42))
    ]
    final_estimator = LogisticRegression(max_iter=2000, class_weight='balanced', random_state=42)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    stacking = StackingClassifier(estimators=estimators, final_estimator=final_estimator, cv=cv, n_jobs=-1)
    pipeline = Pipeline([
        ('scaler', RobustScaler()),
        ('clf', stacking)
    ])

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    f1_macro = f1_score(y_test, y_pred, average='macro')

    print(f"✅ Accuracy for {meal_name}: {acc:.2%}")
    print(f"📈 Macro F1-score: {f1_macro:.4f}")
    labels_used = np.unique(y_test)
    print(classification_report(y_test, y_pred, labels=labels_used, target_names=le.inverse_transform(labels_used)))

    joblib.dump(pipeline, f"models/{meal_name}_model.pkl")
    joblib.dump(le, f"models/{meal_name}_label_encoder.pkl")
    print(f"💾 Saved: models/{meal_name}_model.pkl and label encoder")

    sample = X_test.iloc[0:1]
    probs = pipeline.predict_proba(sample)[0]
    top3 = np.argsort(probs)[-3:][::-1]
    top3_meals = [le.inverse_transform([i])[0] for i in top3]
    print(f"🍽️ Top 3 {meal_name} suggestions: {top3_meals}")

# Train all models
for meal, label in meal_targets.items():
    train_and_save_model(meal, label)
