import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.experimental import enable_hist_gradient_boosting  # noqa
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.utils import compute_sample_weight
import joblib

# ------------------------------
# 1. Load Data
# ------------------------------
df = pd.read_csv("fitness\health_fitness_dataset.csv")
df.drop(columns=['participant_id', 'date'], inplace=True)

# ------------------------------
# 2. Data Cleaning
# ------------------------------
# Drop rows with missing values
df.dropna(inplace=True)

# Remove duplicates
df.drop_duplicates(inplace=True)

# Optional: Remove outliers based on z-score
from scipy.stats import zscore
df = df[(np.abs(zscore(df.select_dtypes(include=[np.number]))) < 3).all(axis=1)]

# ------------------------------
# 3. Visualize Target
# ------------------------------
sns.histplot(df['fitness_level'], kde=True)
plt.title("Distribution of Fitness Levels")
plt.xlabel("Fitness Level")
plt.ylabel("Count")
plt.show()

# ------------------------------
# 4. Define Features and Target
# ------------------------------
target = 'fitness_level'
X = df.drop(columns=[target])
y = df[target]

categorical_features = ['gender', 'activity_type', 'intensity', 'health_condition', 'smoking_status']
numerical_features = [col for col in X.columns if col not in categorical_features]

# ------------------------------
# 5. Preprocessing Pipeline
# ------------------------------
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
    ]
)

# ------------------------------
# 6. Sample Weighting (Balance)
# ------------------------------
# Bin fitness level for sample weighting (3 levels: low, medium, high)
y_bins = pd.cut(y, bins=[-np.inf, 0.4, 0.7, np.inf], labels=["low", "medium", "high"])
sample_weights = compute_sample_weight(class_weight='balanced', y=y_bins)

# ------------------------------
# 7. Model Definition
# ------------------------------
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', HistGradientBoostingRegressor(
        max_iter=150,
        max_depth=8,
        learning_rate=0.1,
        early_stopping=True,
        random_state=42
    ))
])

# ------------------------------
# 8. Train-Test Split
# ------------------------------
X_train, X_test, y_train, y_test, w_train, w_test = train_test_split(X, y, sample_weights, test_size=0.2, random_state=42)

# ------------------------------
# 9. Train the Model (With Sample Weights)
# ------------------------------
model.fit(X_train, y_train, regressor__sample_weight=w_train)

# ------------------------------
# 10. Evaluate Model
# ------------------------------
y_pred = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\n🔍 Model Evaluation Metrics")
print(f"📏 RMSE: {rmse:.2f}")
print(f"📉 MAE : {mae:.2f}")
print(f"📈 R²  : {r2:.4f}")

# Visualize
plt.figure(figsize=(6, 6))
plt.scatter(y_test, y_pred, alpha=0.6)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
plt.xlabel('Actual')
plt.ylabel('Predicted')
plt.title('Predicted vs Actual Fitness Level')
plt.grid(True)
plt.tight_layout()
plt.show()

# ------------------------------
# 11. Save Model
# ------------------------------
joblib.dump(model, "fast_fitness_regressor.pkl")
print("✅ Cleaned & balanced model saved as 'fast_fitness_regressor.pkl'")
