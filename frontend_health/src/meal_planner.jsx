// App.jsx - Main application component
import { useState } from 'react';
import PersonalInfoForm from './PersonalInfoForm';
import MealRecommendations from './MealRecommendations';

export default function App() {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMealPlan = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/predict_meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch meal recommendations');
      }
      
      const data = await response.json();
      setMealPlan(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching meal plan:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">HealthyMeal Planner</h1>
          <p className="mt-2">Get personalized meal recommendations based on your health profile</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {!mealPlan ? (
          <PersonalInfoForm onSubmit={fetchMealPlan} isLoading={loading} />
        ) : (
          <div>
            <MealRecommendations mealPlan={mealPlan} />
            <button 
              onClick={() => setMealPlan(null)}
              className="mt-8 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create New Plan
            </button>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </main>
      
      <footer className="bg-gray-100 mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 HealthyMeal Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}