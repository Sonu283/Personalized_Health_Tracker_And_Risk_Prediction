import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

# 1. Load the dataset
df = pd.read_csv("\risk\student_health_data.csv")  # Change filename if needed

# 2. Preprocessing
# Drop Student_ID if not useful
df.drop(columns=["Student_ID"], inplace=True)

# Encode categorical features
categorical_cols = ['Gender', 'Stress_Level_Self_Report', 'Physical_Activity', 'Sleep_Quality', 'Mood']
label_encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Encode target variable
target_le = LabelEncoder()
df['Health_Risk_Level'] = target_le.fit_transform(df['Health_Risk_Level'])

# 3. Split features and target
X = df.drop(columns=['Health_Risk_Level'])
y = df['Health_Risk_Level']

# 4. Scale numeric features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 5. Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)

# 6. Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 7. Evaluate the model
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred, target_names=target_le.classes_))

# 8. Save model and encoders
joblib.dump(model, 'health_risk_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(target_le, 'target_encoder.pkl')
joblib.dump(label_encoders, 'feature_label_encoders.pkl')

print("Model and encoders saved successfully.")
