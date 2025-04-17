🩺 Personalized Health Tracker and Risk Prediction
A smart, AI-powered web application that tracks personal health and predicts potential health risks using multiple machine learning models. This system is designed to empower users with personalized insights into their health conditions, lifestyle, diet, and fitness.

Screenshot:
![WhatsApp Image 2025-04-17 at 09 54 38_3c39535d](https://github.com/user-attachments/assets/bea47b4a-b795-475e-b211-07b20a4f6a9e)
![WhatsApp Image 2025-04-17 at 09 55 05_2409f096](https://github.com/user-attachments/assets/752c58aa-58d7-44a0-a377-5fb84a704355)
![WhatsApp Image 2025-04-17 at 09 55 24_411f1f15](https://github.com/user-attachments/assets/a84a4b48-1d52-4d33-9ba3-9b4855919cd9)
![WhatsApp Image 2025-04-17 at 09 55 45_d60dc08f](https://github.com/user-attachments/assets/609a7e94-3a59-44e3-b0d2-8fe022ea6481)
![WhatsApp Image 2025-04-17 at 09 56 04_478a9dea](https://github.com/user-attachments/assets/40170d22-1b03-4eb1-911e-b6ef3361164a)
![WhatsApp Image 2025-04-17 at 09 57 03_c01ca662](https://github.com/user-attachments/assets/3d362843-6426-455c-9bdc-670c8746522a)


📌 Features
🔬 Disease Prediction – Predict common diseases based on symptoms using Logistic Regression.

🫀 ECG Classification – Classify ECG signals using Voting and Wighted Ensumbled.

🥗 Diet Recommendation – Get personalized diet recommendations using Random Forest.

🏃 Fitness Score Prediction – Predict fitness scores based on health metrics via Linear Regression.

⚠️ Health Risk Prediction – Advanced risk stratification using XGBoost.

🧠 Tech Stack
👨‍💻 Frontend:
React.js

Tailwind CSS

⚙️ Backend (API):
FastAPI

Python

🤖 Machine Learning:
scikit-learn

XGBoost

TensorFlow/Keras (for MLP model)

Pandas, NumPy, Matplotlib, Seaborn

🗂️ Modules Overview
1. 🥗 Diet Prediction
Model: Random Forest Classifier

Features: Preprocessing, Feature Engineering, Evaluation, Model Saving

2. 🦠 Disease Prediction
Model: Logistic Regression

Features: Label Encoding, Model Evaluation & Deployment

3. 🫀 ECG Signal Classification
Model: Voting + Weighted Ensumbled

Data: HDF5 ECG signals, CSV patient metadata

Techniques: Deep learning, Signal Processing

4. 🏋️ Fitness Prediction
Model: Linear Regression

Features: Feature Scaling, Accuracy Assessment

5. ⚠️ Risk Prediction
Model: XGBoost Classifier

Features: Feature Selection, Risk Stratification

🚀 Getting Started
🔧 Prerequisites
Python 3.9+

Node.js 16+

MongoDB or Firebase (optional for additional integrations)

📦 Installation
bash
Copy
Edit
# Clone the repository
git clone https://github.com/Sonu283/Personalized_Health_Tracker_And_Risk_Prediction.git
cd Personalized_Health_Tracker_And_Risk_Prediction

# Backend setup
cd backend
uvicorn super_main:app --reload

# Frontend setup
cd ../frontend
npm install
npm run dev

# Result
Here are the performance metrics and visual outputs of each module in the system:

🦠 Disease Prediction

![image](https://github.com/user-attachments/assets/b857d90f-ab40-44cd-a5ec-de94b32e675c)

🥗 Diet Prediction
![image](https://github.com/user-attachments/assets/3a85d79e-ae85-43d2-b5c1-d43eb023d203)


🫀 ECG Disease Classification
![image](https://github.com/user-attachments/assets/9ccb6eac-0227-4e1e-a471-64dce66730fb)


🏋️ Fitness Prediction
![image](https://github.com/user-attachments/assets/46705f18-e323-4927-b47e-e52c17fd0f10)


⚠️ Health Risk Prediction
![image](https://github.com/user-attachments/assets/7df70bcc-57a8-43f9-93c6-0a88834c3727)


Project under development 🚧 – Contributions are welcome!
