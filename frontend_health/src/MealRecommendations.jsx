// MealRecommendations.jsx - Component to display meal plan
import { useState } from 'react';

export default function MealRecommendations({ mealPlan }) {
  const [activeTab, setActiveTab] = useState('all');
  
  // Check if meal plan exists and has expected structure
  if (!mealPlan && typeof mealPlan !== 'object') {
    return (
      <div className="text-center text-red-600 p-4">
        Error: Invalid meal plan data received
      </div>
    );
  }

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Your Personalized Meal Plan</h2>
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center mb-6 border-b">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 mx-1 ${
            activeTab === 'all'
              ? 'border-b-2 border-green-500 text-green-600 font-medium'
              : 'text-gray-600 hover:text-green-500'
          }`}
        >
          All Meals
        </button>
        
        {mealTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2 mx-1 ${
              activeTab === type
                ? 'border-b-2 border-green-500 text-green-600 font-medium'
                : 'text-gray-600 hover:text-green-500'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      
      {/* Meal Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(activeTab === 'all' ? mealTypes : [activeTab]).map((mealType) => {
          // Skip if this meal type doesn't exist in the data
          if (!mealPlan[mealType] || !Array.isArray(mealPlan[mealType])) {
            return null;
          }
          
          return (
            <div key={mealType} className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                {mealType}
              </h3>
              
              <ul className="space-y-2">
                {mealPlan[mealType].map((meal, index) => (
                  <li key={index} className="p-2 hover:bg-gray-100 rounded flex items-start">
                    <div className="h-3 w-3 mt-1.5 bg-green-500 rounded-full mr-2"></div>
                    <span>{meal}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Print Button */}
      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => window.print()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Meal Plan
        </button>
      </div>
    </div>
  );
}