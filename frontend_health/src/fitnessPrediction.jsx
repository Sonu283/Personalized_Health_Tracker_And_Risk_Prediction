import React, { useState } from 'react';
import axios from 'axios';

export default function FitnessPredictionForm() {
  const [formData, setFormData] = useState({
    age: '',
    weight_kg: '',
    height_cm: '',
    bmi: '',
    resting_heart_rate: '',
    active_heart_rate: '',
    avg_heart_rate: '',
    daily_steps: '',
    hours_sleep: '',
    hydration_level: '',
    water_intake_liters: '',
    stress_level: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    calories_burned: '',
    calorie_intake: '',
    duration_minutes: '',
    gender: '',
    activity_type: '',
    intensity: '',
    health_condition: '',
    smoking_status: ''
  });

  const [result, setResult] = useState(null);

  const dropdownOptions = {
    gender: ['male', 'female', 'other'],
    activity_type: ['cardio', 'strength', 'flexibility', 'balance'],
    intensity: ['low', 'moderate', 'high'],
    health_condition: ['none', 'diabetes', 'hypertension', 'asthma'],
    smoking_status: ['non-smoker', 'smoker', 'former smoker']
  };

  const numberFields = [
    'age', 'weight_kg', 'height_cm', 'bmi', 'resting_heart_rate',
    'active_heart_rate', 'avg_heart_rate', 'daily_steps', 'hours_sleep',
    'hydration_level', 'water_intake_liters', 'stress_level',
    'blood_pressure_systolic', 'blood_pressure_diastolic',
    'calories_burned', 'calorie_intake', 'duration_minutes'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData };

    // Type casting
    numberFields.forEach((field) => {
      payload[field] = payload[field] === '' ? null : parseFloat(payload[field]);
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict_fitness', payload);
      setResult(response.data);
    } catch (error) {
      console.error('Prediction error:', error.response?.data || error.message);
      setResult({ error: 'Something went wrong' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">🏋️ Fitness Score Predictor</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(formData).map((field) => (
          <div key={field} className="flex flex-col">
            <label className="mb-1 font-semibold capitalize text-sm text-gray-700">
              {field.replace(/_/g, ' ')}
            </label>
            {dropdownOptions[field] ? (
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select {field.replace(/_/g, ' ')}</option>
                {dropdownOptions[field].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                step="any"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-lg"
                required
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="col-span-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition"
        >
          Predict Fitness Score
        </button>
      </form>

      {result && (
        <div className="mt-6 text-center text-xl font-semibold text-gray-800">
          {result.error ? (
            <span className="text-red-600">{result.error}</span>
          ) : (
            <>
              🧮 Fitness Score: <span className="text-green-700">{result.predicted_fitness_score}</span> <br />
              📈 Fitness Level: <span className="text-blue-700">{result.fitness_level_category}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
