import React, { useState } from 'react';
import axios from 'axios';

export default function RiskPredictionForm() {
  const [formData, setFormData] = useState({
    Age: '',
    Gender: '',
    Heart_Rate: '',
    Blood_Pressure_Systolic: '',
    Blood_Pressure_Diastolic: '',
    Stress_Level_Biosensor: '',
    Stress_Level_Self_Report: '',
    Physical_Activity: '',
    Sleep_Quality: '',
    Mood: '',
    Study_Hours: '',
    Project_Hours: ''
  });

  const [result, setResult] = useState(null);

  const options = {
    Gender: ['M', 'F'],
    Stress_Level_Self_Report: ['Low', 'Moderate', 'High'],
    Physical_Activity: ['Low', 'Moderate', 'High'],
    Sleep_Quality: ['Poor', 'Average', 'Good', 'Excellent'],
    Mood: ['Sad', 'Anxious', 'Neutral', 'Happy']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict_risk', formData);
      setResult(response.data.predicted_risk);
    } catch (error) {
      console.error('Prediction error:', error);
      setResult('Error during prediction');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Health Risk Prediction</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(formData).map((field) => (
          <div key={field} className="flex flex-col">
            <label className="mb-1 font-semibold">{field.replace(/_/g, ' ')}</label>
            {options[field] ? (
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="p-2 border rounded-lg"
                required
              >
                <option value="">Select {field}</option>
                {options[field].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="p-2 border rounded-lg"
                step="any"
                required
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="col-span-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
        >
          Predict Risk
        </button>
      </form>

      {result && (
        <div className="mt-6 text-center text-xl font-medium">
          🔍 Predicted Risk: <span className="font-bold text-blue-700">{result}</span>
        </div>
      )}
    </div>
  );
}
