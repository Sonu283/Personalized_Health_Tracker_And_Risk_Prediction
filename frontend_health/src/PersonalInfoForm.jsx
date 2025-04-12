// PersonalInfoForm.jsx - Form to collect user health data with fewer restrictions
import { useState } from 'react';

export default function PersonalInfoForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    Ages: 25,
    Gender: "Male",
    Height: 175,
    Weight: 70,
    Activity_Level: "Moderately Active",
    Dietary_Preference: "Omnivore",
    Daily_Calorie_Target: 2200,
    Diseases: []
  });

  const activityLevels = ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"];
  const dietaryPreferences = ["Omnivore", "Vegetarian", "Vegan"];
  const diseaseOptions = ["Heart Disease", "Hypertension", "Diabetes", "Kidney Disease", "Weight Gain"];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // For number inputs, parse to integer
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : parseInt(value, 10)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDiseaseChange = (disease) => {
    setFormData(prev => {
      const diseases = [...prev.Diseases];
      if (diseases.includes(disease)) {
        return { ...prev, Diseases: diseases.filter(d => d !== disease) };
      } else {
        return { ...prev, Diseases: [...diseases, disease] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (formData.Ages < 1 || formData.Height < 1 || formData.Weight < 1) {
      alert("Please enter valid values for age, height, and weight");
      return;
    }
    
    // Convert Activity_Level to match API expectation
    const submissionData = {
      ...formData,
      Activity_Level: formData.Activity_Level === "Moderately Active" ? "Moderate" : formData.Activity_Level
    };
    
    onSubmit(submissionData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Health Profile</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="age">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="Ages"
              value={formData.Ages}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="Gender"
              value={formData.Gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Height Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="height">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              name="Height"
              value={formData.Height}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Weight Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="weight">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="Weight"
              value={formData.Weight}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="activity">
              Activity Level
            </label>
            <select
              id="activity"
              name="Activity_Level"
              value={formData.Activity_Level}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              {activityLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Dietary Preference */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="diet">
              Dietary Preference
            </label>
            <select
              id="diet"
              name="Dietary_Preference"
              value={formData.Dietary_Preference}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              {dietaryPreferences.map(diet => (
                <option key={diet} value={diet}>{diet}</option>
              ))}
            </select>
          </div>

          {/* Calorie Target */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="calories">
              Daily Calorie Target
            </label>
            <input
              type="number"
              id="calories"
              name="Daily_Calorie_Target"
              value={formData.Daily_Calorie_Target}
              onChange={handleChange}
              min="1000"
              max="4000"
              step="50"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>

        {/* Health Conditions */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">
            Health Conditions (if any)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {diseaseOptions.map(disease => (
              <div key={disease} className="flex items-center">
                <input
                  type="checkbox"
                  id={disease.replace(/\s+/g, '')}
                  checked={formData.Diseases.includes(disease)}
                  onChange={() => handleDiseaseChange(disease)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor={disease.replace(/\s+/g, '')} className="ml-2 text-gray-700">
                  {disease}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Meal Plan...
              </span>
            ) : (
              'Get Meal Recommendations'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}